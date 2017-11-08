import constants from '../constants';

module.exports = {
  reducers: {
    FINISH_FETCH: (state, action) => Object.assign({}, state, { repo: action.data })
  },
  defaultState: { repo: {} }
}
