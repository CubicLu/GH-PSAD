import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'underscore';
import { Button, Col, Row } from 'reactstrap';
import { Form } from 'informed';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { permissions } from 'config/permissions/forms_fields/towns'
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/towns';
import { invoke } from 'actions';
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { show, update } from 'api/towns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { FieldType } from 'components/helpers/form_fields';
import { fields } from 'components/helpers/fields/towns';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';

class Show extends React.Component {
  state = {
    isSaving: false,
    isDropdownFetching: true,
    inputChanged: false,
    dropdowns: {},
    errors: {}
  };

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isResourceFetching } = this.props
    const { dropdowns } = this.state
    return isResourceFetching || isEmpty(dropdowns)
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setNearbyPlacesFormApi = formApi => {
    this.nearbyPlacesFormApi = formApi;
  };

  setInputChanged = () => {
    this.setState({ inputChanged: true })
  }

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setInputChanged()
    }
  })

  save = () => {
    const values = setEmptyFields(fields(), this.formApi);
    values.avatar = this.formApi.getValue('avatar');
    updateRecord.bind(this, update, '/dashboard/towns')(values);
  };

  renderFields() {
    const { dropdowns } = this.state;
    const { currentUserRoleName } = this.props;

    return (
      renderFieldsWithGrid(
        fields(dropdowns.townManagers, permissions[currentUserRoleName]),
        2,
        6,
        { ...this.fieldProps(), errors: this.state.errors })
    )
  }

  values() {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    return values;
  }

  renderHeader() {
    const { backPath, record, match, history } = this.props;

    return (<Row className="p-4">
      <Col md={2} className="d-flex align-items-center">
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft} />
        </Link>
        Town Details
        <span className="ml-4 general-text-3 text-nowrap">
          <h6 className="m-0">
            ID: {record.id}
          </h6>
        </span>
      </Col>
      <Col sm={12} className="bg-grey-light">
        <p className="general-text-2 py-3 m-0">
          Fields marked with an asterik (*) are mandatory
       </p>
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success" className="px-5 py-2 mb-4 float-right" onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save Changes'}
        </Button>
      </Col>
    );
  }

  renderForm() {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, this.fieldProps())}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  renderRecord() {
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
      </Row>
    );
  }

  componentDidMount() {
    const { startFetching, record } = this.props;
    Promise.all([
      startFetching(dropdownsSearch('admins_by_role-town_manager'))
        .then(response => this.setDropdowns('townManagers', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }))
  }

  render() {
    const { inputChanged } = this.state;
    return this.isFetching() ? <Loader /> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1" />
        {inputChanged && this.renderSaveButton()}
      </React.Fragment>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

Show.propTypes = {
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    town_manager: PropTypes.object,
  })
};

export default connectRecord('towns', SET_RECORD, resourceFetcher(show), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
