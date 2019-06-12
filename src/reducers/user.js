import {UserActions} from 'actions';
import {combineReducers} from 'redux';

const initialState = {
  isAuthorized: false
};

function auth(state = initialState, action) {
  switch (action.type) {
    case UserActions.SET_TOKEN:
      localStorage.setItem("token", action.token);
      return Object.assign({}, state, {
        isAuthorized: true
      });
    default:
      return state;
  }
}

const UserReducers = combineReducers({
  auth
});

export default UserReducers;
