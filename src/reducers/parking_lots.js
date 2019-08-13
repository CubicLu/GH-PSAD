import { ParkingLotActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ParkingLotActions);

const voi = (state = {}, action) => {
  switch (action.type) {
    case ParkingLotActions.SET_VOI_LIST:
      return Object.assign({}, state, {
        [action.lot_id]: action.payload
      });
    default:
      return state;
  }
};

const ParkingLotReducers = combineReducers({
  index,
  records,
  voi
});

export default ParkingLotReducers;
