import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import AdminRoute from 'routes/admins';
import DashboardRoute from 'routes/dashboard';
import AgencyRoute from 'routes/agencies';
import CameraRoute from 'routes/cameras';
import TicketRoute from 'routes/tickets';
import ParkingLotRoute from 'routes/parking_lots';
import ReportRoute from 'routes/reports';
import ProfileRoute from 'routes/profile';
import PrivateRoute from 'routes/private_route';
import ParkingLotCameras from 'routes/parking_lots_camera'
import Towns from '../towns/index';
function MainContent(props) {
  const { match } = props;

  return (
    <div className=''>
      <PrivateRoute path={`${match.path}`} component={DashboardRoute} />
      <PrivateRoute path={`${match.path}/profile`} component={ProfileRoute} />
      <PrivateRoute path={`${match.path}/admins`} component={AdminRoute} />
      <PrivateRoute path={`${match.path}/agencies`} component={AgencyRoute} />
      <PrivateRoute path={`${match.path}/tickets`} component={TicketRoute} />
      <PrivateRoute path={`${match.path}/cameras`} component={CameraRoute} />
      <PrivateRoute path={`${match.path}/parking_lots`} component={ParkingLotRoute} />
      <PrivateRoute path={`${match.path}/towns`} component={Towns} />
      <PrivateRoute path={`${match.path}/live/parking_lots`} component={ParkingLotCameras} />
      <PrivateRoute path={`${match.path}/reports`} component={ReportRoute} />
    </div>
  );
}

MainContent.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(MainContent);
