import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { show } from 'api/cameras';
import { SET_RECORD } from 'actions/cameras';
import { displayUnixTimestamp } from 'components/helpers';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import ShowForm from 'components/base/show_form';
import { showFields } from 'components/helpers/fields/cameras';

class Show extends React.Component {
  values = () => {
    const { record } = this.props;
    return Object.assign({}, record, {
      created_at: displayUnixTimestamp(record.created_at),
      updated_at: displayUnixTimestamp(record.updated_at)
    });
  };

  renderRecord () {
    const { record, backPath, match } = this.props;

    return (<Card>
      <CardHeader>{record.name}</CardHeader>
      <CardBody>
        <ShowForm
          fields={showFields()}
          values={this.values()}
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

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Show);
