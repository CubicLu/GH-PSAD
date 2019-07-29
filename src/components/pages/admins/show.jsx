import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { show } from 'api/admins';
import { SET_RECORD } from 'actions/admins';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import CommonShowForm from 'components/base/common_form/show';
import { showFields } from 'components/helpers/fields/admins';

class Show extends React.Component {
  renderRecord () {
    const { record, backPath, match } = this.props;
    return (<Card>
      <CardHeader>{record.email}</CardHeader>
      <CardBody>
        <CommonShowForm
          fields={showFields()}
          values={record}
          backPath={backPath}
          editURL={match.url}
        />
      </CardBody>
    </Card>);
  }

  render () {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), Show);
