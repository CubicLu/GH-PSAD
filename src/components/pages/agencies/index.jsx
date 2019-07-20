import React from 'react';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/agencies';
import { index } from 'api/agencies';
import { Col, Row, Table } from 'reactstrap';
import connectList from 'components/modules/connect_list';
import Pagination from 'components/base/pagination';
import BasicListToolbar from 'components/base/basic_list_toolbar';
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
    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}`}>{record.name}</Link></td>
          <td>{record.id}</td>
          <td>{record.location.full_address}</td>
          <td>{record.email}</td>
          <td>{record.phone}</td>
          <td>{record.manager.name}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <BasicListToolbar {...this.props} fetcher={index} label="Create Agency"/>
          </Col>
          <Col xs="12">
            <Table>
              <thead>
              <tr>
                <th>Agency Name</th>
                <th>Agency ID</th>
                <th>Location</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Enforcement Manager</th>
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

export default connectList('agency', SET_LIST, resourceFetcher(index), Index);
