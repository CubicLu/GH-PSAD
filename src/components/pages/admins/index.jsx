import React from 'react';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/admins';
import { index } from 'api/admins';
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';

class Index extends React.Component {

  renderRecords = () => {
    const { list, match } = this.props;

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
      <IndexTable
        {...this.props}
        fetcher={index}
        toolbar={<BasicListToolbar {...this.props} fetcher={index} label="Create Admin"/>}
        columns={
          <React.Fragment>
            <th attr="username">Username</th>
            <th attr="name">Name</th>
            <th attr="email">Email</th>
            <th attr="roles.name">Role</th>
            <th attr="status">Status</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
      >
      </IndexTable>
    );
  }
}

export default connectList('admin', SET_LIST, resourceFetcher(index), Index);
