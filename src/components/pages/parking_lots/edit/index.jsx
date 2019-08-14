import React from 'react';
import { fields } from 'components/helpers/fields/parking_lots';
import { SET_RECORD } from 'actions/parking_lots';
import { show, update } from 'api/parking_lots';
import { btnSpinner } from 'components/helpers';
import { Button, Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { Form } from 'informed';
import connectRecord from 'components/modules/connect_record';
import { NavLink } from 'react-router-dom';
import updateRecord from 'components/modules/form_actions/update_record';
import { renderFieldsWithGrid, renderField } from 'components/base/forms/common_form';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import SettingEdit from '../settings/edit';
import { fromJson as showErrors } from 'components/helpers/errors';
import resourceFetcher from 'components/modules/resource_fetcher';
import waitUntilFetched from 'components/modules/wait_until_fetched';

class Edit extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {
      parkingAdmins: [],
      townManagers: []
    }
  };

  save = () => {
    const { values } = this.formApi.getState();
    const { values: settingValues } = this.settingFormApi.getState();
    values.setting = settingValues;
    updateRecord.bind(this, update, '/dashboard/parking_lots')(values);
  };

  renderFields() {
    const { dropdowns } = this.state;
    return renderFieldsWithGrid(fields(dropdowns.townManagers, dropdowns.parkingAdmins), 2, 6, fieldProps)
  }

  values() {
    const { record } = this.props;
    let values = Object.assign({}, record);

    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    values.parking_admin_id = record.parking_admin ? record.parking_admin.id : null;
    return values;
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
          <NavLink to={`${match.url}/rules`} className="nav-link">Parking Rules</NavLink>
          <NavLink to={`${match.url}/spaces`} className="nav-link">Parking Spaces</NavLink>
        </Nav>
      </Col>
    </Row>);
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setSettingFormApi = formApi => {
    this.settingFormApi = formApi
  };

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

  renderSetting() {
    const { record } = this.props;
    return <SettingEdit setFormApi={this.setSettingFormApi} record={record.setting} />
  }

  handleFailed(error) {
    console.log(error)
  }

  componentDidMount () {
    waitUntilFetched.call(this,
      searchAdminByRoleName(['parking_admin', 'town_manager'])
        .then((result) => {
          this.setState({
            dropdowns: {
              parkingAdmins: result.parking_admin,
              townManagers: result.town_manager
            }
          })
        })
        .catch(this.handleFailed)
    );
  }
  render() {
    return this.props.isFetching ? <div>Loading data...</div> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-1"/>
        {this.renderSetting()}
      </React.Fragment>
    );
  }
}

const fieldProps = { lSize: 6 };

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), Edit);
