import React from 'react';
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
/* Actions */
import { SET_RECORD } from 'actions/tickets';
/* API */
import { show } from 'api/parking/tickets';
/* Base */
import { ShowForm } from 'components/base/forms';
/* Helpers */
import { showFields } from 'components/helpers/fields/tickets';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';

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
