import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Show from 'components/pages/towns/show';
import renderWithBackPath from 'components/modules/render_with_back_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Switch>
        <Route path={`${match.path}/:id`} render={(props) => (
          <React.Fragment>
            <Route exact path={`${props.match.path}`} component={renderWithBackPath(Show, `${match.url}/`)} />
          </React.Fragment>
        )} />
      </Switch>
    </React.Fragment>
  );
}

export default withRouter(Routing);
