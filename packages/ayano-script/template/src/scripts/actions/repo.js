import { Toast } from 'antd-mobile';

export const fetchRepo = () => ({ apis, actions, constants })=> {
  Toast.loading('加载中...', 0);
  apis.repo().then(data => {
    actions.reducerActions.repo.FINISH_FETCH({ data });
    Toast.success('加载成功', 1);
    console.warn( ` the dispath will be desprecated in the feature, use auto mode and _reducers props instead`);
    // dispatch({
    //   type: constants.repo.FINISH_FETCH,
    //   data
    // })
  });
}
