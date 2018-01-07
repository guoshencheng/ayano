import ReactDOM from 'react-dom';
import React from 'react';
import { Toast, Popup } from 'antd-mobile';
import { createApp } from 'ayano-react';
import router, { App } from './router';
import pathToRegexp from 'path-to-regexp';
import { AppContainer } from 'react-hot-loader';

import reducer from './scripts/reducer';
import * as actions from './scripts/actions';
import request from './scripts/request.js';
import './index.less';

var app = createApp({ reducer, actions, request, router })

const render = Component => {
  console.log('rendering...')
  ReactDOM.render(
    <AppContainer warnings={false}>
      <Component />
    </AppContainer>,
    document.getElementById('root'))
}

if (module.hot) {
  module.hot.accept('./router', () => {
    const router = require('./router').default;
    app.updateRouter(router);
    render(app.render)
  })
}
render(app.render);
