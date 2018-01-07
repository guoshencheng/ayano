import React from 'react';
import './Loading.less'

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    const {margin, isLoading, children} = this.props;
    return (
      isLoading ? (<div className="spinner-detail" style={{ 'margin' : `${margin} auto` || '2.2rem auto' }}>
        <div className="spinner-detail-dot1"></div>
        <div className="spinner-detail-dot2"></div>
      </div>) : children
    )
  }
}
