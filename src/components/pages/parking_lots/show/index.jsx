import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'underscore';
import { Button, Col, Nav, Row } from 'reactstrap';
import { Form } from 'informed';
import { Link } from 'react-router-dom';
import LocationForm from '../shared/location/form';
import SettingSection from '../shared/setting_section';
import NearbyPlaces from '../shared/nearby_places';
import VoiSection from '../shared/voi_section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash'
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/parking_lots';
import { invoke } from 'actions';
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { show, update } from 'api/parking_lots';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
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

class Show extends React.Component {
  state = {
    isSaving: false,
    currentLocation: null,
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
    lSize: 6,
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

  renderFields () {
    const { dropdowns } = this.state;
    return renderFieldsWithGrid(fieldsShow(dropdowns.townManagers, dropdowns.parkingAdmins, this.renderLocationModal.bind(this)), 2, 6, {...this.fieldProps(), errors: this.state.errors });
  }

  values () {
    const { record } = this.props;
    const values = Object.assign({}, record);

    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    values.parking_admin_id = record.parking_admin ? record.parking_admin.id : null;
    return values;
  }

  renderLocationModal (field, props) {
    return (
      <LocationForm
        errors={props.errors}
        setCurrentLocation={this.setCurrentLocation}
        currentLocation={this.state.currentLocation}
      />);
  }

  renderHeader () {
    const { backPath, record, match, history } = this.props;

    return (<Row className="p-4">
      <Col md={2}>
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
        </Link>
        {record.name}
      </Col>
      <Col md={10}>
        <Nav pills className="align-items-center float-right mx-auto">
          <span className="mr-4">
            ID: {record.id}
          </span>
          <Button className="mr-1" onClick={() => history.push(match.url)} color="primary-lg">
            Information
          </Button>
          <Button className="mr-1" onClick={() => history.push(`${match.url}/rules`)} color="disabled-lg">
            Parking Rules
          </Button>
          <Button className="mr-1" onClick={() => history.push(`${match.url}/spaces`)} color="disabled-lg">
            Parking Spaces
          </Button>
        </Nav>
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success" className="px-5 py-2 mb-4 float-right"  onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save Changes'}
        </Button>
      </Col>
    );
  }

  renderForm () {
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

  renderRecord () {
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

  renderSetting () {
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

  renderVoi () {
    const { record } = this.props;
    return <VoiSection records={record.vehicle_rules}/>;
  }

  renderNearbyPlaces () {
    const { record } = this.props;
    const { isSaving, dropdowns: { categoriesPlace } } = this.state

    return (
      <NearbyPlaces
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
      this.setState({currentLocation: nextProps.record.location })
    }
  }

  componentDidMount () {
    const { startFetching } = this.props

    startFetching(searchAdminByRoleName(['parking_admin', 'town_manager']))
      .then((result) => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            parkingAdmins: result.parking_admin,
            townManagers: result.town_manager
          }
        });
      })
    startFetching(dropdownsSearch('categories_place'))
      .then(result => {
         this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            categoriesPlace: result.data
          }
        });
      })
  }

  render () {
    const { inputChanged } = this.state;

    return this.isFetching() ?  <Loader/> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1"/>
        {this.renderSetting()}
        <div className="mt-1"/>
        {this.renderNearbyPlaces()}
        <div className="mt-1"/>
        {this.renderVoi()}
        <div className="mt-4"/>
        { inputChanged && this.renderSaveButton()}
      </React.Fragment>
    );
  }
}

function mapDispatch (dispatch) {
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
)(withFetching(Show)));
