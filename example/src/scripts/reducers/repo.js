import constants from '../constants';

module.exports = (state = {}, action) => {
  switch(action.type) {
    case constants.REPO.FINISH_FETCH:
      return Object.assign({}, state, { repo: action.data })
    default:
      return state;
  }
};
