import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import New from 'components/pages/towns/new';
import renderWithBackPath from 'components/modules/render_with_back_path';


function Routing(props) {
  const { match } = props;
  return (
    <React.Fragment>      
        <Route exact path={`${match.path}/new/`} render={renderWithBackPath(New, `${match.url}/`)} />
    </React.Fragment>
  );
}

export default withRouter(Routing);
