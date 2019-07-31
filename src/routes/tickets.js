import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import TicketIndex from 'components/pages/tickets';
import TicketEdit from 'components/pages/tickets/edit';
import TicketShow from 'components/pages/tickets/show';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = (props) => {
  const { match, parent } = props
  return (
    <React.Fragment>
        <Route exact path={match.path} render={renderWithBackPath(TicketIndex, parent.match.url)}/>
        <Switch>
          <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(TicketEdit, `${match.url}/:id`)}/>
          <Route exact path={`${match.path}/:id`} render={renderWithBackPath(TicketShow, match.url)}/>
        </Switch>
    </React.Fragment>
  )
}

export default withRouter(Routing);
