import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/admins';
import { fields } from 'components/helpers/fields/admins';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/admins';
import CommonForm from 'components/base/common_form';
import { search as dropdowns_search } from 'api/dropdowns';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import PasswordConfirmationModal from 'components/helpers/modals/password_confirmation';
import { fromJson as showErrors } from 'components/helpers/errors';
import * as FieldType from 'components/base/common_form/field_types';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      roles: [],
      modal: false,
      formStateValues: {},
      password_verification: ''
    }
  }

  componentDidMount() {
    waitUntilFetched.call(this,
      dropdowns_search('role_id')
        .then(response => this.setState({roles: response.data})),
    )
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { record } = nextProps;
    if (record) this.setState(record);
  }

  values = () => {
    const { record } = this.props;
    return Object.assign({}, record, {
      role_id: record.role.id
    })
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  fieldsForCommonForm = () => {
    let fieldsSet = fields(this.state.roles)
    fieldsSet.push({
      name: 'password', label: 'New Password', type: FieldType.PASSWORD_FIELD
    })
    return fieldsSet
  }

  submitForm = (values) => {
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id })
    if(document.querySelector('input[name="password"]').value) {
      this.toggleModal()
      this.setState({
        formStateValues: JSON.parse(JSON.stringify(values))
      })
    } else {
      updateRecord.call(this, update, path, values)
    }

  }

  renderRecord() {
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id })
    return (
      <React.Fragment>
        <PasswordConfirmationModal
          toggleModal={this.toggleModal}
          isOpen={this.state.modal}
          handleSuccess={()=>{ updateRecord.call(this, update, path, this.state.formStateValues) }}
        />
        <Card>
          <CardHeader>Edit Admin</CardHeader>
          <CardBody>
            {showErrors(this.state.errors)}
            <CommonForm
              {...this.props}
              backPath={path}
              values={this.values()}
              fields={this.fieldsForCommonForm()}
              isFetching={this.state.isFetching}
              submitForm={this.submitForm}/>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), Edit);
