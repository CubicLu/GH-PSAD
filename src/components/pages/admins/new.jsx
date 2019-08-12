import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { create } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/admins';
import { fields, exampleData } from 'components/helpers/fields/admins';
import { fromJson as showErrors } from 'components/helpers/errors';
import CommonForm from 'components/base/forms/common_form';
import saveRecord from 'components/modules/form_actions/save_record';
import waitUntilFetched from 'components/modules/wait_until_fetched';

class New extends React.Component {
  state = {
    isSaving: true,
    roles: []
  }


  componentDidMount () {
    waitUntilFetched.call(this,
      dropdownsSearch('role_id')
        .then(response => this.setState({ roles: response.data }))
    );
  }

  render () {
    return (
      <Card>
        <CardHeader>New Admin</CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          <CommonForm
            values={exampleData}
            {...this.props}
            fields={fields(this.state.roles)}
            isFetching={this.state.isSaving}
            submitForm={saveRecord.bind(this, create)}/>
        </CardBody>
      </Card>
    );
  }
}

function mapDispatch (dispatch) {
  return bindActionCreators({ setRecord: invoke(SET_RECORD) }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(New);
