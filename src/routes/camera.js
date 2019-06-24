import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/cameras';
import Show from 'components/pages/cameras/show';
import Edit from 'components/pages/cameras/edit';
import New from 'components/pages/cameras/new';
import renderWithBackPath from 'components/modules/render_with_back_path';

function CameraRoute(props) {
  const { match } = props;

  return (
    <div>
      <Route exact path={match.path} render={renderWithBackPath(Index, match.path)}/>
      <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)}/>
      <Switch>
        <Route exact path={`${match.path}/new`} render={renderWithBackPath(New, match.path)}/>
        <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)}/>
      </Switch>
    </div>
  );
}

export default withRouter(CameraRoute);
