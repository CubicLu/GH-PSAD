import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots/index';
import Edit from 'components/pages/parking_lots/edit';
import renderWithBackPath from 'components/modules/render_with_back_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
      <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)}/>
    </React.Fragment>
  );
}

export default withRouter(Routing);
