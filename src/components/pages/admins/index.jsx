import React from 'react';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/admins';
import { index } from 'api/admins';
import { Col, Row, Table } from 'reactstrap';
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
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
          <td><Link to={`${match.path}/${record.id}`}>{record.username}</Link></td>
          <td>{record.name}</td>
          <td>{record.email}</td>
          <td>{record.role.name}</td>
          <td>
            <span className={`btn btn-${record.status === 'active' ? 'success' : 'danger'}`}>
            {record.status}
            </span>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <BasicListToolbar {...this.props} fetcher={index} label="Create Admin"/>
          </Col>
          <Col xs="12">
            <Table>
              <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
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

export default connectList('admin', SET_LIST, resourceFetcher(index), Index);
