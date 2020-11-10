import React from 'react';
import PropTypes from 'prop-types';
import { Col, Nav, Row, Label, FormGroup } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
import _ from 'lodash';
import ChangePasswordModal from './change_password_modal';
/* Actions */
import { setCurrentUserData } from 'actions/users';
/* API */
import { updateMe } from 'api/users';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fields } from 'components/helpers/fields/profile';
import { FieldType } from 'components/helpers/form_fields';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Module */
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';

class Profile extends React.Component {
  state = {
    isSaving: false,
    modal: false,
    errors: {}
  }

  static contextType = AlertMessagesContext

  fieldProps = () => ({
    lSize: 6
  })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  toggleModal = () => this.setState(prevState => ({ modal: false }))

  update = () => {
    const values = setEmptyFields(fields(), this.formApi);
    values.avatar = this.formApi.getValue('avatar');
    this.setState({ isSaving: true });
    updateMe(values)
      .then(() => {
        this.props.setCurrentUserData()
        this.context.addAlertMessages([{
          type: 'Success',
          text: 'Profile updated succesfully'
        }])
        this.setState({
          errors: {}
        })
      })
      .catch((error) => {
        this.setState({ errors: error.response.data.errors })
        this.context.addAlertMessages([{
          type: 'Error',
          text: 'Wrong data in marked fields. Please check them and correct.'
        }])
      })
      .finally(() => this.setState({ isSaving: false }))
  };

  renderHeader() {
    const { currentUser } = this.props;

    return (
      <Row className="p-4">
        <Col md={2} className="align-self-center  h2-title">
          Account information
        </Col>
        <Col md={10} >
          <Nav pills className="float-right mx-auto general-text-4">
            ID: {currentUser.id}
          </Nav>
        </Col>
      </Row>
    );
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col className="my-5">
        <Button
          size="md"
          status="success"
          className="px-5 py-2 mb-4"
          onClick={this.update}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </Col>
    );
  }

  renderFields() {
    return renderFieldsWithGrid(fields(), 1, 6, { ...this.fieldProps(), errors: this.state.errors });
  }

  renderForm() {
    const { currentUser } = this.props;
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
          <Form getApi={this.setFormApi} initialValues={currentUser}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, { lSize: 6 })}
            </Col>
            <Col sm={12} md={9}>
              <Row sm={12} className="mb-5">
                <Col sm={6}>
                  Account Status: <strong className="text-green" >active</strong>
                </Col>
                <Col sm={6}>
                  User role: <strong>{ _.startCase(currentUser.role.name) }</strong>
                </Col>
              </Row>
              <Col sm={12}>
                { this.renderFields() }
                <Row>
                  <Col md={6}>
                    <FormGroup row >
                      <Label md={6}>
                        Password
                      </Label>
                      <Col md={6}>
                        <Button onClick={() => this.setState({modal: true})} size="sm" outline color="primary" className="general-text-1 py-2 px-5 ">
                          <span className="">Change password</span>
                        </Button>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                { this.renderSaveButton() }
              </Col>
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  renderRecord() {
    const { currentUser } = this.props
    return (
      <Row className="m-0">
        <ChangePasswordModal
          toggleModal={this.toggleModal}
          isOpen={this.state.modal}
          currentUser={currentUser}
          addAlertMessages={this.context.addAlertMessages}
        />
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
      </Row>
    );
  }

  render() {
    return this.renderRecord()
  }
}

Profile.propTypes = {
  currentUser: PropTypes.object.isRequired,
  setCurrentUserData: PropTypes.func.isRequired
};

function mapDispatch (dispatch) {
  return { ...bindActionCreators({ setCurrentUserData }, dispatch) };
}

export default connect(
  null,
  mapDispatch
)(withCurrentUser(Profile));
