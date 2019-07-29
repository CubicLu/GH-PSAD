import * as AdminActions from './admins';
import * as TicketActions from './agencies/tickets';
import * as AgencyActions from './agencies';
import * as UserActions from './users';
import * as CameraActions from './cameras';
import * as ParkingLotActions from './parking_lots';

const INIT = 'APP_INIT';

const init = {
  type: INIT
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
  TicketActions,
  INIT,
  init,
  invoke
};
