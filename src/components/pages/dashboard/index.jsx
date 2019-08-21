import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideNavigation from '../side_navigation';
import MainContent from '../main_content';
import ErrorBoundary from 'components/base/errors/error_boundary';

const Dashboard = props => {
  const { serverError } = props;

  return (
    <div className='row'>
      <div className='col-2'>
        <SideNavigation />
      </div>
      <div className="col-10">
        <ErrorBoundary serverError={serverError}>
          <MainContent/>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const mapState = state => {
  const { server } = state;
  const { error = {} } = server;
  return { serverError: error.payload };
};

Dashboard.propTypes = {
  serverError: PropTypes.object
};

export default connect(mapState)(Dashboard);
