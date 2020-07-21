import React from 'react';
import PropTypes from 'prop-types';
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
/* Styles/Assets */
import styles from './index.module.sass';

class Index extends React.Component {
  state = {
    isDropdownFetching: true,
    dropdowns: {
      townManagers: [],
      parkingAdmins: []
    }
  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    const { isDropdownFetching } = this.state
    return isResourceFetching || isDropdownFetching
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

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

  componentWillUnmount () {
    document.querySelector('.frame-container').classList.remove('bg-transparent', 'shadow-none');
  }

  componentDidMount() {
    document.querySelector('.frame-container').classList.add('bg-transparent', 'shadow-none');
    const { startFetching, currentUser } = this.props
    Promise.all([
      startFetching(dropdownsSearch('parking_lot_parking_admins_filter', { admin_id: currentUser.id }))
        .then(response => this.setDropdowns('parkingAdmins', response.data)),
      startFetching(dropdownsSearch('parking_lot_town_managers_filter', { admin_id: currentUser.id }))
        .then(response => this.setDropdowns('townManagers', response.data)),
    ])
      .finally(() => this.setState({ isDropdownFetching: false }))

  }

  render() {
    const { dropdowns: { townManagers, parkingAdmins } } = this.state

    return (
      <div className={styles.container}>
        <IndexTable
          {...this.props}
          className={styles.table}
          isFetching={this.isFetching}
          toolbar={<BasicListToolbar showFilters={true} {...this.props} createRequiredPermissions={[CREATE_PARKING_LOT]} label="+ Create New" title="Parking lot accounts" />}
          filterFields={filterFields(parkingAdmins, townManagers)}
          filterFetcher={filterFetcher}
          resource={resource}
          columns={
            <React.Fragment>
              <th disableSort style={{ width: '6%', minWidth: 50 }}>Lot ID</th>
              <th disableSort style={{ width: '14%', minWidth: 120 }}>Name</th>
              <th disableSort style={{ width: '30%', minWidth: 250 }}>Location</th>
              <th disableSort style={{ width: '11%', minWidth: 100 }}>Contact Number</th>
              <th disableSort style={{ width: '11%', minWidth: 100 }}>Email</th>
              <th disableSort style={{ width: '11%', minWidth: 100 }}>Parking Admin</th>
              <th disableSort style={{ width: '11%', minWidth: 100 }}>Town Manager</th>
              <th disableSort style={{ width: '6%', minWidth: 50 }}>Status</th>
            </React.Fragment>
          }
          renderRecords={this.renderRecords}
        >
        </IndexTable>
      </div>
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
