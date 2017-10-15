import { is } from './utils'

export const buildConstantToAction = (constants, build, origin) => {
  origin = origin || {};
  return Object.keys(constants).reduce((pre, key) => {
    if (is.object(constants[key])) {
      pre[key] = buildConstantToAction(constants[key], build);
    } else if (is.string(constants[key])) {
      pre[key] = build(constants[key]);
    }
    return pre;
  }, origin)
}

export const buildConstants = (tree, prefix = "") => {
  return tree.reduce((pre, item) => {
    if (is.string(item)) {
      pre[item] = prefix ? [prefix, item].join("/") : item;
      return pre;
    } else if (is.object(item)) {
      const { key, values } = item;
      const p = prefix ? [prefix, key].join("/") : key;
      pre[key] = buildConstants(values, p);
      return pre;
    } else {
      console.warn(`constants build item should be a object or string, got a item which is ${is.ObjectString(item)}, ignored`);
      return pre;
    }
  }, {})
}


export const buildConstantsTree = (reducers) => {
  if (reducers.reducers) reducers = reducers.reducers;
  return Object.keys(reducers).reduce((pre, key) => {
    const current = reducers[key];
    if (is.fn(current)) {
      return pre.concat([key]);
    } else if (is.object(current)) {
      return pre.concat([{
        key, values: buildConstantsTree(current)
      }])
    }
  }, []);
}
