import { is } from './utils';
import axios from 'axios';

const _handleResponse = (response) => {
  return response.data;
}

const _catchError = (error) => {
  console.log(error)
}

export const request = (apis) => (path, data, method, options) => {
  options = options || {};
  const host = apis.host || "";
  const handleResponse = options.handleResponse || _handleResponse;
  const catchError = options.catchError || _catchError;
  method = apis[path] ? apis[path].method : method;
  let url = `${host}${apis[path] ? apis[path].path : path}`;
  if (is.fn(url)) url = url(data);
  let params = Object.assign({}, {
    method, url,
    params: method == "GET" || method == "DELETE" ? data : void 6,
    data: method == "PUT" || method == "POST" ? data : void 6
  }, options)
  return axios(params).then(handleResponse).catch(catchError)
}
