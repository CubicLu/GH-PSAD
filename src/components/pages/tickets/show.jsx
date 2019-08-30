import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row, FormGroup, Label } from 'reactstrap';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
/* Actions */
import { SET_RECORD } from 'actions/tickets';
/* API */
import { update, statuses, show } from 'api/parking/tickets';
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

class Show extends React.Component {
  state = {
    isSaving: false,
    inputChanged: false,
    dropdowns: {}
  }

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChangeFile: () => this.setState({ inputChanged: true }),
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { officers, statuses } = this.state.dropdowns;
    return isResourceFetching || !officers || !statuses
  }

  save = () => {
    const { values } = this.formApi.getState();
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
     values.admin_id = record.officer ? record.officer.id : null;
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

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.record) {
      dropdownsSearch('agency_officers_list', { agency_id: nextProps.record.agency.id })
        .then((res) => {
          this.setState({
            dropdowns: {
              ...this.state.dropdowns,
              officers: res.data
            }
          });
        })
        .catch(this.handleFailed);
    }
  }

  componentDidMount () {
    statuses()
      .then(({ data }) => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            statuses: data.statuses
          }
        });
      })
      .catch(this.handleFailed);
  }

  render () {
    return this.isFetching() ? <div>Loading data...</div> : this.renderRecord();
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
