import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideNavigation from '../side_navigation';
import MainContent from '../main_content';
import ErrorBoundary from 'components/base/errors/error_boundary';
import styles from './frame.module.sass'

const Frame = props => {
  const { serverError } = props;

  return (
    <div className='d-flex justify-content-between'>
      <div className={styles.SideNavigationContainer}>
        <SideNavigation />
      </div>
      <div className={`${styles.contentContainer} frame-container shadow-sm bg-white`}>
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

Frame.propTypes = {
  serverError: PropTypes.object
};

export default connect(mapState)(Frame);
