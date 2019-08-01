import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { generatePath } from 'react-router';

class Edit extends React.Component {
  render () {
    return this.props.isFetching ? <div>Loading data...</div> : <div>Data is loaded</div>;
  }
}

Edit.propTypes = {
  isFetching: PropTypes.bool.isRequired
};

export default connect()(Edit);
