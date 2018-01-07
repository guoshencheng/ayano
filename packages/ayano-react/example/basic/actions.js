import { routerActions } from 'react-router-redux';

var user = {
  fetchUser: (username) => ({ apis, reducers }) => {
    reducers.user.SWITCH_LOADING(true);
    apis.user({ username }).then(response => {
      reducers.user.SWITCH_LOADING(false);
      const user = response.data[0] || {};
      reducers.user.INIT_USER(user);
    })
  }
}

const actions = {
  router: routerActions,
  user,
}

export default actions;
