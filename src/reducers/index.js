import { combineReducers } from 'redux';
import TicketReducers from './agencies/tickets';
import UserReducers from './users';
import AdminReducers from './admins';
import AgencyReducers from './agencies';
import CameraReducers from './cameras';
import ParkingLotReducers from './parking_lots';
import ServerErrorReducers from './server_errors';
import VoiReducers from './voi';

const reducers = combineReducers({
  user: UserReducers,
  admin: AdminReducers,
  agency: AgencyReducers,
  ticket: TicketReducers,
  camera: CameraReducers,
  parking_lot: ParkingLotReducers,
  voi: VoiReducers,
  server: ServerErrorReducers
});

export default reducers;
