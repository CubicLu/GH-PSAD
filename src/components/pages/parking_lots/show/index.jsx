import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'underscore';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { Form } from 'informed';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
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
import { fromJson as showErrors } from 'components/helpers/errors';
import { FieldType } from 'components/helpers/form_fields';
import { fields } from 'components/helpers/fields/parking_lots';
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
    dropdowns: {}
  };

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
    const values = setEmptyFields(fields(), this.formApi);
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
    return renderFieldsWithGrid(fields(dropdowns.townManagers, dropdowns.parkingAdmins, this.renderLocationModal.bind(this)), 2, 6, this.fieldProps());
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
        setCurrentLocation={this.setCurrentLocation}
        currentLocation={this.state.currentLocation}
      />);
  }

  renderHeader () {
    const { backPath, record, match } = this.props;

    return (<Row>
      <Col md={2}>
        <Link to={backPath} className="mr-2 back-button" >
          <FontAwesomeIcon icon={faChevronLeft}/>
        </Link>
        {record.name}
      </Col>
      <Col md={10}>
        <Nav pills className="align-items-center float-right mx-auto">
          <span className="mr-4">
            ID: {record.id}
          </span>
          <NavLink to={match.url} className="nav-link">Information</NavLink>
          <NavLink to={`${match.url}/rules`} className="nav-link">Parking Rules</NavLink>
          <NavLink to={`${match.url}/spaces`} className="nav-link">Parking Spaces</NavLink>
        </Nav>
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success float-right" outline onClick={this.save}>
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
      <Card>
        <CardHeader>
          {this.renderHeader()}
        </CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          {this.renderForm()}
        </CardBody>
      </Card>
    );
  }

  renderSetting () {
    const { record } = this.props;
    return <SettingSection isSaving={this.state.isSaving} setFormApi={this.setSettingFormApi} record={record.setting}/>;
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

    return this.isFetching() ? <div>Loading data...</div> : (
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
