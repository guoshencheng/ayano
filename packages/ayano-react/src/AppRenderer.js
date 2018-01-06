import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { RouterRenderer } from './Router';

export default {
  // 将router渲染出来
  renderRouter() {
    return (
      <ConnectedRouter history={this.history}>
        <RouterRenderer router={this.router}></RouterRenderer>
      </ConnectedRouter>
    )
  },
  // 渲染这个应用
  render(Layout) {
    this.prepare && this.prepare();
    Layout = Layout || (({ children }) => (children));
    return (
      <Provider store={this.store}>
        <Layout>
          {this.renderRouter()}
        </Layout>
      </Provider>
    )
  },
  // 开始这个应用
  start(element, Layout) {
    ReactDOM.render(this.render(Layout), element);
  }
}
