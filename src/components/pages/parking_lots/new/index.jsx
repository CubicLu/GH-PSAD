import React from 'react';
import { connect } from 'react-redux';

class New extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isSaving: false,
      errors: {}
    };
  }

  render () {
    return null;
  }
}

export default connect()(New);
