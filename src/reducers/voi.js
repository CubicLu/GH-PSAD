import { VoiActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(VoiActions);

const VoiReducers = combineReducers({
  index,
  records
});

export default VoiReducers;
