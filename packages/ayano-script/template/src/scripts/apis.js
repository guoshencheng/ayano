
import { methods } from 'ayano-react';

let apis = {
  repo: {
    path: '/repos/guoshencheng/ayano',
    method: methods.get
  }
}

apis.host = "https://api.github.com";

export default apis;
