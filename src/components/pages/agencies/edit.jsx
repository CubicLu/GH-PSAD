import React from 'react';
import PropTypes from 'prop-types';
import { show, update } from 'api/agencies';
import { fields } from 'components/helpers/fields/agencies';
import { SET_RECORD } from 'actions/agencies';
import { btnSpinner } from 'components/helpers';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { Form } from 'informed';
import connectRecord from 'components/modules/connect_record';
import { NavLink } from 'react-router-dom';
import updateRecord from 'components/modules/form_actions/update_record';
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { fromJson as showErrors } from 'components/helpers/errors';
import resourceFetcher from 'components/modules/resource_fetcher';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import setFormApiFields from 'components/modules/set_form_api_fields';
import { generatePath } from 'react-router';
import { FieldType } from 'components/helpers/form_fields';
import LocationEdit from './location/edit'
import { fields as fieldsLocation } from 'components/helpers/fields/agencies/location';

class Edit extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {
      manager: [],
      townManager: [],
      officer: []
    }
  }

  save = () => {
    let values = setFormApiFields(fields([], [], []), this.formApi)
    values.location = {}
    values.location = setFormApiFields(fieldsLocation(), this.locationFormApi)
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.bind(this, update, path)(values);
  };

  renderFields () {
    const { officer, manager, townManager } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officer, manager, townManager), 2, 6, fieldProps);
  }

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.manager_id = record.manager ? record.manager.id : null;
    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    values.officer_ids = record.officers ? record.officers : null;
    return values;
  };

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success float-right" outline onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save Changes'}
        </Button>
      </Col>
    )
  }

  renderHeader () {
    const { match, record } = this.props;
    const { isSaving } = this.state;

    return (<Row>
      <Col md={2}>
        <Button color="success" outline onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save'}
        </Button>
      </Col>
      <Col md={2} className="align-self-center">
        Edit {record.name}
      </Col>
      <Col md={8}>
        <Nav pills className="float-right">
          <NavLink to={match.url} className="nav-link">Information</NavLink>
        </Nav>
      </Col>
    </Row>);
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setLocationFormApi = formApi => {
    this.locationFormApi = formApi;
  };

  renderLocation () {
    const { record } = this.props;
    return <LocationEdit setFormApi={this.setLocationFormApi} record={record.location} />;
  }

  renderForm () {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, fieldProps)}
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

  componentDidMount () {
    waitUntilFetched.call(this,
      searchAdminByRoleName(['manager', 'officer', 'town_manager'])
        .then((result) => this.setState({ dropdowns: { ...result, townManager: result.town_manager } }))
        .catch(this.handleFailed)
    );
  }

  render () {
    const { isFetching, record } = this.props

    return isFetching || !record ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1"/>
        {this.renderLocation()}
      </React.Fragment>
    );
  }
}

const fieldProps = { lSize: 6 };

Edit.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    town_manager: PropTypes.object,
    manager: PropTypes.object,
    officers: PropTypes.arrayOf(PropTypes.object)
  })
};

export default connectRecord('agency', SET_RECORD, resourceFetcher(show), Edit);
