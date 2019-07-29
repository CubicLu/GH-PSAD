import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { create } from 'api/agencies';
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/agencies';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { fields, exampleData } from 'components/helpers/fields/agencies';
import { fromJson as showErrors } from 'components/helpers/errors';
import CommonForm from 'components/base/common_form';
import saveRecord from 'components/modules/form_actions/save_record';
import waitUntilFetched from 'components/modules/wait_until_fetched';

class New extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isFetching: true,
      town_managers: [],
      managers: [],
      officers: []
    };
  }

  componentDidMount () {
    waitUntilFetched.call(this,
      searchAdminByRoleName(['manager', 'officer', 'town_manager'])
        .then((result) => this.setState({ ...result }))
        .catch(this.handleFailed)
    );
  }

  render () {
    const { town_managers, managers, officers } = this.state;

    return (
      <Card>
        <CardHeader>New Agency</CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          <CommonForm
            {...this.props}
            values={exampleData}
            fields={fields(officers, managers, town_managers)}
            isFetching={this.state.isFetching}
            submitForm={saveRecord.bind(this, create)} />
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
