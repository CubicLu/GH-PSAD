import React from 'react';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/admins';
import { index } from 'api/admins';
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
import { filterFields } from 'components/helpers/fields/admins';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import { search as dropdownsSearch } from 'api/dropdowns';
import { search } from 'api/admins';

class Index extends React.Component {
  state = {
    filterRolesField: [],
  }

  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}`}>{record.username}</Link></td>
          <td>{record.name}</td>
          <td>{record.email}</td>
          <td>{record.role.name}</td>
          <td>
            <span className={`btn btn-${record.status === 'active' ? 'success' : 'warning'}`}>
              {record.status}
            </span>
          </td>
        </tr>
      );
    });
  };

  filterFetcher = (values) => (
    search({
      role_names: values.role_names,
      status: values.status,
      'query[email]': values.email,
      'query[username]': values.username,
      'query[name]': values.name
    })
  )


  componentDidMount () {
    waitUntilFetched.call(this,
      dropdownsSearch('role_names_filter')
        .then(response => this.setState({ filterRolesField: response.data }))
    );
  }


  render () {
    return (
      <IndexTable
        {...this.props}
        fetcher={index}
        toolbar={
          <BasicListToolbar
            {...this.props}
            fetcher={index}
            label="Create Admin"
          />
        }
        filterFields={filterFields(this.state.filterRolesField)}
        filterFetcher={this.filterFetcher}
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
