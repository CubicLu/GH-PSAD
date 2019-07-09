import { combineReducers } from 'redux';
import UserReducers from './users';
import AdminReducers from './admins';
import CameraReducers from './cameras';
import ParkingLotReducers from './parking_lots';

const reducers = combineReducers({
  user: UserReducers,
  admin: AdminReducers,
  camera: CameraReducers,
  parking_lot: ParkingLotReducers
});

export default reducers;
