import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots/index';
import Edit from 'components/pages/parking_lots/edit';
import SettingRouting from './settings';
import renderWithBackPath from 'components/modules/render_with_back_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
      <Route exact path={`${match.path}/:id/edit`} render={renderWithBackPath(Edit, `${match.url}/:id`)}/>
      <div className="mt-1">
        <SettingRouting match={match}/>
      </div>
      <div className="mt-1">
        <SettingRouting match={match}/>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Routing);
