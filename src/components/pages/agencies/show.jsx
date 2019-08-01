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
import ShowForm from 'components/base/show_form';
import { showFields } from 'components/helpers/fields/agencies';

class Show extends React.Component {
  state = {
    collapse: false
  }

  openCollapsable (attribute) {
    this.setState((state) => ({
      [attribute]: !state[attribute]
    }));
  }

  renderRecord () {
    const { record, backPath, match } = this.props;
    const ticketURL = `${match.url}/tickets`
    return (
      <React.Fragment>
        <Card>
          <CardHeader>{record.name}</CardHeader>
          <CardBody>
            <ShowForm
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
            (<Link to={ticketURL}>See All</Link>)
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
                record.parkingTickets.map(parkingTicket => (
                  <Ticket
                    key={parkingTicket.id}
                    parkingTicket={parkingTicket}
                    url={ticketURL}
                  />
                ))
              }
            </tbody>
          </Table>
        </Collapse>
      </React.Fragment>
    );
  }

  render () {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('agency', SET_RECORD, resourceFetcher(show), Show);
