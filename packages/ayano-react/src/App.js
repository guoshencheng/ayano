import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import createHistory from 'history/createHashHistory';
import { bindActionCreators } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from './thunk.js';
import { is, logger } from 'ayano-utils';

const puppetPropsMaps = {
  apis: 'apis', reducers: 'reducerActions', actions: 'actions', routers: 'routers', toPath: 'toPath'
}

export default class App {
  constructor(options) {
    options = options || {};
    // 创建了一个傀儡，用于在thunk中代理访问到当前对象的某几个属性
    this.puppet = this.toPuppet();
    this.name = options.name;
    // 使用链式调用，为了能清楚的知道整个流程的顺序
    this.initHistory(options.history)
        .setRequest(options.request)
        .setReducer(options.reducer, options)
        .setReduxMiddleware(options.middlewares)
        .initStore()
        .initActions(options.actions)
        .initRouter(options.router)
         // apis: _apis, constants, actions: _actions, routers: _routers
  }

  // 初始化路由属性，准备渲染，并初始化toPath，用于之后路由跳转
  initRouter(router) {
    this.updateRouter(router);
    if (router) {
      this.onMatchLocation(this.history.location, this.history.action);
    }
    return this;
  }

  updateRouter(router) {
    this.router = router;
    if (router) {
      this.toPath = router.toPath();
      this.onMatchLocation = router.onMatchLocation(this.puppet);
      this.unListenerHistory = this.history.listen(this.onMatchLocation);
    }
  }

  // 创建历史，默认为hashHistory
  initHistory(history) {
    this.history = history || createHistory();
    return this;
  }

  //创建了store 并尝试创建reducerActions
  initStore() {
    const store = createStore(this.reduxReducer, composeWithDevTools(applyMiddleware(...this.middlewares)));
    this.store = store;
    this.reducer && (this.reducerActions = this.reducer.toReducerAction(this.store.dispatch));
    return this;
  }

  // 绑定actions到dispatch上，隐藏dispatch
  initActions(actions) {
    this.originActions = actions;
    this.actions = Object.keys(actions).reduce((pre, key) => {
      const action = actions[key];
      pre[key] = bindActionCreators(action, this.store.dispatch);
      return pre;
    }, {})
    return this;
  }

  // 使用request 初始化apis
  setRequest(request) {
    this.request = request;
    const apis = request && request.toApis();
    apis && logger.log('generate apis: ', apis);
    this.apis = apis;
    return this;
  }

  addDefaultReducer(reducer) {
    reducer.useOriginReducer("router", routerReducer);
  }
  // 将传入的reducer对象转换成 redux reducer并尝试创建reducerActions
  setReducer(reducer, { addDefaultReducer }) {
    this.reducer = reducer;
    addDefaultReducer = addDefaultReducer || this.addDefaultReducer;
    addDefaultReducer(this.reducer);
    const reduxReducer = reducer && reducer.toReduxReducers();
    reducer && logger.log('generate redux reducer & reducer actions: ', reduxReducer);
    this.reduxReducer = reduxReducer;
    if (this.store) {
      const reducerActions = reducer.toReducerAction(this.store.dispatch);
      this.reducerActions = reducerActions;
    }
    return this;
  }

  // 定义默认的redux middlewares
  defaultReduxMiddware() {
    return [ thunk.withExtraArgument(this.puppet), routerMiddleware(this.history) ];
  }

  // 使用参数中的middlewares设置middlewares，如果是个function则使用返回值
  setReduxMiddleware(middlewares) {
    const defaultReduxMiddware = this.defaultReduxMiddware();
    this.middlewares = middlewares || defaultReduxMiddware;
    if (middlewares && is(TYPES.Function)(middlewares)) {
      this.middlewares = middlewares(defaultReduxMiddware) || defaultReduxMiddware;
    }
    return this;
  }

  // 生成一个傀儡，用于代理访问某些属性, 并只读
  toPuppet(app) {
    var handler = {
      get: (target, name) => {
        if (puppetPropsMaps[name]) {
          return target[puppetPropsMaps[name]];
        } else {
          return void 0;
        }
      },
      set: (target, name, value) => {
        throw new Error("禁止为apis设置属性")
      }
    }
    return new Proxy(this, handler);
  }
}
