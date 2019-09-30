import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import { isEmpty } from 'underscore';
import LocationForm from '../location/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash'
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/agencies';
/* API */
import { create } from 'api/agencies';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { fields, exampleData } from 'components/helpers/fields/agencies';
import { exampleData as exampleLocationData } from 'components/helpers/fields/agencies/location';
import { fromJson as showErrors } from 'components/helpers/errors';
import { FieldType } from 'components/helpers/form_fields';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withFetching from 'components/modules/with_fetching';

class New extends React.Component {
  state = {
    isSaving: false,
    modal: false,
    dropdowns: {},
    currentLocation: exampleLocationData()
  }

  isFetching = () => {
    const { dropdowns } = this.state
    return isEmpty(dropdowns)
  }

  isFetching = () => {
    const { dropdowns } = this.state
    return isEmpty(dropdowns)
  }

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

    return (<Row>
      <Col md={2}>
        <Link to={backPath} className="mr-2 back-button" >
          <FontAwesomeIcon icon={faChevronLeft}/>
        </Link>
        Create new agency
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

  renderFields () {
    const { officers, managers, townManagers } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, managers, townManagers, this.renderLocationModal.bind(this)), 2, 6, fieldProps);
  }

  renderLocationModal (field, props) {
    return (
      <LocationForm
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

  componentDidMount () {
    const { startFetching } = this.props

    startFetching(searchAdminByRoleName(['manager', 'officer', 'town_manager']))
      .then((result) => this.setState({
        dropdowns: {
          officers: result.officer,
          managers: result.manager,
          townManagers: result.town_manager }
      }))
      .catch(this.handleFailed)

  }

  render () {
    return this.isFetching() ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
      </React.Fragment>
    );
  }
}

function mapDispatch (dispatch) {
  return bindActionCreators({ setRecord: invoke(SET_RECORD) }, dispatch);
}

const fieldProps = { lSize: 6 };

New.propTypes = {
  backPath: PropTypes.string.isRequired
};

export default connect(
  null,
  mapDispatch
)(withFetching(New));
