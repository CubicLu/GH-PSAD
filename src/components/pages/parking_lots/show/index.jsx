import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'underscore';
import { Col, Row } from 'reactstrap';
import { Form } from 'informed';
import LocationForm from '../shared/location/form';
import SettingSection from '../shared/setting_section';
import NearbyPlaces from '../shared/nearby_places';
import Header from '../shared/header';
import { cloneDeep } from 'lodash'
import { permissions } from 'config/permissions/forms_fields/parking_lots/show'
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/parking_lots';
import { invoke } from 'actions';
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { show, update } from 'api/parking_lots';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { FieldType } from 'components/helpers/form_fields';
import { fieldsShow } from 'components/helpers/fields/parking_lots';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';
/* Styles/Assets */
import styles from './show.module.sass';

class Show extends React.Component {
  state = {
    isSaving: false,
    currentLocation: null,
    isDropdownFetching: true,
    inputChanged: false,
    dropdowns: {},
    errors: {}
  };

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isResourceFetching } = this.props
    const { dropdowns, currentLocation } = this.state
    return isResourceFetching || !currentLocation || isEmpty(dropdowns)
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setSettingFormApi = formApi => {
    this.settingFormApi = formApi;
  };

  setNearbyPlacesFormApi = formApi => {
    this.nearbyPlacesFormApi = formApi;
  };

  setInputChanged = () => {
    this.setState({ inputChanged: true })
  }

  fieldProps = () => ({
    lSize: 4,
    iSize: 8,
    events: {
      onChange: () => this.setInputChanged()
    }
  })

  setCurrentLocation = currentLocation => {
    this.setState({
      inputChanged: true,
      currentLocation
    })
  };

  save = () => {
    const values = setEmptyFields(fieldsShow(), this.formApi);
    const { values: settingValues } = this.settingFormApi.getState();
    const { values: nearbyPlacesValues } = this.nearbyPlacesFormApi.getState();
    values.setting = settingValues;
    values.places = nearbyPlacesValues.places;
    values.location = cloneDeep(this.state.currentLocation)
    values.avatar = this.formApi.getValue('avatar');

    updateRecord.bind(this, update, '/dashboard/parking_lots')(values);
  };

  renderFields() {
    const { dropdowns } = this.state;
    const { currentUserRoleName } = this.props;

    return (
      renderFieldsWithGrid(
        fieldsShow(dropdowns.townManagers, dropdowns.parkingAdmins, this.renderLocationModal.bind(this), permissions[currentUserRoleName]),
        2,
        6,
        { ...this.fieldProps(), errors: this.state.errors })
    )
  }

  values() {
    const { record } = this.props;
    const values = Object.assign({}, record);

    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    values.parking_admin_id = record.parking_admin ? record.parking_admin.id : null;
    return values;
  }

  renderLocationModal(field, props) {
    return (
      <LocationForm
        errors={props.errors}
        setCurrentLocation={this.setCurrentLocation}
        currentLocation={this.state.currentLocation}
      />);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Row>
        <Col className="d-flex justify-content-end">
          <Button
            status="success"
            onClick={this.save}
            className={styles.btnSave}
            size="md"
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    );
  }

  renderForm() {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form
          getApi={this.setFormApi}
          initialValues={this.values()}
          className={styles.form}
        >
          <Row>
            <Col xs={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, this.fieldProps())}
            </Col>
            <Col xs={9} className={styles.formFields}>
              {this.renderFields()}
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  renderSetting() {
    const { record } = this.props;
    return (
      <SettingSection
        fieldProps={this.fieldProps()}
        isSaving={this.state.isSaving}
        setFormApi={this.setSettingFormApi}
        record={record.setting}
      />
    );
  }

  renderNearbyPlaces() {
    const { record } = this.props;
    const { isSaving, dropdowns: { categoriesPlace } } = this.state

    return (
      <NearbyPlaces
        errors={this.state.errors}
        isSaving={isSaving}
        setFormApi={this.setNearbyPlacesFormApi}
        records={record.places}
        categoriesDropdown={categoriesPlace}
        setInputChanged={this.setInputChanged}
      />
    )
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.record) {
      this.setState({ currentLocation: nextProps.record.location })
    }
  }

  componentDidMount() {
    const { startFetching, record } = this.props
    if (record) {
      this.setState({ currentLocation: record.location })
    }
    Promise.all([
      startFetching(dropdownsSearch('admins_by_role-town_manager'))
        .then(response => this.setDropdowns('townManagers', response.data)),
      startFetching(dropdownsSearch('admins_by_role-parking_admin'))
        .then(response => this.setDropdowns('parkingAdmins', response.data)),
      startFetching(dropdownsSearch('categories_place'))
        .then(response => this.setDropdowns('categoriesPlace', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }))

  }

  render() {
    const { inputChanged } = this.state;
    if (this.isFetching()) {
      return <Loader />;
    }

    return (
      <div className={styles.container}>
        <Header
          {...this.props}
          parentPath={this.props.match.url}
        />
        <div className={`${styles.hint} bg-grey-light`}>
          <p className="general-text-2 m-0">
            Fields marked with an asterik (*) are mandatory
          </p>
        </div>
        {this.renderForm()}
        {this.renderSetting()}
        <div className="mt-1" />
        {this.renderNearbyPlaces()}
        {inputChanged && this.renderSaveButton()}
      </div>
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
    parking_admin: PropTypes.object,
    vehicle_rules: PropTypes.arrayOf(PropTypes.object),
    setting: PropTypes.object
  })
};

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
