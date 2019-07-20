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
import CommonShowForm from 'components/base/common_form/show';
import { showFields } from 'components/helpers/fields/agencies/tickets';
import { generatePath } from 'react-router';

class Show extends React.Component {

  willReturnTo (backPath, agency_id) {
    const params = new URLSearchParams( this.props.location.search)
    return params.get('index') ? backPath :  `/dashboard/agencies/:agency_id`
  }

  renderRecord() {
    const { record, backPath, match } = this.props;

    return (
      <React.Fragment>
        <Card>
          <CardHeader>Ticket #{record.id}</CardHeader>
          <CardBody>
            <CommonShowForm
              fields={showFields()}
              values={record}
              backPath={generatePath(this.willReturnTo(backPath), {agency_id: match.params.agency_id})}
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
