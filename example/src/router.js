//router components
import UserInfo from './views/UserInfo/UserInfo.js';
import React from 'react';
import { Router } from 'ayano-react';
import { Redirect } from 'react-router-dom';
import { matchPath } from 'react-router';

const rootRouter = new Router();

rootRouter.use('/', () => {
  return <Redirect to='/user/124' ></Redirect>
}, { exact: true, name: 'home'  });

rootRouter.use('/user/:id', UserInfo, { exact: true, name: 'user', onMatch(location, action, { actions }) {
  const match = matchPath(location.pathname, { path: '/user/:id' });
  const { params = {} } = match;
  actions.user.fetchUser(params.id);
}});

export default rootRouter;
