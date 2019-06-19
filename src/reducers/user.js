import {UserActions} from 'actions';
import {combineReducers} from 'redux';

const initialState = {
  isAuthorized: false
};

function auth(state = initialState, action) {
  switch (action.type) {
    case UserActions.SET_TOKEN:
      return Object.assign({}, state, {
        isAuthorized: true,
        token: action.payload
      });
    default:
      return state;
  }
}

const UserReducers = combineReducers({
  auth
});

export default UserReducers;
