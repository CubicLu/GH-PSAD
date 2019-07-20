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
          <td><Link to={`${match.path}/${record.id}`}>{record.email}</Link></td>
          <td>{record.username}</td>
          <td>{record.status}</td>
          <td>{record.name}</td>
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
                <th>Email</th>
                <th>Username</th>
                <th>Status</th>
                <th>Name</th>
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
