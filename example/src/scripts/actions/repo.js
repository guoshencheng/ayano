import apis, { keys, methods } from '../apis';
import constants from '../constants.js';
import { request } from 'ayano-react';

const req = request(apis);

export const fetchRepo = () => (dispatch, getState) => {
  req(keys.repo).then(data => {
    dispatch({
      type: constants.REPO.FINISH_FETCH,
      data
    })
  })
}
