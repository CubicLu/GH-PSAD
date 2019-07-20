import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { show } from 'api/agencies';
import { SET_RECORD } from 'actions/agencies';
import Ticket from 'components/base/agencies/tickets';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import CommonShowForm from 'components/base/common_form/show';
import { showFields } from 'components/helpers/fields/agencies';

class Show extends React.Component {

  state = {
    collapse: false
  }

  openCollapsable(attribute) {
    this.setState((state) => ({
      [attribute]: !state[attribute]
    }))
  }

  renderRecord() {
    const { record, backPath, match } = this.props;
    return (
      <React.Fragment>
        <Card>
          <CardHeader>{record.name}</CardHeader>
          <CardBody>
            <CommonShowForm
              fields={showFields()}
              values={record}
              backPath={backPath}
              editURL={match.url}
            />
          </CardBody>
        </Card>
        <Card className="mt-5" onClick={() => this.openCollapsable('collapse')}>
          <CardHeader>
            Ticket Assignment ({record.parking_tickets_total})
            <span dangerouslySetInnerHTML={{__html: this.state.collapse ? '&#9650;' : '&#9660;'}}></span>
            (<Link to={`/dashboard/agencies/${record.id}/tickets/`}>See All</Link>)
          </CardHeader>
        </Card>

        <Collapse isOpen={this.state.collapse}>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Officer</th>
                <th>Parking Lot</th>
                <th>Status</th>
                <th>Type</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                record.parking_tickets.map(parking_ticket => (
                  <Ticket
                    key={parking_ticket.id}
                    parking_ticket={parking_ticket}
                    agency_id={record.id}
                  />
                ))
              }
            </tbody>
          </Table>
        </Collapse>
      </React.Fragment>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('agency', SET_RECORD, resourceFetcher(show), Show);
