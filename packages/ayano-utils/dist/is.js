'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var ObjectString = function ObjectString(obj) {
  return Object.prototype.toString.bind(obj)();
};

exports.ObjectString = ObjectString;
var _TYPES = ['Object', 'Array', 'String', 'Date', 'Number', 'Function', 'Boolean', 'Null', 'Undefined', 'Regexp'];

var TYPES = _TYPES.reduce(function (pre, cur) {
  pre[cur] = _TYPES[cur];
  return pre;
}, {});

exports.TYPES = TYPES;
var is = function is(type) {
  return function (obj) {
    return ObjectString(obj) === '[object ' + type + ']';
  };
};

exports['default'] = is;