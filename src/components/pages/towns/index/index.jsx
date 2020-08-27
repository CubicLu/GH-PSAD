import React from 'react';
import PropTypes from 'prop-types';
import { CREATE_TOWN } from 'config/permissions'
/* Actions */
import { SET_LIST } from 'actions/towns';
/* API */
import { filterFetcher } from 'api/towns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Index extends React.Component {
  state = {
    dropdowns: {
      townManagers: [],
      parkingAdmins: []
    }
  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  renderRecords = () => {
    const { list, match, history } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx} onClick={() => history.push(`${match.path}/${record.id}`)}>
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td>{record.town_manager ? record.town_manager.name : null}</td>
          <td>{record.parking_lots}</td>
          <td>{record.status}</td>
        </tr>
      );
    });
  };

  render() {

    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={<BasicListToolbar showFilters={false} {...this.props} createRequiredPermissions={[CREATE_TOWN]} label="+ Create New" title="Towns" />}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th disableSort>Town ID</th>
            <th disableSort>Town Name</th>
            <th disableSort>Town Manager</th>
            <th disableSort>Number of Parking Lots</th>
            <th disableSort>Status</th>
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

const resource = 'towns'

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
