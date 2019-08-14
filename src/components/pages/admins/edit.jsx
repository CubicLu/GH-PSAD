import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/admins';
import { fields } from 'components/helpers/fields/admins';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/admins';
import { CommonForm } from 'components/base/forms';
import { search as dropdownsSearch } from 'api/dropdowns';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import PasswordConfirmationModal from 'components/helpers/modals/password_confirmation';
import { fromJson as showErrors } from 'components/helpers/errors';
import { FieldType } from 'components/helpers/form_fields';
import { renderFieldsWithGrid, renderField } from 'components/base/forms/common_form';
import { btnSpinner } from 'components/helpers';
import { NavLink } from 'react-router-dom';
import { Form } from 'informed';
import { isEmpty } from 'underscore';

class Edit extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {
      roles: [],
    },
    modal: false,
    password_verification: ''
  }

  save = () => {
    const { values } = this.formApi.getState();

    if (document.querySelector('input[name="password"]').value) {
      this.toggleModal();
    } else {
      const { backPath, record } = this.props;
      const path = generatePath(backPath, { id: record.id });
      updateRecord.bind(this, update, path)(values);
    }
  };

  renderFields() {
    const { officer, manager, townManager } = this.state.dropdowns;
    return renderFieldsWithGrid(this.fieldsForCommonForm(), 2, 6, fieldProps)
  }

  fieldsForCommonForm = () => {
    const fieldsSet = fields(this.state.dropdowns.roles);
    fieldsSet.push({
      name: 'password', label: 'New Password', type: FieldType.PASSWORD_FIELD
    });
    return fieldsSet;
  }

  values = () => {
    const { record } = this.props;
    return Object.assign({}, record, {
      role_id: record.role.id
    });
  };


  renderHeader() {
    const { match, record } = this.props;
    const { isSaving } = this.state;

    return (<Row>
      <Col md={2}>
        <Button color="success" outline onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save'}
        </Button>
      </Col>
      <Col md={2} className="align-self-center">
        Edit {record ? record.username : '' }
      </Col>
      <Col md={8}>
        <Nav pills className="float-right">
          <NavLink to={match.url} className="nav-link">Information</NavLink>
        </Nav>
      </Col>
    </Row>);
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };


 renderForm() {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <React.Fragment>
            {this.renderFields()}
          </React.Fragment>
        </Form>
      </fieldset>
    );
  }

  handlePasswordSuccess = () => {
    const { values } = this.formApi.getState();
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.call(this, update, path, values);
  }

  renderRecord() {
    return (
      <React.Fragment>
        <PasswordConfirmationModal
          toggleModal={this.toggleModal}
          isOpen={this.state.modal}
          handleSuccess={this.handlePasswordSuccess}
        />

        <Card>
          <CardHeader>
            {this.renderHeader()}
          </CardHeader>
          <CardBody>
            {showErrors(this.state.errors)}
            {this.renderForm()}
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  componentDidMount () {
    dropdownsSearch('role_id', { admin_id: 1 })
      .then(response => this.setState({ dropdowns: { roles: response.data } }))

  }

  render() {
    const { role_id } = this.state.dropdowns
    return this.props.isFetching || !isEmpty(role_id) ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
      </React.Fragment>
    );
  }

}

Edit.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    role: PropTypes.object.isRequired
  })
};

const fieldProps = { lSize: 6 };

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), Edit);
