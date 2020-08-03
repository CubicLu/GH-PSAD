import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Row, Nav } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'informed';
import { isEmpty } from 'underscore';
import { cloneDeep } from 'lodash'
import LocationForm from '../shared/location/form';
import SettingSection from '../shared/setting_section';
import NearbyPlaces from '../shared/nearby_places';
import Rules from './rules'
import  { permissions } from 'config/permissions/forms_fields/parking_lots/new'
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/parking_lots';
/* API */
import { create } from 'api/parking_lots';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { fieldsNew, exampleData } from 'components/helpers/fields/parking_lots';
import Loader from 'components/helpers/loader';
import { exampleData as exampleLocationData } from 'components/helpers/fields/location';
import { FieldType } from 'components/helpers/form_fields';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import styles from './shared.module.sass'

class New extends React.Component {

  state = {
    isSaving: false,
    isDropdownFetching: true,
    currentLocation: exampleLocationData(),
    inputChanged: false,
    showParkingRulesSection: false,
    dropdowns: {},
    errors: {}
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isDropdownFetching } = this.state
    return isDropdownFetching
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: {...this.state.dropdowns, [key]: data} })

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

  backParkingRule = () => {
    this.setState({ showParkingRulesSection: false })
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

  save = (rules = []) => {
    const { backPath } = this.props;
    this.setState({ isSaving: true });

    const values = setEmptyFields(fieldsNew(), this.formApi);
    const { values: settingValues } = this.settingFormApi.getState();
    const { values: nearbyPlacesValues } = this.nearbyPlacesFormApi.getState();
    values.setting = settingValues;
    values.places = nearbyPlacesValues.places;
    values.location = cloneDeep(this.state.currentLocation)
    values.avatar = this.formApi.getValue('avatar');
    values.rules = rules
    values.allow_save = isEmpty(rules) ? 0 : 1


    saveRecord.call(this, create, isEmpty(rules) ? null : backPath, values)
      .then(() => {
        if(isEmpty(rules)) {
          this.setState({
            showParkingRulesSection: true
          })
        }
      });
  };

  renderFields () {
    const { dropdowns } = this.state;
    const { currentUserRoleName } = this.props;

    return (
      renderFieldsWithGrid(
        fieldsNew(dropdowns.townManagers, dropdowns.parkingAdmins, this.renderLocationModal.bind(this), permissions[currentUserRoleName]),
        2,
        6,
        {...this.fieldProps(), errors: this.state.errors }
      )
    );
  }

  renderLocationModal (field, props) {
    return (
      <LocationForm
        errors={props.errors}
        setCurrentLocation={this.setCurrentLocation}
        currentLocation={this.state.currentLocation}
      />);
  }

  renderSetting () {
    const defaultData = {
      overtime: 900,
      parked: 1800,
      period: 1800,
      rate: 0.25
    }
    return <SettingSection
              fieldProps={this.fieldProps()}
              isSaving={this.state.isSaving}
              setFormApi={this.setSettingFormApi}
              record={defaultData}
            />;
  }

  renderNearbyPlaces () {
    const { isSaving, dropdowns: { categoriesPlace } } = this.state

    return (
      <NearbyPlaces
        errors={this.state.errors}
        isSaving={isSaving}
        setFormApi={this.setNearbyPlacesFormApi}
        categoriesDropdown={categoriesPlace}
        setInputChanged={this.setInputChanged}
      />
    )
  }

  renderHeader () {
    const { backPath } = this.props;

    return (<Row>
      <Col sm={12} className="p-4 row">
        <Col md={7}>
          <Link to={backPath} className="mr-2" >
            <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
          </Link>
          Create a new parking lot account
        </Col>
        <Col md={5}>
          <Nav pills className="align-items-center float-right mx-auto">
            <div className="mr-4 text-green">
              <span className={styles['border-number']}>1</span>
              Information
            </div>
            <div className="mr-1">
              <span className={styles['border-number']}>2</span>
              Parking rules
            </div>
          </Nav>
        </Col>
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
        <Button
          status="success"
          className="text-uppercase mb-4 float-right"
          onClick={() => this.save()}
          size="md"
        >
          {isSaving ? btnSpinner() : 'Next >'}
        </Button>
      </Col>
    );
  }

  renderForm () {
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={exampleData()}>
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

  renderRulesForm () {
    return (
      <fieldset >
      </fieldset>
    )
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

  componentDidMount () {
    const { startFetching } = this.props
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

  render () {
    const { showParkingRulesSection, errors } = this.state;

    return this.isFetching() ? <Loader/> : (
      <React.Fragment>
        <div className={showParkingRulesSection ? '' : 'd-none'}>
          <Rules
            {...this.props}
            save={this.save}
            backParkingRule={this.backParkingRule}
            errors={errors}
          />
        </div>
        <div className={showParkingRulesSection ? 'd-none' : ''}>
          {this.renderRecord()}
          <div className="mt-1"/>
          {this.renderSetting()}
          <div className="mt-1"/>
          {this.renderNearbyPlaces()}
          <div className="mt-4"/>
          { this.renderSaveButton()}
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatch (dispatch) {
  return {...bindActionCreators({ setRecord: invoke(SET_RECORD), setListElement: invoke(SET_LIST_ELEMENT) }, dispatch)};
}

New.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connect(
  null,
  mapDispatch
)(
  withFetching (
    withCurrentUser(New)
  )
);
