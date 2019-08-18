import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { create } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/admins';
import { fields, exampleData } from 'components/helpers/fields/admins';
import { fromJson as showErrors } from 'components/helpers/errors';
import saveRecord from 'components/modules/form_actions/save_record';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import withFetching from 'components/modules/with_fetching';
import { renderFieldsWithGrid, renderImageField} from 'components/base/forms/common_form';
import { btnSpinner } from 'components/helpers';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import { FieldType } from 'components/helpers/form_fields';

class New extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {
      roles: []
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  save = () => {
    const { values } = this.formApi.getState();
    const { backPath } = this.props;
    saveRecord.call(this, create, backPath, values);
  };

  renderFields () {
    const { roles } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(roles), 2, 6, fieldProps);
  }

  renderHeader () {
    const { backPath } = this.props;

    return (<Row>
      <Col md={2}>
        <Link to={backPath} className="mr-2 back-button" >&#10094;</Link>
        Create user account
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
            { this.renderSaveButton()}
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
      dropdownsSearch('role_id', { admin_id: 1 })
        .then(response => this.setState({ dropdowns: { roles: response.data } }))
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

function mapDispatch (dispatch) {
  return bindActionCreators({ setRecord: invoke(SET_RECORD) }, dispatch);
}

const fieldProps = { lSize: 6 };

export default connect(
  null,
  mapDispatch
)(withFetching(New, () => {}));
