import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { create } from 'api/agencies';
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/agencies';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { fields, exampleData, exampleLocationData } from 'components/helpers/fields/agencies';
import { fromJson as showErrors } from 'components/helpers/errors';
import { CommonForm } from 'components/base/forms';
import saveRecord from 'components/modules/form_actions/save_record';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import { btnSpinner } from 'components/helpers';
import { NavLink, Link } from 'react-router-dom';
import { Form } from 'informed';
import withFetching from 'components/modules/with_fetching';
import LocationNew from './location/new'
import { FieldType } from 'components/helpers/form_fields';
import { isEmpty } from 'underscore';

class New extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {}
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setLocationFormApi = formApi => {
    this.locationFormApi = formApi;
  };


  save = () => {
    const { values } = this.formApi.getState();
    values.location = this.locationFormApi.getState().values;

    const { backPath } = this.props;
    saveRecord.call(this, create, backPath, values);
  };


  renderHeader () {
    const { backPath } = this.props;

    return (<Row>
      <Col md={2}>
        <Link to={backPath} className="mr-2 back-button" >&#10094;</Link>
        Create new agency
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
    return <LocationNew setFormApi={this.setLocationFormApi} record={{location: exampleLocationData()}} />;
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
        .then((result) => this.setState({
          dropdowns: {
            officers: result.officer,
            managers: result.manager,
            townManagers: result.town_manager }
        })
        )
        .catch(this.handleFailed)
    );
  }

  render () {
    return this.props.isFetching || isEmpty(this.state.dropdowns) ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1"/>
        {this.renderLocation()}
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
