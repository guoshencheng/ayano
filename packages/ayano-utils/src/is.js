export const ObjectString = obj =>  Object.prototype.toString.bind(obj)()

const _TYPES = ['Object', 'Array', 'String', 'Date', 'Number', 'Function', 'Boolean', 'Null', 'Undefined', 'Regexp'];

export const TYPES = _TYPES.reduce((pre, cur) => {
  pre[cur] = cur;
  return pre;
}, {})

const is = (type) => (obj) => {
  return ObjectString(obj) === `[object ${type}]`;
}

export default is;
