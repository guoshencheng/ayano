import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
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

export const createApp = (options) => {
  const actions = options.actions || {};
  const reducers = options.reducers || ((state = {}, action) => (state));
  const routers = options.routers || [];
  const history = options.history || createHistory();
  let middlewares = [ thunk, routerMiddleware(history) ];
  const store = createStore(reducers, applyMiddleware(...middlewares));
  const RouterComponent = CustomRouter(history, routers);
  return {
    _history: history,
    _store: store,
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
