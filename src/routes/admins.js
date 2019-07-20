import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/admins';
import Show from 'components/pages/admins/show';
import Edit from 'components/pages/admins/edit';
import New from 'components/pages/admins/new';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({match}) => (
  <React.Fragment>
    <Route exact path={match.path} component={Index}/>
    <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)}/>
    <Switch>
      <Route exact path={`${match.path}/new`} render={renderWithBackPath(New, match.path)}/>
      <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)}/>
    </Switch>
  </React.Fragment>
)

export default withRouter(Routing);
