import { TownsActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(TownsActions);

const TownsReducers = combineReducers({
  index,
  records
});

export default TownsReducers;
