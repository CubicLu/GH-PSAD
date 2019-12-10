import React from 'react';
import PropTypes from 'prop-types';
import env from '.env';
import { Button } from 'reactstrap';
/* Actions */
import { SET_LIST } from 'actions/parking_sessions';
/* API */
import { filterFetcher } from 'api/parking_sessions';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/parking_sessions';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
/* Assets */
import { ReactComponent as ExportIcon } from 'assets/export_icon.svg'

class Index extends React.Component {
  state = {
    isDropdownFetching: true,
    dropdowns: {
      paymentMethods: [],
      parkingSessionStatuses: [],
      parkingSessionsKioskIds: []
    }
  }

  exportFile = () => {
    const { match } = this.props;
    const parking_lot_id = match.params.id
    const url = `${env.backend_url}/dashboard/parking_sessions/report.xlsx?token=${localStorage.TOKEN}&parking_lot_id=${parking_lot_id}`
    window.open(url, '_blank');
    window.focus();
  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { isDropdownFetching } = this.state;
    return isResourceFetching || isDropdownFetching
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  renderRecords = () => {
    const { list, match, history } = this.props;
    return list.map((record, idx) => (
      <tr key={idx} onClick={() => history.push(`${match.url}/${record.id}`)}>
        <td>{record.id}</td>
        <td>{record.vehicle && record.vehicle.plate_number}</td>
        <td>{displayUnixTimestamp(record.created_at)}</td>
        <td>{record.slot ? record.slot.name : ''}</td>
        <td>{record.status}</td>
      </tr>
    ));
  };

  componentDidMount () {
    const { startFetching, match } = this.props
    Promise.all([
      startFetching(dropdownsSearch('payment_methods_list'))
        .then(response => this.setDropdowns('paymentMethods', response.data)),
      startFetching(dropdownsSearch('parking_session_statuses_list'))
        .then(response => this.setDropdowns('parkingSessionStatuses', response.data)),
      startFetching(dropdownsSearch('parking_session_kiosk_ids_list', { parking_lot_id: match.params.id }))
        .then(response => this.setDropdowns('parkingSessionsKioskIds', response.data)),
    ])
      .finally(() => this.setState({ isDropdownFetching: false }))
  }


  render () {
    const { backPath } = this.props
    const { dropdowns: { paymentMethods, parkingSessionStatuses, parkingSessionsKioskIds } } = this.state
     return (
      <IndexTable
        isFetching={this.isFetching}
        {...this.props}
        toolbar={
          <BasicListToolbar
          {...this.props}
          goBackPath={`${backPath}`}
          title="Parking Session Records"
          extraButtons={() => {
            return (
              <Button onClick={this.exportFile} color="primary" className="px-2 py-2 align-items-center mr-3 d-flex">
                <ExportIcon className="mr-1"/>
                Export
              </Button>
              )
            }
          }/>
        }
        filterFields={filterFields(paymentMethods, parkingSessionStatuses, parkingSessionsKioskIds)}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="parking_sessions.id">Transaction Number</th>
            <th attr="vehicles.plate_number">Vehicle Plate</th>
            <th attr="parking_sessions.created_at">Date</th>
            <th attr="parking_slots.name">Parking Space ID</th>
            <th attr="parking_sessions.status">Status</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
      />
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired
};

const resource = 'parking_session'

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(Index)
);
