import React from 'react';
import { SET_LIST } from 'actions/agencies/tickets';
import { index } from 'api/parking/tickets';
import { Col, Row, Table } from 'reactstrap';
import connectList from 'components/modules/connect_list';
import Pagination from 'components/base/pagination';
import BasicBackListToolbar from 'components/base/basic_list_toolbar/back';
import Ticket from 'components/base/agencies/tickets';
import resourceFetcher from 'components/modules/resource_fetcher';

class Index extends React.Component {
  renderRecords = () => {
    const { list, match } = this.props;

    if (this.props.isFetching) {
      return (<tr>
        <td>
          Loading data...
        </td>
      </tr>);
    }
    return list.map((record, idx) => (
      <Ticket
        key={record.id}
        parking_ticket={record}
        url={match.url}
      />
    ));
  };

  render() {
    const { match, backPath} = this.props;
    const agency_id = match.params.agency_id
    const agency = this.props.list[0] && this.props.list[0].agency
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <BasicBackListToolbar {...this.props} label={`${agency && agency.name} Tickets`} link={backPath} fetcher={index}/>
          </Col>
          <Col xs="12">
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
                {this.renderRecords()}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Pagination {...this.props} query={{agency_id}} fetcher={index} />
      </React.Fragment>
    );
  }
}

export default connectList('ticket', SET_LIST, resourceFetcher(index), Index);
