import { Switch, Route } from 'react-router-dom';
import { logger, is, brower, TYPES } from 'ayano-utils'
import pathToRegexp from 'path-to-regexp';
import React from 'react';

const { changeTitle } = brower;

export default class Router {
  constructor() {
    this.layers = {};
  }
  use(path, component, options) {
    const opt = Object.assign({}, options);
    const { title, name, onMatch } = opt
    delete opt.title;
    delete opt.name;
    delete opt.onMatch;
    this.layers[path] = { path, component, options: opt, title, name, onMatch };
  }
  toPath() {
    const flatten = this.flatten().filter(item => !!item.name);
    return flatten.reduce((pre, value) => {
      return Object.assign({}, { [value.name]: pathToRegexp.compile(value.path) })
    }, {})
  }
  flatten() {
    return Object.keys(this.layers).reduce((pre, key) => {
      const layer = this.layers[key];
      if (layer.component instanceof Router) {
        return pre.concat(layer.component.flatten());
      } else {
        return pre.concat([Object.assign({}, layer, { path: key })])
      }
    }, [])
  }
  onMatchLocation(puppet) {
    const flatten = this.flatten().filter(item => !!item.onMatch);
    const changeTitleflatten = this.flatten().filter(item => !!item.title);
    return (location, action) => {
      flatten.filter(item => pathToRegexp(item.path).test(location.pathname)).forEach(item => {
        item.onMatch(location, action, puppet);
      })
      changeTitleflatten.filter(item => pathToRegexp(item.path).test(location.pathname)).forEach(item => {
        const title = is(TYPES.Function)(item.title) ? item.title(location, action) : item.title;
        changeTitle(title);
      })
    }
  }
}

export class RouterRenderer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { router, prefix = "" } = this.props;
    if (!router) {
      logger.warn('RouterRenderer 需要一个Router的对象作为参数')
    }
    const { layers = {} } = router;
    return (
      <Switch>
        {
          Object.keys(layers).map(path => {
            const layer = layers[path];
            let render;
            if (layer.component instanceof Router) {
              render = (props) => {
                return <RouterRenderer router={ layer.component } prefix={`${prefix}${path}`} ></RouterRenderer>
              }
            }
            return (
              <Route key={path} path={`${prefix}${path}`} component={layer.component} {...layer.options} />
            )
          })
        }
      </Switch>
    )
  }
}
