import { combineReducers } from 'redux';
import TicketReducers from './tickets';
import UserReducers from './users';
import AdminReducers from './admins';
import AgencyReducers from './agencies';
import CameraReducers from './cameras';
import ParkingLotReducers from './parking_lots';
import ParkingLotCameraReducers from './parking_lots_camera';
import ParkingSessionReducers from './parking_sessions';
import ReportReducers from './reports';
import ServerErrorReducers from './server_errors';
import VoiReducers from './voi';
import DetailedReportsReducers from './detailed_reports';
import RolesReducers from './roles';
import { LOG_OUT } from 'actions/users';

const reducers = combineReducers({
  user: UserReducers,
  admin: AdminReducers,
  agency: AgencyReducers,
  ticket: TicketReducers,
  camera: CameraReducers,
  parking_lot: ParkingLotReducers,
  parking_lot_camera: ParkingLotCameraReducers,
  parking_session: ParkingSessionReducers,
  voi: VoiReducers,
  report: ReportReducers,
  server: ServerErrorReducers,
  detailedReports: DetailedReportsReducers,
  role: RolesReducers
});

export default (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }

  return reducers(state, action);
};
