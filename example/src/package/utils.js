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
