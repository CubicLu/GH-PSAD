import React from 'react';
import { connect } from 'react-redux';
// import { generatePath } from 'react-router';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    }
  }


  render() {
    return this.props.isFetching ? <div>Loading data...</div> : <div>Data is loaded</div>;
  }
}

export default connect()(Edit);
