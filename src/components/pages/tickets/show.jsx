import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row, FormGroup, Label, Table } from 'reactstrap';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
/* Actions */
import { SET_RECORD } from 'actions/tickets';
/* API */
import { update, show } from 'api/parking/tickets';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner, displayUnixTimestamp } from 'components/helpers';
import { fields } from 'components/helpers/fields/tickets';
import { fromJson as showErrors } from 'components/helpers/errors';
import { FieldType } from 'components/helpers/form_fields';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import setFormApiFields from 'components/modules/set_form_api_fields';

class Show extends React.Component {
  state = {
    isSaving: false,
    inputChanged: false,
    officersFetched: false,
    dropdowns: {}
  }

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { officers, statuses } = this.state.dropdowns;
    return isResourceFetching || !officers || !statuses
  }

  save = () => {
    const { officers, statuses } = this.state.dropdowns;
    const values = setFormApiFields(fields(officers, statuses), this.formApi);
    values.admin_id = values.admin_id > 0 ? values.admin_id : null
    values.photo_resolution = this.formApi.getValue('photo_resolution');

    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.bind(this, update, path)(values);
  };

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
    const { officers, statuses } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, statuses), 2, 6, this.fieldProps());
  }

   values = () => {
     const { record } = this.props;
     const values = Object.assign({}, record);
     values.admin_id = record.officer ? record.officer.id : '0';
     return values;
   };

   renderHeader () {
     const { backPath, record } = this.props;
     const backPathWithId = generatePath(backPath, { id: record.id });
     return (<Row>
       <Col md={2}>
         <Link to={backPathWithId} className="mr-2 back-button" >
           <FontAwesomeIcon icon={faChevronLeft}/>
         </Link>
         {record.type}
       </Col>
       <Col md={10}>
         <Nav pills className="float-right">
            ID: {record.id}
         </Nav>
       </Col>
     </Row>);
   }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  renderUpdatedTable = () => {
    const { record } = this.props
    return (
      <Row>
        <Col xs="12">
          <Table className="index-table">
            <thead className="bg-dark text-white">
              <tr>
                <td>Type of change</td>
                <td>Old Value</td>
                <td>New Value</td>
                <td>Performed by</td>
                <td>Date Occurred</td>
                <td>Remark</td>
              </tr>
            </thead>
            <tbody>
              {
                record.updated_trail.map(element => (
                  <tr>
                    <td>
                      {element.type_of_change}
                    </td>
                    <td>
                      {element.old_value}
                    </td>
                    <td>
                      {element.new_value}
                    </td>
                    <td>
                      {element.performed_by}
                    </td>
                    <td>
                      {displayUnixTimestamp(element.updated_at)}
                    </td>
                    <td>
                      {element.remark}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    )
  }

  renderForm () {
    const { record } = this.props
    const { isSaving, inputChanged } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'photo_resolution', label: '', type: FieldType.FILE_FIELD }, this.fieldProps())}
            </Col>
            <Col sm={12} md={9}>
              <FormGroup row>
                <Label for='updated_at' md={8}>Last Update: {displayUnixTimestamp(record.updated_at)}</Label>
              </FormGroup>
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

  setDropdowns = (key, data) => this.setState({dropdowns: {...this.state.dropdowns, [key]: data}})

  componentWillReceiveProps(nextProps, nextContext) {
    const { officersFetched } = this.state
    if (nextProps.record && !officersFetched) {
      this.setState({officersFetched: true})
      dropdownsSearch('agency_officers_list', { agency_id: nextProps.record.agency.id })
        .then((response) => this.setDropdowns('officers', response.data))
        .catch(this.handleFailed);
    }
  }

  componentDidMount () {
    dropdownsSearch('tickets_statuses_field')
      .then(response => this.setDropdowns('statuses', response.data))
      .catch(this.handleFailed)
  }

  render () {
    return this.isFetching() ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-4"/>
        {this.renderUpdatedTable()}
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
    officer: PropTypes.object,
    type: PropTypes.string.isRequired,
    agency: PropTypes.object,
    updated_at: PropTypes.number
  })
};

export default connectRecord('ticket', SET_RECORD, resourceFetcher(show), Show);
