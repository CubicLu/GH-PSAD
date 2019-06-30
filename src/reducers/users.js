import {UserActions} from 'actions';
import {combineReducers} from 'redux';

function auth(state = { isAuthorized: false }, action) {
  switch (action.type) {
    case UserActions.SET_TOKEN:
      return Object.assign({}, state, {
        isAuthorized: true,
        token: action.payload
      });
    case UserActions.CLEAR_TOKEN:
      return Object.assign({}, state, {
        isAuthorized: false,
        token: null
      });
    default:
      return state;
  }
}

const UserReducers = combineReducers({
  auth
});

export default UserReducers;
