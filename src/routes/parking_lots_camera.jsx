import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots_camera/index';
import Show from 'components/pages/parking_lots_camera/show';
import Edit from 'components/pages/parking_lots_camera/edit';
import New from 'components/pages/parking_lots_camera/new';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({ match }) => (

  < React.Fragment >

    <Route exact path={match.path} component={Index} />
    <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)} />
    <Switch>
      <Route exact path={`${match.path}/:id/new`} render={renderWithBackPath(New, match.path)} />
      <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, `${match.path}`)} />
    </Switch>
  </React.Fragment >
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
