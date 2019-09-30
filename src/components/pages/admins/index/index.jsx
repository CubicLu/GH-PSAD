import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from 'underscore';
import  { CREATE_ADMIN } from 'config/permissions'
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
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Index extends React.Component {
  state = {
    filterRolesField: []
  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    const { filterRolesField } = this.state
    return isResourceFetching || isEmpty(filterRolesField)
  }

  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><img src={record.avatar || 'https://i.stack.imgur.com/34AD2.jpg'} alt="avatar" className="rounded-circle" width="50" height="50"/></td>
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
    const { startFetching, currentUser } = this.props
    startFetching(dropdownsSearch('role_names_filter', { admin: { id: currentUser.id } }))
      .then(response => this.setState({ filterRolesField: response.data }))
  }

  render () {
    return (
      <IndexTable
        isFetching={this.isFetching}
        {...this.props}
        toolbar={ <BasicListToolbar {...this.props} createRequiredPermissions={[CREATE_ADMIN]} title='User accounts' label="+ Create Account" /> }
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

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  ));
