import { is } from 'ayano-utils';
import axios from 'axios';

const _methods = ['get', 'post', 'delete', 'put', 'patch', 'options', 'head']

export const methods = _methods.reduce((pre, cur) => {
  pre[cur] = cur;
  return pre;
}, {})

const DEFAULT_METHOD = methods.get;

export const searchParamsBuilder = (data, api) => {
  const method = api.method || DEFAULT_METHOD;
  if ([methods.get, methods.delete, methods.headers, methods.options].indexOf(method.toLowerCase()) > -1) {
    return data;
  } else {
    return void 0;
  }
}

export const bodyDataBuilder = (data, api) => {
  const method = api.method || DEFAULT_METHOD;
  if ([methods.get, methods.delete, methods.headers, methods.options].indexOf(method.toLowerCase()) > -1) {
    return void 0;
  } else {
    return data;
  }
}

export default class Request {
  static defaultConfig = {
    timeout: 10000,
    searchParamsBuilder: searchParamsBuilder,
    bodyDataBuilder: bodyDataBuilder
  }

  /**
   *  config.baseURL
   *  config.headers
   *  config.timeout
   *  config.searchParamsBuilder
   *  config.bodyDataBuilder
   */
  constructor(config) {
    this.apis = {};
    this.setConfig(config)
  }

  toApis() {
    const handler = {
      get(target, name) {
        return target.apis[name]
      },
      set(target, name, value) {
        throw new Error("禁止为apis设置属性")
      }
    }
    return new Proxy(this, handler);
  }

  setConfig(config) {
    const apis = config.apis;
    config = Object.assign({}, config);
    delete config.apis;
    this.defaultConfig = Object.assign({}, Request.defaultConfig, config);
    const axiosConfig = Object.assign({}, this.defaultConfig);
    delete axiosConfig.searchParamsBuilder;
    delete axiosConfig.bodyDataBuilder;
    this.axios = axios.create(axiosConfig);
    if (apis) {
      this.setApis(apis);
    }
  }

  buildRequest(api) {
    const method = api.method || DEFAULT_METHOD;
    return (data, config) => {
      config = Object.assign({}, config);
      const bodyDataBuilder = config.bodyDataBuilder || api.bodyDataBuilder || this.defaultConfig.bodyDataBuilder;
      const searchParamsBuilder = config.searchParamsBuilder || api.searchParamsBuilder || this.defaultConfig.searchParamsBuilder;
      const sender = config.sender || this.axios;
      delete config.bodyDataBuilder;
      delete config.searchParamsBuilder;
      delete config.sender;
      delete config.onError;
      delete config.handleResponse;
      const url = is.fn(api.path) ? api.path(data) : api.path;
      const params = searchParamsBuilder(data, { method: api.method });
      const bodyData = bodyDataBuilder(data, { method: api.method });
      return sender(Object.assign({ url, params, data: bodyData }, config))
    }
  }

  setApis(apis) {
    this._apis = apis;
    this.apis = Object.keys(apis).reduce((pre, key) => {
      const api = apis[key];
      pre[key] = this.buildRequest(api);
      return pre;
    }, {})
  }
}
