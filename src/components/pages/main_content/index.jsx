import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import AdminRoute from 'routes/admins';
import AgencyRoute from 'routes/agencies';
import CameraRoute from 'routes/cameras';
import TicketRoute from 'routes/tickets';
import ParkingLotRoute from 'routes/parking_lots';
import PrivateRoute from 'routes/private_route';

function MainContent (props) {
  const { match } = props;

  return (
    <div className=''>
      <PrivateRoute path={`${match.path}/admins`} component={AdminRoute} />
      <PrivateRoute path={`${match.path}/agencies`} component={AgencyRoute} />
      <PrivateRoute path={`${match.path}/tickets`} component={TicketRoute} />
      <PrivateRoute path={`${match.path}/cameras`} component={CameraRoute} />
      <PrivateRoute path={`${match.path}/parking_lots`} component={ParkingLotRoute} />
    </div>
  );
}

MainContent.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(MainContent);
