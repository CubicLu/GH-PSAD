import React from 'react';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/parking_lots';
import { index } from 'api/parking_lots';
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';

class Index extends React.Component {

  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}`}>{record.name}</Link></td>
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

  render() {
    return (
      <IndexTable
        {...this.props}
        fetcher={index}
        toolbar={<BasicListToolbar {...this.props} fetcher={index} label="Create Parking Lot"/>}
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

export default connectList('parking_lot', SET_LIST, resourceFetcher(index), Index);
