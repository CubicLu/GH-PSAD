import React from 'react';
import { withRouter } from 'react-router';
import CameraRoute from 'routes/cameras';
import AdminRoute from 'routes/admins';
import ParkingLotRoute from 'routes/parking_lots';
import PrivateRoute from 'routes/private_route';

function MainContent(props) {
  const { match } = props;

  return (
    <div className="tab-content">
      <PrivateRoute path={`${match.path}/cameras`} component={CameraRoute}/>
      <PrivateRoute path={`${match.path}/parking_lots`} component={ParkingLotRoute}/>
      <PrivateRoute path={`${match.path}/admins`} component={AdminRoute}/>
    </div>
  );
}

export default withRouter(MainContent);
