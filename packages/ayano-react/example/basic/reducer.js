import { Reducer } from '../../src/index.js';

var userReducer = new Reducer({
  defaultState: {
    user: {},
    loading: false,
    hasUser: true
  }
})

userReducer.use('INIT_USER', (state, user) => Object.assign({}, state, { user, hasUser: !!user.id }))
userReducer.use('SWITCH_LOADING', (state, payload) => Object.assign({}, state, { loading: payload }))

var reducer = new Reducer({
  defaultState: {
    info: {}
  }
});
reducer.use('user', userReducer);

export default reducer;
