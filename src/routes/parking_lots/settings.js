import React from 'react';
import { Route, withRouter } from 'react-router';
import Edit from 'components/pages/parking_lots/settings/edit';

const Routing = ({ match }) => {
  return (
    <React.Fragment>
      <Route exact path={`${match.path}/:id/edit`} component={Edit}/>
    </React.Fragment>
  )
};

export default withRouter(Routing);
