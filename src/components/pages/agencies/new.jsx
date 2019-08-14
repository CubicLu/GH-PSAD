import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { create } from 'api/agencies';
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/agencies';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { fields, exampleData } from 'components/helpers/fields/agencies';
import { fromJson as showErrors } from 'components/helpers/errors';
import { CommonForm } from 'components/base/forms';
import saveRecord from 'components/modules/form_actions/save_record';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import { btnSpinner } from 'components/helpers';
import { NavLink } from 'react-router-dom';
import { Form } from 'informed';
import withFetching from 'components/modules/with_fetching';

class New extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {
      townManagers: [],
      managers: [],
      officers: []
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  save = () => {
    const { values } = this.formApi.getState();
    const { backPath } = this.props;
    saveRecord.call(this, create, backPath, values)
  };

  renderFields() {
    const { officers, managers, townManagers } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, managers, townManagers), 2, 6, fieldProps)
  }


  renderHeader() {
    const { match } = this.props;
    const { isSaving } = this.state;

    return (<Row>
      <Col md={2}>
        <Button color="success" outline onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save'}
        </Button>
      </Col>
      <Col md={8}>
        <Nav pills className="float-right">
          <NavLink to={match.url} className="nav-link">Information</NavLink>
        </Nav>
      </Col>
    </Row>);
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

  componentDidMount () {
    waitUntilFetched.call(this,
      searchAdminByRoleName(['manager', 'officer', 'town_manager'])
        .then((result) => this.setState({
          dropdowns: {
            managers: result.manager,
            officers: result.officer,
            townManagers: result.town_manager }
          })
        )
        .catch(this.handleFailed)
    );
  }

  render() {
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
)(withFetching(New, ()=>{}));
