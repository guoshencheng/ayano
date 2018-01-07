import { connectAyano } from '../../../src/index.js';
import React from 'react';

class UserInfo extends React.Component {

  componentDidMount() {
    const { match, actions } = this.props;
    actions.user.fetchUser(match.params.name);
  }

  render() {
    const { match, actions, user } = this.props;
    const { name } = match.params;
    const { user: userInfo, loading, hasUser } = user;
    return (
      <div>
        <div className="item"> hellow world, It's page1 </div>
        <div className="item">path: {match.path}</div>
        <div className="item">params: {JSON.stringify(match.params)}</div>
        <div className="buttons">
          <div className="button" onClick={() => { actions.router.goBack() }}>Back</div>
        </div>
        {
        loading ?
        <div className="item">
          加载中...
        </div> :
        hasUser ?
        <div>
          <div className="item">
            <img src={userInfo.avatar_url} alt="" style={{ width: 40 }} />
          </div>
          <div className="item">用户名: {userInfo.name}</div>
          <div className="item">id: {userInfo.id}</div>
          <div className="item"><a href={userInfo.web_url}>主页: {userInfo.web_url}</a></div>
        </div> :
        <div className="ite">
          用户{ name }不存在
        </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ user: state.user })
export default connectAyano(mapStateToProps)(UserInfo);
