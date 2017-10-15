import { is } from './utils';
import axios from 'axios';

const _handleResponse = (response) => {
  return response.data;
}

const _catchError = (error) => {
  console.log(error)
}

const buildRequestParams = (method, url, data, options) => {
    let params = Object.assign({}, {
    method, url,
    params: method == "GET" || method == "DELETE" ? data : void 6,
    data: method == "PUT" || method == "POST" ? data : void 6
  }, options)
  // to delete function params at options
  Object.keys(params).forEach(key => {
    if (is.fn(params[key])) {
      delete params[key];
    }
  })
  return params;
}

const buildUrl = (host, apis, key, data) => {
  if (is.fn(key)) {
    return key(data)
  } else if (is.fn(apis[key])) {
    return apis[key](data)
  } else {
    return `${host}${ apis[key] ? apis[key].path : key}`
  }
}

const sendRequest = (apis, key, data, method, options, opt) => {
    const host = apis.host || '';
    const handleResponse = options.handleResponse || opt.handleResponse || _handleResponse;
    const catchError = options.catchError || opt.catchError || _catchError;
    let url = buildUrl(host, apis, key, data);
    const params = buildRequestParams(method, url, data, options);
    return axios(params).then(handleResponse).catch(catchError)
}

export const methods = {
  get: "GET", put: "PUT", post: "POST", delete: "DELETE"
}

export const request = (apis, opt) => {
  opt = opt || {};
  const _apis = Object.keys(apis).filter(i => i != 'host').reduce((pre, key) => {
    const api = apis[key];
    pre[key] = (data, options) =>  {
      options = options || {};
      const method = api.method;
      return sendRequest(apis, key, data, method, options, opt);
    }
    return pre;
  }, {})
  let _request = (key, data, method, options) => {
    options = options || {};
    if (apis[key]) {
      return reqs[key]
    } else {
      return sendRequest(apis, key, data, method, options, opt);
    }
  }
  return Object.assign(_apis, { request: _request })
}
