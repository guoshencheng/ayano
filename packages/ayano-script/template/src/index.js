import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Toast, Popup } from 'antd-mobile';
import { createApp } from 'ayano-react';

//redux actions and reducers
import reducers from './scripts/reducers';
import * as actions from './scripts/actions';

// NEW FEATURE: this is deprecated with option auto true and object type reducer
console.warn(` ayano-REACT!!! NEW FEATURE: src/index.js line 12 deprecated with option auto true and object type reducer`);
import constants from './scripts/constants.js';

// api routers define
import apis from './scripts/apis.js';

//router components
import Home from './views/Home/Home.js';

import './index.scss';

const routers = {
  home: {
    path: '/',
    component: Home,
  },
  a: {
    path: '/a',
    children: {
      a1: {
        path: '/:id/a1',
        component: Home
      }
    }
  }
}

const app = createApp({ reducers, routers, actions, apis, constants, auto: true, customThunk: true, prefix: "@ayano-react" });
app.start(document.querySelector('#root'));
