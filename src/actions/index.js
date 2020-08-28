/* eslint camelcase: "off" */

import * as AdminActions from './admins';
import * as TicketActions from './tickets';
import * as AgencyActions from './agencies';
import * as UserActions from './users';
import * as CameraActions from './cameras';
import * as ParkingLotActions from './parking_lots';
import * as ParkingLotCameraActions from './parking_lots_camera';
import * as ParkingSessionActions from './parking_sessions';
import * as ReportActions from './reports';
import * as VoiActions from './voi';
import * as ServerErrorActions from './server_errors';
import * as DetailedReports from './detailed_reports';

const INIT_SET_TOKEN = 'APP_INIT_SET_TOKEN';
const INIT_SET_CURRENT_USER = 'APP_INIT_SET_CURRENT_USER';

const init_set_token = {
  type: INIT_SET_TOKEN
};

const init_set_current_user = {
  type: INIT_SET_CURRENT_USER
};

const invoke = type => {
  return payload => {
    return {
      type,
      payload
    };
  };
};

export {
  UserActions,
  AdminActions,
  AgencyActions,
  CameraActions,
  ParkingLotActions,
  ParkingLotCameraActions,
  ParkingSessionActions,
  ReportActions,
  TicketActions,
  DetailedReports,
  INIT_SET_TOKEN,
  INIT_SET_CURRENT_USER,
  init_set_token,
  init_set_current_user,
  VoiActions,
  ServerErrorActions,
  invoke
};
