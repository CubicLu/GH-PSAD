import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/cameras';
/* API */
import { create } from 'api/cameras';
/* Base */
import { renderFieldsWithGridStream } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { filedsStream, exampleData, streamHeading } from 'components/helpers/fields/cameras';
import Loader from 'components/helpers/loader';
import { fromJson as showErrors } from 'components/helpers/errors';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import './addstream.sass'

class New extends React.Component {
  state = {
    isSaving: false
  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    console.log(this.props);
    return isResourceFetching
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  save = () => {
    const { values } = this.formApi.getState();
    const { backPath } = this.props;
    saveRecord.call(this, create, backPath, values);
  };

  renderFields() {
    //                         (fields, step, cols, props = {})
    return renderFieldsWithGridStream(filedsStream(), 1, 6, fieldProps, streamHeading());
  }

  renderForm() {
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={exampleData()}>
          <React.Fragment>
            {this.renderFields()}
          </React.Fragment>
        </Form>
      </fieldset>
    );
  }

  renderHeader() {
    const { isSaving } = this.state;

    return (<Row>
      <Col md={2}>
        <Button color="success" outline onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save'}
        </Button>
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

  render() {
    return this.isFetching() ? <Loader /> : (
      <React.Fragment>
        {this.renderRecord()}
      </React.Fragment>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setRecord: invoke(SET_RECORD) }, dispatch);
}

const fieldProps = { lSize: 2 };

New.propTypes = {
  backPath: PropTypes.string.isRequired,
  isResourceFetching: PropTypes.bool.isRequired
};

export default connect(
  null,
  mapDispatch
)(New);
