import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/agencies';
import Edit from 'components/pages/agencies/edit';
import Show from 'components/pages/agencies/show';
import New from 'components/pages/agencies/new';
import TicketsRoutes from './tickets';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({match}) => (
  <React.Fragment>
    <Route exact path={match.path} component={Index}/>
    <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)}/>
    <Switch>
      <Route exact path={`${match.path}/new`} render={renderWithBackPath(New, match.path)}/>
      <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)}/>
      <Route path={`${match.path}/:agency_id/tickets`} component={TicketsRoutes}/>
    </Switch>
  </React.Fragment>
)

export default withRouter(Routing);
