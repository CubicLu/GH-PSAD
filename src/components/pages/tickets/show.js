import React from 'react';
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import { show } from 'api/parking/tickets';
import { SET_RECORD } from 'actions/agencies/tickets';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import ShowForm from 'components/base/show_form';
import { showFields } from 'components/helpers/fields/agencies/tickets';

class Show extends React.Component {

  renderRecord() {
    const { record, backPath, match } = this.props;

    return (
      <React.Fragment>
        <Card>
          <CardHeader>Ticket #{record.id}</CardHeader>
          <CardBody>
            <ShowForm
              fields={showFields()}
              values={record}
              backPath={backPath}
              editURL={match.url}
            />
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('ticket', SET_RECORD, resourceFetcher(show), Show);
