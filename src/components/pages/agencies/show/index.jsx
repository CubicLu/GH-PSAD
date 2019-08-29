import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row, Table, Collapse } from 'reactstrap';
import { Form } from 'informed';
import { generatePath } from 'react-router';
import { isEmpty } from 'underscore';
import LocationEdit from '../location/edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

/* Actions */
import { SET_RECORD } from 'actions/agencies';
/* API */
import { show, update } from 'api/agencies';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Ticket from 'components/base/agencies/tickets';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { fields } from 'components/helpers/fields/agencies';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { fromJson as showErrors } from 'components/helpers/errors';
import { FieldType } from 'components/helpers/form_fields';
import { fields as fieldsLocation } from 'components/helpers/fields/agencies/location';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import setFormApiFields from 'components/modules/set_form_api_fields';

class Show extends React.Component {
  state = {
    isSaving: false,
    collapse: false,
    inputChanged: false,
    dropdowns: {}
  }

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChangeMutipleSelect: () => this.setState({ inputChanged: true }),
      onChangeFile: () => this.setState({ inputChanged: true }),
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  isFetching = () => {
    const { isResourceFetching } = this.props
    const { dropdowns } = this.state
    return isResourceFetching || isEmpty(dropdowns)
  }

  openCollapsable (attribute) {
    this.setState((state) => ({
      [attribute]: !state[attribute]
    }));
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setLocationFormApi = formApi => {
    this.locationFormApi = formApi;
  };

  save = () => {
    const values = setFormApiFields(fields([], [], []), this.formApi);
    values.avatar = this.formApi.getValue('avatar');
    values.location = {};
    values.location = setFormApiFields(fieldsLocation(), this.locationFormApi);
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

    return (<Row>
      <Col md={2} className="align-self-center">
        <Link to={backPath} className="mr-2 back-button" >
          <FontAwesomeIcon icon={faChevronLeft}/>
        </Link>
        {record.name}
      </Col>
      <Col md={10}>
        <Nav pills className="float-right">
          ID: {record.id}
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

  renderFields () {
    const { officers, managers, townManagers } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, managers, townManagers), 2, 6, this.fieldProps());
  }

  renderLocation () {
    const { record } = this.props;
    return <LocationEdit setFormApi={this.setLocationFormApi} record={record} />;
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
    searchAdminByRoleName(['manager', 'officer', 'town_manager'])
      .then((result) => {
        this.setState({
          dropdowns: {
            officers: result.officer,
            managers: result.manager,
            townManagers: result.town_manager
          }
        });
      })
      .catch(this.handleFailed)
  }

  render () {
    const { record, match } = this.props;
    const ticketURL = `${match.url}/tickets`;
    return this.isFetching() ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1"/>
        {this.renderLocation()}
      </React.Fragment>
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

export default connectRecord('agency', SET_RECORD, resourceFetcher(show), Show);
