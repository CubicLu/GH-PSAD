import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/cameras/index';
import Show from 'components/pages/cameras/show';
import Edit from 'components/pages/cameras/edit';
import New from 'components/pages/cameras/new';
import renderWithBackPath from 'components/modules/render_with_back_path';
import PropTypes from 'prop-types';

const Routing = ({ match }) => (
  <React.Fragment>
    <Route exact path={match.path} component={Index} />
    <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)} />
    <Switch>
      <Route exact path={`${match.path}/new`} render={renderWithBackPath(New, match.path)} />
      <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)} />
    </Switch>
  </React.Fragment>
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
