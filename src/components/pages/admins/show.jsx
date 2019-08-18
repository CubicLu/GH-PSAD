import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/admins';
import { fields } from 'components/helpers/fields/admins';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import PasswordConfirmationModal from 'components/helpers/modals/password_confirmation';
import { fromJson as showErrors } from 'components/helpers/errors';
import { FieldType } from 'components/helpers/form_fields';
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import { btnSpinner } from 'components/helpers';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import { isEmpty } from 'underscore';
import ShowActivity from './activity'
import setFormApiFields from 'components/modules/set_form_api_fields';

class Show extends React.Component {
  state = {
    isSaving: false,
    isEditing: false,
    dropdowns: {
      roles: []
    },
    modal: false,
    password_verification: ''
  }

  save = () => {

    let values = setFormApiFields(this.fieldsForCommonForm(), this.formApi)
    values.avatar = this.formApi.getValue('avatar')

    if (document.querySelector('input[name="password"]').value) {
      this.toggleModal();
    } else {
      const { backPath, record } = this.props;
      const path = generatePath(backPath, { id: record.id });
      updateRecord.bind(this, update, path)(values);
    }
  };

  renderFields () {
    return renderFieldsWithGrid(this.fieldsForCommonForm(), 2, 6, fieldProps);
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

  toggleEditing = () =>  this.setState((prevState) => ({ isEditing: !prevState }))

  renderHeader () {
    const { backPath, record } = this.props;

    return (<Row>
      <Col md={2} className="align-self-center">
        <Link to={backPath} className="mr-2 back-button" >&#10094;</Link>
        {record ? record.username : '' }
      </Col>
      <Col md={10} >
        <Nav pills className="float-right mx-auto">
          ID: {record.id}
        </Nav>
      </Col>
    </Row>);
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success float-right" outline onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save Changes'}
        </Button>
      </Col>
    )
  }

  renderForm () {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, fieldProps)}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
          </Row>
          { this.renderSaveButton()}
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

  renderRecord () {
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

  renderActivity () {
    return <ShowActivity/>
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  componentDidMount () {
    dropdownsSearch('role_id', { admin_id: 1 })
      .then(response => this.setState({ dropdowns: { roles: response.data } }));
  }

  render () {
    const { role_id } = this.state.dropdowns;
    return this.props.isFetching || !isEmpty(role_id) ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1"/>
        {this.renderActivity()}
      </React.Fragment>
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    role: PropTypes.object.isRequired
  })
};

const fieldProps = { lSize: 6 };

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), Show);
