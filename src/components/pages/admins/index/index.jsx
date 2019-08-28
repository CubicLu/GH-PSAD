import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
/* Actions */
import { SET_LIST } from 'actions/admins';
/* API */
import { filterFetcher } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/admins';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import waitUntilFetched from 'components/modules/wait_until_fetched';

class Index extends React.Component {
  state = {
    filterRolesField: []
  }

  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><img src={record.avatar || 'https://i.stack.imgur.com/34AD2.jpg'} className="rounded-circle" width="50" height="50"/></td>
          <td><Link to={`${match.path}/${record.id}`}>{record.username}</Link></td>
          <td>{record.name}</td>
          <td>{record.email}</td>
          <td>{record.role.name}</td>
          <td>{record.status}</td>
        </tr>
      );
    });
  };

  componentDidMount () {
    waitUntilFetched.call(this,
      dropdownsSearch('role_names_filter', { admin: { id: 1 } })
        .then(response => this.setState({ filterRolesField: response.data }))
    );
  }

  render () {
    return (
      <IndexTable
        {...this.props}
        toolbar={ <BasicListToolbar {...this.props} title='User accounts' label="+ Create Account" /> }
        filterFields={filterFields(this.state.filterRolesField)}
        resource={resource}
        filterFetcher={filterFetcher}
        columns={
          <React.Fragment>
            <th disableSort>Photo</th>
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

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'admin'

export default connectList(resource, SET_LIST, resourceFetcher(filterFetcher, resource), Index);
