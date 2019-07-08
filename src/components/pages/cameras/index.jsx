import React from 'react';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/cameras';
import { index } from 'api/cameras';
import { displayUnixTimestamp } from 'components/helpers';
import { Col, Row, Table } from 'reactstrap';
import connectList from 'components/modules/connect_list';
import Pagination from 'components/base/pagination';
import BasicListToolbar from 'components/base/basic_list_toolbar';

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
          <td>{record.stream}</td>
          <td>{displayUnixTimestamp(record.created_at)}</td>
          <td>{displayUnixTimestamp(record.updated_at)}</td>
          <td>{record.parking_lot ? record.parking_lot.id : null}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <BasicListToolbar {...this.props} fetcher={index} label="Create Camera"/>
          </Col>
          <Col xs="12">
            <Table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Stream</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Parking Lot</th>
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

export default connectList('camera', SET_LIST, index, Index);
