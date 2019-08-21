import { me } from 'api/users';
const SET_TOKEN = 'SET_TOKEN';
const CLEAR_TOKEN = 'CLEAR_TOKEN';
const SET_CURRENT_USER_DATA = 'SET_CURRENT_USER_DATA';

const setToken = payload => {
  return {
    type: SET_TOKEN,
    payload: payload
  };
};

const clearToken = {
  type: CLEAR_TOKEN
};

const setCurrentUserData = () => dispatch => (
  me()
    .then(res => {
      res && dispatch({
        type: SET_CURRENT_USER_DATA,
        payload: res.data
      });
    })
);

export {
  SET_TOKEN,
  CLEAR_TOKEN,
  SET_CURRENT_USER_DATA,
  setToken,
  clearToken,
  setCurrentUserData
};
