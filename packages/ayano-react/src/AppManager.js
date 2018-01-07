import { is, TYPES } from 'ayano-utils';
const DEFAULT_APP_KEY = "DEFAULT_APP_KEY";

const AppManager = {
  get(name = DEFAULT_APP_KEY) {
    this.apps = this.apps || {};
    return this.apps[name];
  },
  set(name, app) {
    this.apps = this.apps || {};
    console.log(name, app)
    if (app) {
      if (is(TYPES.String)(name)) {
        this.apps[name] = app;
      } else {
        this.apps[DEFAULT_APP_KEY] = app;
      }
    } else {
      this.apps[DEFAULT_APP_KEY] = name;
    }
  },
  all() {
    this.apps = this.apps || {};
    return this.apps;
  }
}

export default AppManager;
