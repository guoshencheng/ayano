import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import createHistory from 'history/createHashHistory';
import ayanoThunk from './thunk.js';
import reduxThunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter, routerReducer } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom';
import { request } from './request';
import { is, analysisRouteTree, buildReducers } from './utils';
import { buildConstantsTree, buildConstants, buildConstantToAction } from './constant.js';

let _actions = {}


/**
 * handle router tree like
{
  c1: {
    path: 'c1',
    children: {
      c2: {
        path: '/c2',
        component: c2
      },
      c3: {
        path: '/c3',
        component: c3
      }
    }
  }
}
*/

export const CustomRouter = (history, routers) => (
  <ConnectedRouter history={ history }>
    <div>
      <Switch>
      {
        routers.map(router => {
          return <Route key={ router.path } { ...router }/>
        })
      }
      </Switch>
    </div>
  </ConnectedRouter>
)

export * from './utils.js';
export * from './request';
export * from './constant.js';
export { default as ayanoThunk } from './thunk.js';

export const connectApp = (mapState) => (component) => {
  return connect(mapState, () => ({ actions: _actions }))(component);
}

/**
 * [createApp create ayano app]
 * @param  {Object} options [description]
 *  |- @param  {Object} constants [redux action type]
 *  |- @param  {Object} actions [redux actions]
 *  |- @param  {Object} reducers [redux reducers] or [ a reducers set ]
 *  |- @param  {Object || Array} routers [routers to build react-router-dom Route]
 *  |- @param  {Object} apis [ request route api describe object ]
 *  |- @param  {Object} history [ react-router history default is hash history]
 *  |- @param  {Object} hooks [ global hooks for handle error or others ]
 *  |- @param  {Object} auto [ open [AUTO MODE] to do things more sinple ]
 *  |- @param  {Object} prefix [ a prefix to auto generate a constants by reducers ]
 */
export const createApp = (options) => {
  // init params at options
  let constants = options.constants || {};
  const actions = options.actions || {};
  let reducers = options.reducers || ((state = {}, action) => (state));
  const routers = options.routers || [];
  const apis = options.apis || [];
  const history = options.history || createHistory();
  const hooks = options.hooks || {};
  const auto = options.auto || false;
  const customThunk = options.customThunk;
  const prefix = options.prefix || "";

  const thunk = !!customThunk ? ayanoThunk : reduxThunk;

  // init request apis use apis[key](data) to send request. example: apis.login({ username: 'century guo', password: 'bestsoftwareengine' })
  const { onRequestError, onHandleRequest } = hooks;
  const _apis = request(apis, { handleResponse: onHandleRequest, catchError: onRequestError });

  // create routers
  let RouterComponent;
  let _routers;
  if (is.fn(routers)) {
    RouterComponent = routers(history);
    if (!RouterComponent) {
      console.warn(`the router function should return a component`);
    }
  } else {
    _routers = analysisRouteTree(routers);
    RouterComponent = CustomRouter(history, Object.keys(_routers).map(k => _routers[k]));
  }

  if (auto) {
    if (is.object(reducers)) {
      const _constants = constants;
      const tree = buildConstantsTree(reducers);
      constants = buildConstants(tree, prefix);
      constants = Object.assign({}, constants, { extra: _constants })
      reducers = buildReducers(reducers, prefix, void 6, { router: routerReducer } );
    }
  }

  let _reducers = {}
  // init middlewares, inject some props which can be use in actions (dispatch, state, { apis, constants, actions }) => { ... } to see: https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
  let middlewares = options.middlewares || [ thunk.withExtraArgument({ apis: _apis, constants, actions: _actions, routers: _routers }), routerMiddleware(history) ];

  // init store
  const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)));

  // bind action with dispath
  const { dispatch } = store;

  const buildAction = (constant) => {
    return (action) => {
      dispatch(Object.assign({}, action, { type: constant }))
    }
  }
  const constantActions = buildConstantToAction(constants, buildAction, _reducers);
  Object.keys(actions).reduce((pre, key) => {
    const value = actions[key];
    pre[key] = bindActionCreators(value, dispatch);
    return pre;
  }, _actions);
  _actions.reducerActions = _reducers;

  // return app object
  return {
    _history: history, _store: store, _actions: _actions, _apis: _apis, _routers,
    start: (element) => {
      render(
        <Provider store={ store }>
          { RouterComponent }
        </Provider>,
        element
      )
    }
  }
}
