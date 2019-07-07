import React from 'react';
import { connect } from 'react-redux';
import { btnSpinner } from 'components/helpers';

class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      errors: {}
    }
  }

  // saveRecord = event => {
  //   event.preventDefault();
  //
  //   const { name, stream, login, password, parking_lot_id } = this.state;
  //
  //   this.setState({ isFetching: true });
  //   create({ name, stream, login, password, parking_lot_id })
  //     .then(this.handleCreate);
  // };

  render() {
    return null;
  }
}


export default connect()(New);
