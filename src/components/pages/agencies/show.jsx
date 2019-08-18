import React from 'react';
import PropTypes from 'prop-types';
import { show, update } from 'api/agencies';
import { fields } from 'components/helpers/fields/agencies';
import { SET_RECORD } from 'actions/agencies';
import { btnSpinner } from 'components/helpers';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row, Table, Collapse } from 'reactstrap';
import { Form } from 'informed';
import connectRecord from 'components/modules/connect_record';
import { Link } from 'react-router-dom';
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
import Ticket from 'components/base/agencies/tickets';
import { isEmpty } from 'underscore';

class Show extends React.Component {
  state = {
    isSaving: false,
    collapse: false,
    dropdowns: {}
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
    let values = setFormApiFields(fields([], [], []), this.formApi)
    values.avatar = this.formApi.getValue('avatar')
    values.location = {}
    values.location = setFormApiFields(fieldsLocation(), this.locationFormApi)
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.bind(this, update, path)(values);
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.manager_id = record.manager ? record.manager.id : null;
    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    values.officer_ids = record.officers ? record.officers.map(officer => officer.id  ) : null;
    return values;
  };

  renderHeader () {
    const { backPath, record } = this.props;

    return (<Row>
      <Col md={2} className="align-self-center">
        <Link to={backPath} className="mr-2 back-button" >&#10094;</Link>
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
    )
  }

  renderFields () {
    const { officers, managers, townManagers } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, managers, townManagers), 2, 6, fieldProps);
  }

  renderLocation () {
    const { record } = this.props;
    return <LocationEdit setFormApi={this.setLocationFormApi} record={record} />;
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
    waitUntilFetched.call(this,
      searchAdminByRoleName(['manager', 'officer', 'town_manager'])
        .then((result) => {
          this.setState({
            dropdowns: {
              officers: result.officer,
              managers: result.manager,
              townManagers: result.town_manager
            }
          })
        })
        .catch(this.handleFailed)
    );
  }

  render () {

    const { isFetching, record, match } = this.props;
    const ticketURL = `${match.url}/tickets`;
    return isFetching || !record || isEmpty(this.state.dropdowns) ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1"/>
        {this.renderLocation()}
        <Card className="mt-5" onClick={() => this.openCollapsable('collapse')}>
          <CardHeader>
            Ticket Assignment ({record.parking_tickets_total})
            <span dangerouslySetInnerHTML={{ __html: this.state.collapse ? '&#9650;' : '&#9660;' }}></span>
          </CardHeader>
        </Card>

        <Collapse isOpen={this.state.collapse}>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Violation Name</th>
                <th>Parking Lot Name</th>
                <th>Date Commited</th>
                <th>Officer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                record.parking_tickets.map(parkingTicket => (
                  <Ticket
                    key={parkingTicket.id}
                    parkingTicket={parkingTicket}
                    url={ticketURL}
                  />
                ))
              }
            </tbody>
          </Table>
          <div className="text-center">
            { record.parking_tickets_total - record.parking_tickets.length > 0 && <Link to={ticketURL}>View more ({record.parking_tickets_total - record.parking_tickets.length}) &#9660;</Link>}
          </div>
        </Collapse>
      </React.Fragment>
    );
  }
}

const fieldProps = { lSize: 6 };

Show.propTypes = {
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

export default connectRecord('agency', SET_RECORD, resourceFetcher(show), Show);
