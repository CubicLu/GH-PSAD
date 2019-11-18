import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'underscore';
import { CREATE_PARKING_LOT } from 'config/permissions'
/* Actions */
import { SET_LIST } from 'actions/parking_lots';
/* API */
import { filterFetcher } from 'api/parking_lots';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/parking_lots';
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
    const { dropdowns: { townManagers, parkingAdmins } } = this.state
    return isResourceFetching && (isEmpty(townManagers) || isEmpty(parkingAdmins))
  }

  renderRecords = () => {
    const { list, match, history } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx} onClick={() => history.push(`${match.path}/${record.id}`)}>
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td>{record.location.full_address}</td>
          <td>{record.phone}</td>
          <td>{record.email}</td>
          <td>{record.parking_admin ? record.parking_admin.name : null}</td>
          <td>{record.town_manager ? record.town_manager.name : null}</td>
          <td>{record.status}</td>
        </tr>
      );
    });
  };

  componentDidMount() {
    const { startFetching, currentUser } = this.props
    startFetching(dropdownsSearch('parking_lot_parking_admins_filter', { admin_id: currentUser.id }))
      .then(res => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            parkingAdmins: res.data
          }
        })
      })
    startFetching(dropdownsSearch('parking_lot_town_managers_filter', { admin_id: currentUser.id }))
      .then(res => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            townManagers: res.data
          }
        })
      })
  }

  render() {
    const { dropdowns: { townManagers, parkingAdmins } } = this.state

    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={<BasicListToolbar {...this.props} createRequiredPermissions={[CREATE_PARKING_LOT]} label="+ Create New" title="Parking lot accounts" />}
        filterFields={filterFields(parkingAdmins, townManagers)}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th disableSort>Lot ID</th>
            <th disableSort>Name</th>
            <th disableSort>Location</th>
            <th disableSort>Contact Number</th>
            <th disableSort>Email</th>
            <th disableSort>Assigned Parking Admin</th>
            <th disableSort>Assigned Town Manager</th>
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

const resource = 'parking_lot'

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
