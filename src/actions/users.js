const SET_TOKEN = 'SET_TOKEN';
const CLEAR_TOKEN = 'CLEAR_TOKEN';

const setToken = payload => {
  return {
    type: SET_TOKEN,
    payload: payload
  };
};

const clearToken = {
  type: CLEAR_TOKEN
};

export { SET_TOKEN, CLEAR_TOKEN, setToken, clearToken };
