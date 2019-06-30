import React from 'react';
import { Link } from 'react-router-dom';
import { setList } from 'actions/parking_lots';
import { index } from 'api/parking_lots';
import { displayUnixTimestamp } from 'components/helpers';
import { Col, Row, Table } from 'reactstrap';
import connectList from 'components/modules/connect_list';
import { SET_LIST } from 'actions/parking_lots';
import BasicListToolbar from 'components/base/basic_list_toolbar';
import Pagination from 'components/base/pagination';

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

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}`}>{record.name}</Link></td>
          <td>{record.id}</td>
          <td>{record.address}</td>
          <td>{record.email}</td>
          <td>{record.phone}</td>
          <td>{record.parking_admin ? record.parking_admin.name : null}</td>
          <td>{record.parking_admin ? record.town_manager.name : null}</td>
          <td>{record.status}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <BasicListToolbar {...this.props} fetcher={index} label="Create Parking Lot"/>
          </Col>
          <Col xs="12">
            <Table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Lot ID</th>
                <th>Location</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Parking Admin</th>
                <th>Town Manager</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              {this.renderRecords()}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Pagination {...this.props} fetcher={index}/>
      </React.Fragment>
    );
  }
}

export default connectList('parking_lot', SET_LIST, index, Index);
