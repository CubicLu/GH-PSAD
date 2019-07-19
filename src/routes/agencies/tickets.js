import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import TicketIndex from 'components/pages/agencies/tickets';
import TicketEdit from 'components/pages/agencies/tickets/edit';
import TicketShow from 'components/pages/agencies/tickets/show';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({match}) => {
  return (
  <React.Fragment>
      <Route exact path={match.path} component={TicketIndex}/>
      <Switch>
        <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(TicketEdit, match.path)}/>
        <Route exact path={`${match.path}/:id`} render={renderWithBackPath(TicketShow, match.path)}/>
      </Switch>
  </React.Fragment>
)}

export default withRouter(Routing);
