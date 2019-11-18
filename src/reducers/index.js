import { combineReducers } from 'redux';
import TicketReducers from './tickets';
import UserReducers from './users';
import AdminReducers from './admins';
import AgencyReducers from './agencies';
import CameraReducers from './cameras';
import ParkingLotReducers from './parking_lots';
import ServerErrorReducers from './server_errors';
import VoiReducers from './voi';
import { LOG_OUT } from 'actions/users';

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

export default (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }

  return reducers(state, action);
};
