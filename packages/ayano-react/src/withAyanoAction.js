import hoistStatics from 'hoist-non-react-statics'
import React from 'react';
import PropTypes from 'prop-types'

export default (AppManager) => (Component, name) => {
  const C = (props) => {
    const app = AppManager.get(name);
    const { wrappedComponentRef, ...remainingProps } = props
    return (
      <Component {...remainingProps} actions={app.actions} toPath={app.toPath} reducers={app.reducerActions} ></Component>
    )
  }
  C.displayName = `mumConnect(${Component.displayName || Component.name})`
  C.WrappedComponent = Component
  C.propTypes = {
    wrappedComponentRef: PropTypes.func
  }
  return hoistStatics(C, Component)
}
