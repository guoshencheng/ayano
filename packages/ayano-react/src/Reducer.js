/**

doc

``` javascirpt
import { Reducer } from 'ayano-react';

var reducer = new Reducer();
reducer.use('INIT_GUOSHENCHENG', (state, payload) => {})
reducer.use('GUOSHENCHENG', (state, payload) => {});

var root = new Reducer();

root.use('guoshencehng', reducer);

```
 */

import { is, TYPES } from 'ayano-utils';
import { combineReducers } from 'redux';

function isVaildOldReducerChild(reducer) {
  if (reducer.reducers && is(TYPES.Object)(reducer.reducers)) {
    return true;
  } else {
    return false;
  }
}

export default class Reducer {
  constructor({ defaultState, prefix } = {}) {
    this.defaultState = defaultState || {};
    this.prefix = prefix || "@ayano-reducer",
    this.reducers = {}; // Reducer 的对象，需要递归的处理
    this.handlers = {}; // 可直接处理数据的函数
    this.originReducer = {}; // redux reducer的处理方法
  }
  useOriginReducer(key, fn) {
    if (is(TYPES.Function)(fn)) {
      this.originReducer[key] = fn;
    }
  }
  use(key, fn) {
    if (is(TYPES.Function)(fn)) {
      this.handlers[key] = fn;
    } else if(fn instanceof Reducer) {
      this.reducers[key] = fn;
    } else {
      console.warn(`reducer which key is ${key} is not either a fuction or ayano-react/dist/reducer`);
    }
  }

  toReducerAction(dispatch, prefix) {
    prefix = prefix || this.prefix;
    let actions = Object.keys(this.handlers).reduce((pre, cur) => {
      pre[cur] = (payload) => dispatch({
        type: `${prefix}/${cur}`,
        payload: payload
      })
      return pre;
    }, {});
    actions = Object.keys(this.reducers).reduce((pre, cur) => {
      pre[cur] = this.reducers[cur].toReducerAction(dispatch, `${prefix}/${cur}`);
      return pre;
    }, actions)
    return actions;
  }

  toReduxReducers(prefix) {
    prefix = prefix || this.prefix;
    const handlers = Object.keys(this.handlers).reduce((pre, cur) => {
      pre[`${prefix}/${cur}`] = this.handlers[cur];
      return pre;
    }, {});
    return (state, action) => {
      let nextState = Object.assign({}, state || this.defaultState);
      if (handlers[action.type]) {
        nextState = handlers[action.type](state, action.payload);
      }
      Object.keys(this.originReducer).filter(key => !!this.originReducer[key]).forEach(key => {
        const reducer = this.originReducer[key];
        nextState[key] = reducer(nextState[key], action);
      })
      Object.keys(this.reducers).filter(key => !!this.reducers[key]).forEach(key => {
        const reducer = this.reducers[key];
        nextState[key] = reducer.toReduxReducers(`${prefix}/${key}`)(nextState[key], action);
      })
      return nextState;
    }
  }
}

Reducer.fromOldReducer = function(reducers, prefix) {
  if (isVaildOldReducerChild(reducers)) { // 传入的是一个最小Reducer的子节点
    const defaultState = reducers.defaultState || {};
    const current = new Reducer({ prefix, defaultState })
    Object.keys(reducers.reducers).forEach(key => {
      const reducer = reducers.reducers[key];
      if (is(TYPES.Function)(reducer)) {
        current.use(key, reducer);
      } else {
        current.use(key, Reducer.fromOldReducer(reducer))
      }
    })
    return current;
  } else { // 递归寻找最小Reducer子节点
    const current = new Reducer({ prefix })
    Object.keys(reducers).map(key => {
      const reducer = reducers[key];
      current.use(key, Reducer.fromOldReducer(reducer))
    })
    return current;
  }
}
