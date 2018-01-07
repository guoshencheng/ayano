import { Reducer } from 'ayano-react';

const reducer = new Reducer({
  defaultState: {
    userInfo: {},
    loading: false,
    error: "",
    hasData: true
  }
});

reducer.use('FINISH_FETCH', (state, userInfo) => Object.assign({}, state, { userInfo, hasData: true, error: void 0 }))
reducer.use('SHOW_ERROR', (state, error) => Object.assign({}, state, { error, hasData: false, userInfo: void 0 }))
reducer.use('SWITCH_LOADING_STATUS', (state, loading) => Object.assign({}, state ,{ loading }))

export default reducer;
