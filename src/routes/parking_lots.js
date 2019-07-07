import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots';
import Show from 'components/pages/parking_lots/show';
import Edit from 'components/pages/parking_lots/edit';
import New from 'components/pages/parking_lots/new';
import renderWithBackPath from 'components/modules/render_with_back_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
      <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)}/>
      <Switch>
        <Route exact path={`${match.path}/new`} render={renderWithBackPath(New, match.path)}/>
        <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)}/>
      </Switch>
    </React.Fragment>
  );
}

export default withRouter(Routing);
