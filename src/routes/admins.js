import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/admins';
import Show from 'components/pages/admins/show';
import Edit from 'components/pages/admins/edit';
import New from 'components/pages/admins/new';
import renderWithBackPath from 'components/modules/render_with_back_path';

function Routing(props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
    </React.Fragment>
  );
}

export default withRouter(Routing);
