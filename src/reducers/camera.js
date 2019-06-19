import {CameraActions} from 'actions';
import {combineReducers} from 'redux';

function index(state = { list: [], records: {} }, action) {
  switch (action.type) {
    case CameraActions.SET_LIST:
      return Object.assign({}, state, {
        list: action.payload
      });
    default:
      return state;
  }
}

function records(state = { records: {} }, action) {
  switch (action.type) {
    case CameraActions.SET_RECORD:
      return Object.assign({}, state, {
        [action.payload.id]: action.payload
      });
    default:
      return state;
  }
}

const CameraReducers = combineReducers({
  index,
  records
});

export default CameraReducers;
