import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import createHistory from 'history/createHashHistory';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom';

let _actions = {}

const CustomRouter = (history, routers) => (
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

export const connectApp = (mapState) => (component) => {
  return connect(mapState, () => ({ actions: _actions }))(component);
}

export const createApp = (options) => {
  const actions = options.actions || {};
  const reducers = options.reducers || ((state = {}, action) => (state));
  const routers = options.routers || [];
  const history = options.history || createHistory();
  let middlewares = [ thunk, routerMiddleware(history) ];
  const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)));
  const { dispatch } = store;
  _actions = Object.keys(actions).reduce((pre, key) => {
    const value = actions[key];
    pre[key] = bindActionCreators(value, dispatch);
    return pre;
  }, {})
  const RouterComponent = CustomRouter(history, routers);
  return {
    _history: history,
    _store: store,
    _actions: _actions,
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
