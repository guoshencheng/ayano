import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Toast, Popup } from 'antd-mobile';
import { createApp } from 'ayano-react';
import reducers from './scripts/reducers';
import Home from './views/Home/Home.js';
import { repo } from './scripts/actions';
import './index.scss';

const routers = [{
  path: '/',
  component: Home,
}]

const app = createApp({ reducers, routers,
  actions: {
    repo
  }
});

app.start(document.querySelector('#root'));
