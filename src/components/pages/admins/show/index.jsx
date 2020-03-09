import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Nav, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import { isEmpty } from 'underscore';
import ActivityIndex from './activity/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/admins';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { fields } from 'components/helpers/fields/admins';
import PasswordConfirmationModal from 'components/helpers/modals/password_confirmation';
import { FieldType } from 'components/helpers/form_fields';
import { btnSpinner } from 'components/helpers';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Module */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';
import Loader from 'components/helpers/loader';

class Show extends React.Component {
  state = {
    isSaving: false,
    defaultRecord: {},
    inputChanged: false,
    dropdowns: {
      roles: []
    },
    modal: false,
    password_verification: '',
    errors: {}
  }

  static contextType = AlertMessagesContext

  isFetching() {
    const { isResourceFetching } = this.props
    const { roles } = this.state.dropdowns;
    return isResourceFetching || isEmpty(roles)
  }

  fieldProps = () => ({
    lSize: 6,
    customAttr: {
      onChange: () => this.setState({ inputChanged: true })
    },
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  toggleEditing = () => this.setState((prevState) => ({ isEditing: !prevState.isEditing }))

  toggleModal = () => this.setState(prevState => ({ modal: !prevState.modal }))

  handlePasswordSuccess = () => {
    const { values } = this.formApi.getState();
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.call(this, update, path, values);
  }

  save = () => {
    const values = setEmptyFields(this.fieldsForCommonForm(), this.formApi);
    values.avatar = this.formApi.getValue('avatar');
    if (this.formApi.getValue('password')) {
      this.toggleModal();
    } else {
      const { backPath, record } = this.props;
      const path = generatePath(backPath, { id: record.id });
      updateRecord.bind(this, update, path)(values);
    }
  };

  values = () => {
    const { record } = this.props;
    return Object.assign({}, record, {
      role_id: record.role.id
    });
  };

  renderHeader() {
    const { backPath, record } = this.props;

    return (<Row className="p-4">
      <Col md={2} className="align-self-center ">
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft} />
        </Link>
        {record.username}
      </Col>
      <Col md={10} >
        <Nav pills className="float-right mx-auto">
          ID: {record.id}
        </Nav>
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success" className="px-5 py-2 float-right" onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save Changes'}
        </Button>
      </Col>
    );
  }

  renderFields() {
    return renderFieldsWithGrid(this.fieldsForCommonForm(), 2, 6, { ...this.fieldProps(), errors: this.state.errors });
  }

  renderForm() {
    const { record } = this.props;
    const { isSaving, inputChanged } = this.state;

    return (
      <fieldset disabled={isSaving || !record.actions.update}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, this.fieldProps())}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
          </Row>
          {inputChanged && this.renderSaveButton()}
        </Form>
      </fieldset>
    );
  }

  renderRecord() {
    return (
      <Row className="m-0">
        <PasswordConfirmationModal
          toggleModal={this.toggleModal}
          isOpen={this.state.modal}
          handleSuccess={this.handlePasswordSuccess}
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

  fieldsForCommonForm = () => {
    const fieldsSet = fields(this.state.dropdowns.roles);
    fieldsSet.push({
      name: 'password', label: 'Password', type: FieldType.PASSWORD_FIELD, filled: true
    });
    return fieldsSet;
  }

  fetchData = (currentUser, record) => {
    dropdownsSearch('role_id', { admin_id: currentUser.id, edited_admin_id: record.id })
      .then(response => {
        if (!isEmpty(response.data)) {
          this.setState({ dropdowns: { roles: response.data } })
        } else {
          // This happens when the user is not allowed to update
          this.setState({ dropdowns: { roles: [{ value: currentUser.role.id, label: currentUser.role.name }] } })
        }
      });
  }
  componentWillReceiveProps(nextProps) {
    const { currentUser, record } = nextProps
    if (currentUser && record) {
      this.fetchData(currentUser, record)
    }
  }

  componentDidMount() {
    const { currentUser, record } = this.props
    if (currentUser && record) {
      this.fetchData(currentUser, record)
    }
  }

  render() {
    return this.isFetching() ? <Loader /> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1" />
        <ActivityIndex />
      </React.Fragment>
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    role: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired
  })
};

function mapDispatch(dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), connect(null, mapDispatch)(withCurrentUser(Show)));
