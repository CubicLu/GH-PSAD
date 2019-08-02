import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SET_LIST } from 'actions/agencies';
import { index, search } from 'api/agencies';
import connectList from 'components/modules/connect_list';
import { filterFields } from 'components/helpers/fields/agencies';
import resourceFetcher from 'components/modules/resource_fetcher';
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';

class Index extends React.Component {
  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      debugger
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}`}>{record.name}</Link></td>
          <td>{record.id}</td>
          <td>{record.location.full_address}</td>
          <td>{record.email}</td>
          <td>{record.phone}</td>
          <td>{record.manager.name}</td>
        </tr>
      );
    });
  };

  filterFetcher = (values) => {
    return (
    search({
      'query[agencies.email]': values.email,
      'query[agencies.name]': values.name,
      'query[agencies.phone]': values.phone,
      'query[locations.full_address]': values.full_address
    })
  )}

  render () {
    return (
      <IndexTable
        {...this.props}
        fetcher={index}
        toolbar={ <BasicListToolbar {...this.props} fetcher={index} label="Create Agency"/> }
        filterFields={filterFields()}
        filterFetcher={this.filterFetcher}
        columns={
          <React.Fragment>
            <th attr="agencies.name">Agency Name</th>
            <th attr="agencies.id">Agency ID</th>
            <th attr="locations.street">Location</th>
            <th attr="agencies.email">Email</th>
            <th attr="agencies.phone">Phone</th>
            <th attr="admins.name">Enforcement Manager</th>
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

export default connectList('agency', SET_LIST, resourceFetcher(index), Index);
