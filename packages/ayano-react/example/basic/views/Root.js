import { withAyanoAction } from '../../../src/index.js';
import React from 'react';

class Root extends React.Component {

  onInputChange(e) {
    this.value = e.target.value;
  }

  watchUserInfo() {
    const { actions, toPath } = this.props;
    actions.router.push(toPath.userInfo({id: 1, name: this.value}))
  }

  render() {
    const { match, actions, toPath } = this.props;
    return (
      <div>
        <div className="item"> hellow world, It's root page </div>
        <div className="item">path: {match.path}</div>
        <div className="item">params: {JSON.stringify(match.params)}</div>
        <div className="item">
          <div>请输入用户名:</div>
          <input type="text" onChange={this.onInputChange.bind(this)}/>
        </div>
        <div className="buttons">
          <div className="button" onClick={this.watchUserInfo.bind(this)} >查看用户 → </div>
        </div>
      </div>
    )
  }
}

export default withAyanoAction(Root);
