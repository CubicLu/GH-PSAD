import { ServerErrorActions } from 'actions';
import { combineReducers } from 'redux';

const error = (state = { payload: null }, action) => {
  switch (action.type) {
    case ServerErrorActions.NOT_FOUND:
      return Object.assign({}, state, {
        payload: action.payload
      });
    case ServerErrorActions.INTERNAL:
      return Object.assign({}, state, {
        payload: action.payload
      });
    default:
      return state;
  }
};

const ServerErrorReducers = combineReducers({
  error
});

export default ServerErrorReducers;
