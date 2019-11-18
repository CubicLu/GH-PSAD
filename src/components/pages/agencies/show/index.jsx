import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Col, Nav, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
import { generatePath } from 'react-router';
import LocationForm from '../location/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash'
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/agencies';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/agencies';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { fields } from 'components/helpers/fields/agencies';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { FieldType } from 'components/helpers/form_fields';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import setEmptyFields from 'components/modules/set_empty_fields';
import withFetching from 'components/modules/with_fetching';
import Loader from 'components/helpers/loader';

class Show extends React.Component {
  state = {
    isSaving: false,
    collapse: false,
    inputChanged: false,
    isDropdownFetching: true,
    currentLocation: null,
    dropdowns: {
      officers: [],
      managers: [],
      townManagers: []
    },
    errors: {}
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isResourceFetching } = this.props
    const { currentLocation, isDropdownFetching } = this.state
    return isResourceFetching || !currentLocation || isDropdownFetching
  }

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  setDropdowns = (key, data) => this.setState({ dropdowns: {...this.state.dropdowns, [key]: data} })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setCurrentLocation = currentLocation => {
    this.setState({
      inputChanged: true,
      currentLocation
    })
  };

  save = () => {
    const values = setEmptyFields(fields([], [], []), this.formApi);
    values.avatar = this.formApi.getValue('avatar');
    values.location = cloneDeep(this.state.currentLocation)
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.bind(this, update, path)(values);
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.manager_id = record.manager ? record.manager.id : null;
    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    values.officer_ids = record.officers ? record.officers.map(officer => officer.id) : null;
    return values;
  };

  renderHeader () {
    const { backPath, record } = this.props;

    return (<Row className="p-4">
      <Col md={2} className="align-self-center">
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
        </Link>
        {record.name}
      </Col>
      <Col md={10}>
        <Nav pills className="float-right general-text-3">
          <h6>
            ID: {record.id}
          </h6>
        </Nav>
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

  renderFields () {
    const { officers, managers, townManagers } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, managers, townManagers, this.renderLocationModal.bind(this)), 2, 6, {...this.fieldProps(), errors: this.state.errors});
  }

  renderLocationModal (field, props) {
    return (
      <LocationForm
        errors={props.errors}
        setCurrentLocation={this.setCurrentLocation}
        currentLocation={this.state.currentLocation}
      />);
  }

  renderForm () {
    const { isSaving, inputChanged } = this.state;

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
          { inputChanged && this.renderSaveButton()}
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

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.record) {
      this.setState({currentLocation: nextProps.record.location })
    }
  }

  componentDidMount () {
    const { startFetching } = this.props

    Promise.all([
        startFetching(dropdownsSearch('admins_by_role-town_manager'))
          .then(response => this.setDropdowns('townManagers', response.data)),
        startFetching(dropdownsSearch('admins_by_role-officer'))
          .then(response => this.setDropdowns('officers', response.data)),
        startFetching(dropdownsSearch('admins_by_role-manager'))
          .then(response => this.setDropdowns('managers', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }))
  }

  render () {
    return this.isFetching() ? <Loader/> : (
      this.renderRecord()
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    town_manager: PropTypes.object,
    manager: PropTypes.object,
    officers: PropTypes.arrayOf(PropTypes.object)
  })
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectRecord('agency', SET_RECORD, resourceFetcher(show), connect(null, mapDispatch)(withFetching(Show)));
