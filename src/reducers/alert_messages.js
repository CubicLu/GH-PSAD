import { AlertMessagesActions } from 'actions';
import { combineReducers } from 'redux';

function data (state = [], action) {
  switch (action.type) {
    case AlertMessagesActions.SET_ALERT_MESSAGES:
      const item = ({
        text: action.payload.text,
        type: action.payload.type
      });
      return [...state, item]
    case AlertMessagesActions.POP_ALERT_MESSAGES:
      return state.splice(0, state.length-1)
    case AlertMessagesActions.CLEAR_ALERT_MESSAGES:
      return [];
    default:
      return state;
  }
}

const AlertMessagesReducers = combineReducers({
  data
});

export default AlertMessagesReducers;
