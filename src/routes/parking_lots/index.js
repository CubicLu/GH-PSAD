import React from 'react';
import { Route, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots/index';
import Show from 'components/pages/parking_lots/show';
import renderWithBackPath from 'components/modules/render_with_back_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
      <Route exact path={`${match.path}/:id/`} render={renderWithBackPath(Show, `${match.url}/`)}/>
    </React.Fragment>
  );
}

export default withRouter(Routing);
