import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/agencies';
/* API */
import { filterFetcher } from 'api/agencies';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/agencies';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';

class Index extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  renderRecords = () => {
    const { list, match, history } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx} onClick={(() => history.push(`${match.path}/${record.id}`))}>
          <td>{record.name}</td>
          <td>{record.id}</td>
          <td>{record.location.full_address}</td>
          <td>{record.email}</td>
          <td>{record.phone}</td>
          <td>{record.manager.name}</td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        isFetching={this.isFetching}
        {...this.props}
        toolbar={ <BasicListToolbar  showFilters={true} {...this.props} label="+ Create Agency" title="Law agencies"/> }
        filterFields={filterFields()}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="agencies.name">Agency Name</th>
            <th attr="agencies.id">Agency ID</th>
            <th attr="locations.street">Location</th>
            <th attr="agencies.email">E-mail</th>
            <th attr="agencies.phone">Phone</th>
            <th attr="admins.name">Enforcement Manager</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="agencies"
      >
      </IndexTable>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired
};

const resource = 'agency'

export default connectList(resource, SET_LIST, resourceFetcher(filterFetcher, resource), Index);
