import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { generatePath } from 'react-router';
import { update, statuses, show } from 'api/parking/tickets';
import { fields } from 'components/helpers/fields/tickets';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/tickets';
import { CommonForm } from 'components/base/forms';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import { fromJson as showErrors } from 'components/helpers/errors';
import { renderFieldsWithGrid, renderField } from 'components/base/forms/common_form';
import { btnSpinner, displayUnixTimestamp } from 'components/helpers';
import { NavLink, Link } from 'react-router-dom';
import { Form } from 'informed';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isSaving: false,
      dropdowns: {}
    };
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
    )
  }

  renderFields () {
    const { officers, statuses } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, statuses), 2, 6, fieldProps);
  }

   values = () => {
     const { record } = this.props;
     const values = Object.assign({}, record);
     values.admin_id = record.officer ? record.officer.id : null;

     return values;
   };

   renderHeader () {
     const { backPath, record } = this.props;
     const { isSaving } = this.state;
    const backPathWithId = generatePath(backPath, { id: record.id })

     return (<Row>
       <Col md={2}>
        <Link to={backPathWithId} className="mr-2 back-button" >&#10094;</Link>

        {record.type} #{record.id}
       </Col>
       <Col md={2} className="align-self-center">
        Edit {record.agency.name} Ticket number {record.id}
       </Col>
       <Col md={8}>
         <Nav pills className="float-right">

            <span class="mr-2 text-muted">Updated: {displayUnixTimestamp(record.updated_at)}</span>

            ID: {record.id}
         </Nav>
       </Col>
     </Row>);
   }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  renderForm () {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <React.Fragment>
            {this.renderFields()}
            {this.renderSaveButton()}
          </React.Fragment>
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
      searchAdminByRoleName(['officer'])
        .then((data) => {
          this.setState({
            dropdowns: {
              ...this.state.dropdowns,
              officers: data.officer
            }
          });
        })
        .catch(this.handleFailed),
      statuses()
        .then(({ data }) => {
          this.setState({
            dropdowns: {
              ...this.state.dropdowns,
              statuses: data.statuses
            }
          });
        })
        .catch(this.handleFailed)
    );
  }

  render () {
    const { officers, statuses } = this.state.dropdowns
    return this.props.isFetching || !officers || !statuses ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
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
    officer: PropTypes.object
  })
};

export default connectRecord('ticket', SET_RECORD, resourceFetcher(show), Edit);
