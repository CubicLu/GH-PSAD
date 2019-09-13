import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
/* Actions */
import { SET_LIST } from 'actions/parking_lots';
/* API */
import { filterFetcher } from 'api/parking_lots';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/parking_lots';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';

class Index extends React.Component {
  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}/edit`}>{record.name}</Link></td>
          <td>{record.id}</td>
          <td>{record.address}</td>
          <td>{record.email}</td>
          <td>{record.phone}</td>
          <td>{record.parking_admin ? record.parking_admin.name : null}</td>
          <td>{record.parking_admin ? record.town_manager.name : null}</td>
          <td>{record.status}</td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        toolbar={<BasicListToolbar {...this.props} label="+ Create Parking Lot" title="Parking Lots"/>}
        filterFields={filterFields()}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th disableSort>Name</th>
            <th disableSort>Lot ID</th>
            <th disableSort>Location</th>
            <th disableSort>Email</th>
            <th disableSort>Phone</th>
            <th disableSort>Parking Admin</th>
            <th disableSort>Town Manager</th>
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

export default connectList('parking_lot', SET_LIST, resourceFetcher(filterFetcher, resource), Index);
