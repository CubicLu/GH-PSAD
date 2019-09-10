import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
/* Actions */
import { SET_LIST } from 'actions/admins';
/* API */
import { index } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/admins';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';

class Index extends React.Component {
  state = {
    filterRolesField: []
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
            <span className={`btn btn-${record.status === 'active' ? 'success' : 'danger'}`}>
              {record.status}
            </span>
          </td>
        </tr>
      );
    });
  };

  filterFetcher = (values, query) => {
    return (
      index({
        query: {
          ...query,
          role_names: values.role_names,
          status: values.status,
          'query[email]': values.email,
          'query[username]': values.username,
          'query[name]': values.name
        }
      })
    );
  }

  componentDidMount () {
    dropdownsSearch('role_names_filter', { admin: { id: 1 } })
      .then(response => this.setState({ filterRolesField: response.data }))
      .catch(err => console.err(err));
  }

  render () {
    return (
      <IndexTable
        {...this.props}
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

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

export default connectList('admin', SET_LIST, resourceFetcher(index), Index);
