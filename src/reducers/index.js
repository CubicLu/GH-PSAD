import { combineReducers } from 'redux';
import UserReducers from './user';

const reducers = combineReducers({
  user: UserReducers
});

export default reducers;
