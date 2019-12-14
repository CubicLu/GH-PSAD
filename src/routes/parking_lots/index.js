import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots/index';
import Show from 'components/pages/parking_lots/show';
import New from 'components/pages/parking_lots/new';
import Rules from 'components/pages/parking_lots/show/rules'
import ParkingSessionsIndex from 'components/pages/parking_lots/show/parking_sessions/index'
import ParkingSessionsShow from 'components/pages/parking_lots/show/parking_sessions/show'
import ParkingSpaces from 'components/pages/parking_lots/show/parking_spaces'
import renderWithBackPath from 'components/modules/render_with_back_path';
import renderWithParentPath from 'components/modules/render_with_parent_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index} />
      <Switch>
        <Route exact path={`${match.path}/new/`} render={renderWithBackPath(New, `${match.url}/`)} />
        <Route path={`${match.path}/:id`} render={(props) => (
          <React.Fragment>
            <Route exact path={`${props.match.path}`} component={renderWithBackPath(Show, `${match.url}/`)} />
            <Route exact path={`${props.match.path}/rules`} render={renderWithParentPath(renderWithBackPath(Rules, `${match.url}/`), props.match.url)} />
            <Route exact path={`${props.match.path}/spaces`} render={renderWithParentPath(renderWithBackPath(ParkingSpaces, `${match.url}/`), props.match.url)}/>
            <Route exact path={`${props.match.path}/parking_sessions`} render={renderWithBackPath(ParkingSessionsIndex,`${props.match.url}/spaces`)}/>
            <Route exact path={`${props.match.path}/parking_sessions/:id`} render={renderWithBackPath(ParkingSessionsShow,`${props.match.url}/parking_sessions`)}/>
          </React.Fragment>
        )} />
      </Switch>
    </React.Fragment>
  );
}

export default withRouter(Routing);
