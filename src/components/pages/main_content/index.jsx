import React from 'react';
import { withRouter } from 'react-router';
import CameraRoute from 'routes/camera';
import PrivateRoute from 'routes/private_route';

function MainContent(props) {
  const { match } = props;

  return (
    <div className="tab-content">
      <PrivateRoute path={`${match.path}/cameras`} component={CameraRoute}/>
    </div>
  );
}

export default withRouter(MainContent);
