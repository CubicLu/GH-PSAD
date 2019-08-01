import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/cameras';
import { index } from 'api/cameras';
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import BasicListToolbar from 'components/base/basic_list_toolbar';
import { displayUnixTimestamp } from 'components/helpers';
import IndexTable from 'components/base/table';

class Index extends React.Component {
  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}`}>{record.name}</Link></td>
          <td>{record.stream}</td>
          <td>{displayUnixTimestamp(record.created_at)}</td>
          <td>{displayUnixTimestamp(record.updated_at)}</td>
          <td>{record.parking_lot ? record.parking_lot.id : null}</td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        fetcher={index}
        toolbar={ <BasicListToolbar {...this.props} fetcher={index} label="Create Camera"/> }
        columns={
          <React.Fragment>
            <th attr="name">Name</th>
            <th attr="stream">Stream</th>
            <th attr="created_at">Created At</th>
            <th attr="updated_at">Updated At</th>
            <th attr="parking_lot_id">Parking Lot</th>
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

export default connectList('camera', SET_LIST, resourceFetcher(index), Index);
