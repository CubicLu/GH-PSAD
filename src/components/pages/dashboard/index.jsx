import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import SideNavigation from '../side_navigation';
import MainContent from '../main_content';

const renderError = error => {
  const { url } = error.config;
  const { response } = error;

  return (
    <Alert color="danger">
      {`Request to ${url} returned ${response.status} status code`}
    </Alert>
  );
};

const Dashboard = props => {
  const { serverError } = props;

  return (
    <div className='row'>
      <div className='col-2'>
        <SideNavigation />
      </div>
      <div className="col-10">
        {serverError ? renderError(serverError) : <MainContent/>}
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
  serverError: PropTypes.bool
};

export default connect(mapState)(Dashboard);
