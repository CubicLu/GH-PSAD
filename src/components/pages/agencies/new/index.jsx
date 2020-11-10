import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import LocationForm from '../location/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash'
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/agencies';
/* API */
import { create } from 'api/agencies';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fields, exampleData } from 'components/helpers/fields/agencies';
import { exampleData as exampleLocationData } from 'components/helpers/fields/location';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { FieldType } from 'components/helpers/form_fields';
import Loader from 'components/helpers/loader';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withFetching from 'components/modules/with_fetching';

class New extends React.Component {
  state = {
    isSaving: false,
    isDropdownFetching: true,
    dropdowns: {},
    currentLocation: exampleLocationData(),
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

  setCurrentLocation = currentLocation => {
    this.setState({currentLocation})
  };

  save = () => {
    const { values } = this.formApi.getState();
    values.location = cloneDeep(this.state.currentLocation)
    const { backPath } = this.props;
    saveRecord.call(this, create, backPath, values);
  };

  renderHeader () {
    const { backPath } = this.props;

    return (<Row className="p-4">
      <Col md={2}>
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
        </Link>
        Create new agency
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button
          size="md"
          status="success"
          className="px-5 py-2 mb-4 float-right"
          onClick={this.save}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </Col>
    );
  }

  renderFields () {
    const { officers, managers, townManagers } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, managers, townManagers, this.renderLocationModal.bind(this)), 2, 6, {...fieldProps, errors: this.state.errors});
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
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={exampleData()}>
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
        startFetching(dropdownsSearch('admins_by_role-officer'))
          .then(response => this.setDropdowns('officers', response.data)),
        startFetching(dropdownsSearch('admins_by_role-manager'))
          .then(response => this.setDropdowns('managers', response.data)),
    ])
      .finally(() =>  this.setState({ isDropdownFetching: false }))
  }

  render () {
    return this.isFetching() ? <Loader/> : (
      <React.Fragment>
        {this.renderRecord()}
      </React.Fragment>
    );
  }
}

function mapDispatch (dispatch) {
  return {...bindActionCreators({ setRecord: invoke(SET_RECORD), setListElement: invoke(SET_LIST_ELEMENT) }, dispatch)};
}

const fieldProps = { lSize: 6 };

New.propTypes = {
  backPath: PropTypes.string.isRequired
};

export default connect(
  null,
  mapDispatch
)(withFetching(New));
