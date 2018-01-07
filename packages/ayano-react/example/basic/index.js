import { createApp, Request } from '../../src/index.js';
import '../style.scss'
import apis from './apis';
import reducer from './reducer';
import actions from './actions';
import router from './router';

import React from 'react';
import ReactDOM from 'react-dom';

const mapStateToProps = (state) => {
  return state;
}

var request = new Request({
  baseURL: 'https://git.dawanju.net/api/v4',
  apis,
  headers: {'Server-Origin': 'foobar'}
})

var app = createApp({ reducer, actions, request, router })
const Layout = ({ children }) => {
  return (
    <div>
      <div> -----------------------------layout------------------------------- </div>
      {children}
    </div>
  )
}
app.start(document.querySelector('#basic'), Layout)
