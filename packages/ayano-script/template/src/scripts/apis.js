
export const methods = {
  get: "GET", put: "PUT", post: "POST", delete: "DELETE"
}

let apis = {
  repo: {
    path: '/repos/guoshencheng/ayano',
    method: methods.get
  }
}

apis.host = "https://api.github.com";

export const keys = Object.keys(apis).filter(key => key != 'host').reduce((pre, key) => {
  pre[key] = key
  return pre;
}, {})

export default apis;
