import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/cameras';
import { fields } from 'components/helpers/fields/cameras';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/cameras';
import updateRecord from 'components/modules/form_actions/update_record';
import { fromJson as showErrors } from 'components/helpers/errors';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import { Form } from 'informed';
import { btnSpinner } from 'components/helpers';
import { NavLink } from 'react-router-dom';

class Edit extends React.Component {
  state = {
    isSaving: false
  };

  save = () => {
    const { values } = this.formApi.getState();

    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });

    updateRecord.bind(this, update, path)(values);
  };

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.parking_lot_id = record.parking_lot ? record.parking_lot.id : null;
    return values;
  };

  renderFields() {
    return renderFieldsWithGrid(fields(), 2, 6, fieldProps)
  }

  renderForm() {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <React.Fragment>
            {this.renderFields()}
          </React.Fragment>
        </Form>
      </fieldset>
    );
  }

 renderHeader() {
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


  renderRecord() {
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

  render () {
    return this.props.isFetching ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
      </React.Fragment>
    );
  }
}

const fieldProps = { lSize: 6 };

Edit.propTypes = {
  backPath: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parking_lot: PropTypes.object.isRequired
  })
};

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Edit);
