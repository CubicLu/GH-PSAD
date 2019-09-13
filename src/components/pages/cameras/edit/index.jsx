import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { generatePath } from 'react-router';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD } from 'actions/cameras';
/* API */
import { show, update } from 'api/cameras';
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { fromJson as showErrors } from 'components/helpers/errors';
import { fields } from 'components/helpers/fields/cameras';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';

class Edit extends React.Component {
  state = {
    isSaving: false
  };

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

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

  renderFields () {
    return renderFieldsWithGrid(fields(), 2, 6, fieldProps);
  }

  renderForm () {
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

  renderHeader () {
    const { record } = this.props;
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
    </Row>);
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

  render () {
    return this.isFetching() ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
      </React.Fragment>
    );
  }
}

const fieldProps = { lSize: 6 };

Edit.propTypes = {
  backPath: PropTypes.string.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parking_lot: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
  })
};

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Edit);
