import React from 'react';
import Loading from '../../components/Loading';
import { Flex, MhcIcon } from 'antd-mobile';
import { connectAyano } from 'ayano-react';
import './UserInfo.less';

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { user = {}, router } = this.props;
    const { userInfo, loading, hasData, error } = user;
    const buttons = [{
      text: '确定',
      onPress() {

      }
    }]
    return (
      <div className="full-screen">
        <Loading isLoading={loading} >
          <Flex direction="column" align="center" className="user-info full-screen" >
            <img src={userInfo.avatar_url} alt=""/>
            <div className="item"> 用户名：{userInfo.username} </div>
            <div className="item"> GITLAB主页：{userInfo.web_url}</div>
            <div className="item"> 修改url后面的id可以访问其他用户的数据 </div>
            <div className="item">编辑 src/view/UserInfo/UserInfo.js 或者 在src/router 中添加新的路由 开始 mum之旅</div>
          </Flex>
        </Loading>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connectAyano(mapStateToProps)(Home);
