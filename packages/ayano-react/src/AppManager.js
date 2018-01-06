import { is, TYPES } from 'ayano-utils';
const DEFAULT_APP_KEY = "DEFAULT_APP_KEY";

export const AppManager = {
  get(name = DEFAULT_APP_KEY) {
    return this.apps[name];
  }
  set(name, app) {
    if (app && is(TYPES.String)(name)) {
      this.apps[name] = app;
    } else {
      this.apps[DEFAULT_APP_KEY] = name;
    }
  }
  all() {
    return this.apps;
  }
}
