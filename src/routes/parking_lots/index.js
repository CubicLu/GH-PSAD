import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots/index';
import Show from 'components/pages/parking_lots/show';
import New from 'components/pages/parking_lots/new';
import Rules from 'components/pages/parking_lots/show/rules'
import renderWithBackPath from 'components/modules/render_with_back_path';
import renderWithParentPath from 'components/modules/render_with_parent_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
      <Switch>
        <Route exact path={`${match.path}/new/`} render={renderWithBackPath(New, `${match.url}/`)}/>
        <Route path={`${match.path}/:id`} render={(props) => (
          <React.Fragment>
            <Route exact path={`${props.match.path}`} component={renderWithBackPath(Show, `${match.url}/`)}/>
            <Route path={`${props.match.path}/rules`} render={renderWithParentPath(renderWithBackPath(Rules, `${match.url}/`), props.match.url)}/>
          </React.Fragment>
        )}/>
      </Switch>
    </React.Fragment>
  );
}

export default withRouter(Routing);
