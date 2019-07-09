import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { create } from 'api/admins';
import { index } from 'api/roles';
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/admins';
import { btnSpinner } from 'components/helpers';
import { fields } from 'components/helpers/admins';
import { fromJson as showErrors } from 'components/helpers/errors';
import CommonForm from 'components/base/common_form';

class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      roles: []
    }
  }

  saveRecord = state => {
    this.setState({ isFetching: true });
    create(state.values)
      .then(this.createSucceed)
      .catch(this.createFailed);
  };

  createSucceed = res => {
    const { backPath, history, setRecord } = this.props;

    setRecord(res.data);
    this.setState({ isFetching: false });
    history.push(backPath);
  };

  createFailed = error => {
    if (error.response) {
      this.setState({ errors: error.response.data.errors })
    }

    this.setState({ isFetching: false });
  };


  componentDidMount() {
    // Index Roles
    index()
      .then(response => {
        this.setState({roles: response.data});
      })
  }

  render() {
    debugger
    return (
      <Card>
        <CardHeader>New Admin</CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          <CommonForm
            {...this.props}
            fields={fields(this.state.roles)}
            isFetching={this.state.isFetching}
            submitForm={this.saveRecord}/>
        </CardBody>
      </Card>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setRecord: invoke(SET_RECORD) }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(New);
