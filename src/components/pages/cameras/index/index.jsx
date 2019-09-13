import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
/* Actions */
import { SET_LIST } from 'actions/cameras';
/* API */
import { filterFetcher } from 'api/cameras';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/cameras';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';

class Index extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

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
        isFetching={this.isFetching}
        toolbar={ <BasicListToolbar {...this.props} label="+ Add Camera" title="Cameras"/> }
        filterFields={filterFields()}
        filterFetcher={filterFetcher}
        resource={resource}
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

const resource = 'camera'

export default connectList(resource, SET_LIST, resourceFetcher(filterFetcher, resource), Index);
