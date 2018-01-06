import { connect } from 'react-redux';
// local lib
import Reducer from './Reducer';
import Request, { methods } from './Request';
import Router, { RouterRenderer } from './Router';
import AppRenderer from './AppRenderer';
import AppManager from './AppManager';
import App from './App';
import { logger } from 'ayano-utils';
import { patchFn } from './utils';
import withAyanoActionBuilder from './withAyanoAction';
import thunk from './thunk';

const withAyanoAction = withAyanoActionBuilder(AppManager);

// export
exports.Reducer = Reducer;
exports.Request = Request;
exports.methods = methods;
exports.Router = Router;
exports.AppRenderer = AppRenderer;
exports.RouterRenderer = RouterRenderer;
exports.withAyanoAction = withAyanoAction;
exports.thunk = thunk;

export const connectAyano = (mapState) => (Component) => {
  return withAyanoAction(connect(mapState)(Component));
}

/**
 * options.name 创建的APP的名字，如果有多个app的话，可以根据name进行管理
 * options.reducer  一个 MUM REACT REDUCER的对象 必须
 * options.actions 一个 actions的集合 必须
 * options.router 一个 MUM REACT ROUTER的对象 必须
 * options.request 一个MUM REACT REQUEST请求的参数的配置文件 可选
 * options.history 关系到router的使用，应用所用到的 history 默认为hashHistory
 * options.middlewares 可选，redux中间件，会覆盖所有的中间件来使用用户的设置
 */

export const createApp = (options) => {
  var app = new App(options);
  patchFn(app, AppRenderer);
  AppManager.set(options.name, app);
  return app;
}
