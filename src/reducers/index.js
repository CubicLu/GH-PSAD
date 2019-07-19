import { combineReducers } from 'redux';
import TicketReducers from './agencies/tickets';
import UserReducers from './users';
import AdminReducers from './admins';
import AgencyReducers from './agencies';
import CameraReducers from './cameras';
import ParkingLotReducers from './parking_lots';

const reducers = combineReducers({
  user: UserReducers,
  admin: AdminReducers,
  agency: AgencyReducers,
  ticket: TicketReducers,
  camera: CameraReducers,
  parking_lot: ParkingLotReducers
});

export default reducers;
