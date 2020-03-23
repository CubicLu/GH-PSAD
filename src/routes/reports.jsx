import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router';
import Index from 'components/pages/reports/index';

const Routing = (props) => {
  const { match } = props;
  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
    </React.Fragment>
  );
};

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
