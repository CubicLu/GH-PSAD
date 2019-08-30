import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/tickets';
/* API */
import { filterFetcher, statuses } from 'api/parking/tickets';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import Ticket from 'components/base/tickets';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/tickets';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withCurrentUser from 'components/modules/with_current_user';

class Index extends React.Component {
  state = {
    dropdowns: {
      officers: [],
      statuses: []
    }
  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { officers, statuses } = this.state.dropdowns;
    return isResourceFetching || !officers || !statuses
  }

  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => (
      <Ticket
        key={record.id}
        parkingTicket={record}
        url={match.url}
      />
    ));
  };

  componentDidMount () {
    const { currentUser } = this.props;
    dropdownsSearch('tickets_officers_filter', { admin_id: currentUser.id })
      .then(response => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            officers: response.data
          }
        });
      })
      .catch(this.handleFailed)
    statuses()
      .then(({ data }) => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            statuses: data.statuses
          }
        });
      })
      .catch(this.handleFailed)
  }

  render () {
    const { statuses, officers } = this.state.dropdowns;
    return (
      <IndexTable
        isFetching={this.isFetching}
        {...this.props}
        toolbar={ <BasicListToolbar {...this.props} title="Tickets"/>}
        filterFields={filterFields(officers, statuses)}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="parking_tickets.id">#</th>
            <th attr="parking_rules.name">Violation Name</th>
            <th attr="parking_lots.name">Parking Lot Name</th>
            <th attr="parking_tickets.created_at">Date</th>
            <th attr="admins.name">Officer</th>
            <th attr="parking_tickets.status">Status</th>
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
  match: PropTypes.object.isRequired,
  backPath: PropTypes.string.isRequired,
  isResourceFetching: PropTypes.bool.isRequired
};

const resource = 'ticket'

export default connectList(resource, SET_LIST, resourceFetcher(filterFetcher, resource), withCurrentUser(Index));
