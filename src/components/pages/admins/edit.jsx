import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/admins';
import { fields } from 'components/helpers/fields/admins';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/admins';
import CommonForm from 'components/base/common_form';
import { search as dropdowns_search } from 'api/dropdowns';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      roles: []
    }
  }

  componentDidMount() {
    waitUntilFetched.call(this,
      dropdowns_search('role_id')
        .then(response => {
          this.setState({roles: response.data});
        })
    )
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { record } = nextProps;
    if (record) this.setState(record);
  }


  values = () => {
    const { record } = this.props;
    return Object.assign({}, record, {
      role_id: record.role.id
    })
  };

  renderRecord() {
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id })
    return (
      <Card>
        <CardHeader>Edit Admin</CardHeader>
        <CardBody>
          <CommonForm
            {...this.props}
            backPath={path}
            values={this.values()}
            fields={fields(this.state.roles)}
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

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), Edit);
