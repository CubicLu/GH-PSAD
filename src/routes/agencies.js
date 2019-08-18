import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/agencies';
import Show from 'components/pages/agencies/show';
import New from 'components/pages/agencies/new';
import TicketsRoutes from './tickets';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({ match }) => (
  <React.Fragment>
    <Route exact path={match.path} component={Index}/>
    <Switch>
      <Route exact path={`${match.path}/new`} render={renderWithBackPath(New, match.path)}/>
      <Route path={`${match.path}/:id`} render={(props) => (
        <React.Fragment>
          <Route exact path={`${props.match.path}`} component={renderWithBackPath(Show, match.path)}/>
          <Route path={`${match.path}/:agency_id/tickets`} render={() => <TicketsRoutes parent={{ ...props }} />}/>
        </React.Fragment>
      )}/>
    </Switch>
  </React.Fragment>
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
