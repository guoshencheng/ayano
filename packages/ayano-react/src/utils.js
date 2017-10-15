import { combineReducers } from 'redux';
const ObjectString = obj =>  Object.prototype.toString.bind(obj)()

export const is = {
  ObjectString,
  object: obj => ObjectString(obj) == '[object Object]',
  array: obj => ObjectString(obj) == '[object Array]',
  string: obj => ObjectString(obj) == '[object String]',
  date: obj => ObjectString(obj) == '[object Date]',
  number: obj => ObjectString(obj) == '[object Number]',
  fn: obj => ObjectString(obj) == '[object Function]',
  boolean: obj => ObjectString(obj) == '[object Boolean]',
  null: obj => ObjectString(obj) == '[object Null]',
  undefined: obj => ObjectString(obj) == '[object Undefined]',
  regExp: obj => ObjectString(obj) == '[object RegExp]',
}


/**
 var data = {
  defaultState: {},
  reducers: {
    a: {
      defaultState: {},
      reducers: {
        a1: () => {};
        a2: () => {}
      }
    },
    b: {
      defaultState: {},
      reducers: {
        b1: () => {},
        b2: () => {}
      }
    },
    c: {

    }
  }
}
}
 */

export const buildPrefix = (key, prefix) => {
  if (prefix) {
    return [prefix, key].join('/');
  } else {
    return key;
  }
}

export const buildReducer = (nodes, defaultState, prefix) => {
  nodes = Object.keys(nodes).reduce((pre, key) => {
    pre[buildPrefix(key, prefix)] = nodes[key];
    return pre;
  }, {})
  return (state = defaultState, action) => {
    const current = nodes[action.type];
    if (current) {
      return current(state, action);
    } else {
      return state;
    }
  }
}

export const buildReducers = (data, prefix, defaultState, extraReducers) => {
  prefix = prefix || "";
  if (data.reducers) {
    return buildReducers(data.reducers, prefix, data.defaultState, extraReducers);
  } else {
    const objectCount = Object.keys(data).filter(k => is.object(data[k])).length;
    const fnCount = Object.keys(data).filter(k => is.fn(data[k])).length
    if (objectCount == Object.keys(data).length) {
      const reducers = Object.keys(data).reduce((pre, key) => {
        const current = data[key];
        pre[key] = buildReducers(current, buildPrefix(key, prefix))
        return pre;
      }, {})
      return combineReducers(Object.assign({}, reducers, extraReducers));
    } else if (fnCount == Object.keys(data).length) {
      return buildReducer(data, defaultState, prefix);
    } else {
      console.warn(`data at prefix ${prefix} is not a pure object to function set, ignored`);
    }
  }
}
//
//

export const analysisRouteTree = (routers, prefix) => {
  prefix = prefix || '';
  return Object.keys(routers).reduce((pre, key) => {
    const router = routers[key];
    if (router.children && Object.keys(router.children).length > 0) {
      if (router.component) console.warn(`ayano router object: path ${router.path} has children, the root component will be ignored, add child which path is \'/\' if need`);
      pre = Object.assign(pre, analysisRouteTree(router.children, prefix + router.path));
    } else {
      pre = Object.assign(pre, {
        [key]: Object.assign({}, router, {
          path: prefix + router.path
        })
      })
    }
    return pre;
  }, {})
}
