import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/agencies';
import { fields } from 'components/helpers/fields/agencies';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/agencies';
import CommonForm from 'components/base/common_form';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      managers: [],
      town_managers: [],
      officers: []
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { record } = nextProps;
    if (record) this.setState(record);
  }

  values = () => {
    const { record } = this.props;
    let values = {}
    for (const [key, value] of Object.entries(record)) {

      switch (key) {
       case 'manager':
        values[`agency[manager_id]`] = value.id
        break;
       case 'officers':
        values[`agency[officer_ids]`] = value
        break;
      case 'town_manager':
        values[`agency[town_manager_id]`] = value.id
        break;
       default:
        values[`agency[${key}]`] = value
      }
    }

    for (const [key, value] of Object.entries(record.location)) {
      values[`agency[location][${key}]`] = value
    }
    return values;
  };

  componentDidMount () {
    waitUntilFetched.call(this,
      searchAdminByRoleName(['manager', 'officer', 'town_manager'])
        .then((result) => this.setState({...result}))
        .catch(this.handleFailed)
    )
  }

  renderRecord() {
    const { backPath, record, match } = this.props;
    const { officers, managers, town_managers} = this.state
    const path = generatePath(backPath, { id: record.id })

    return (
      <Card>
        <CardHeader>Edit Agencies</CardHeader>
        <CardBody>
          <CommonForm
            {...this.props}
            backPath={path}
            values={this.values()}
            fields={fields(officers, managers, town_managers)}
            isFetching={this.state.isFetching}
            submitForm={updateRecord.bind(this, update, path)}/>
        </CardBody>
      </Card>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('agency', SET_RECORD, resourceFetcher(show), Edit);
