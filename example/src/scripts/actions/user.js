
export const fetchUser = (id) => ({ apis, reducers })=> {
  reducers.user.SWITCH_LOADING_STATUS(true);
  apis.user({ id }).catch(reason => {
    const { response = {} } = reason;
    const { data = {} } = response;
    const message = data.error || reason.message;
    reducers.user.SHOW_ERROR(message);
    reducers.user.SWITCH_LOADING_STATUS(false);
  }).then(response => {
    reducers.user.SWITCH_LOADING_STATUS(false);
    if (response) {
      reducers.user.FINISH_FETCH(response.data);
    }
  });
}
