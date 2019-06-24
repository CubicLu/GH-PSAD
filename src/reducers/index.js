import { combineReducers } from 'redux';
import UserReducers from './user';
import CameraReducers from './camera';

const reducers = combineReducers({
  user: UserReducers,
  camera: CameraReducers
});

export default reducers;
