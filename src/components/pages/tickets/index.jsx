import React from 'react';
import PropTypes from 'prop-types';
import { SET_LIST } from 'actions/tickets';
import { index, statuses } from 'api/parking/tickets';
import { filterFields } from 'components/helpers/fields/tickets';
import connectList from 'components/modules/connect_list';
import BasicBackListToolbar from 'components/base/basic_list_toolbar/back';
import Ticket from 'components/base/agencies/tickets';
import resourceFetcher from 'components/modules/resource_fetcher';
import IndexTable from 'components/base/table';
import waitUntilFetched from 'components/modules/wait_until_fetched';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { search as dropdownsSearch } from 'api/dropdowns';

class Index extends React.Component {
  state = {
    dropdowns: {
      officers: [],
      statuses: []
    }
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

  filterFetcher = (values, query) => {
    const { match } = this.props;
    debugger
    return index({
      agency_id: match.params.agency_id,
      query: {
        ...query,
        ticket_id: values.ticket_id,
        admin_ids: values.admin_ids,
        type: values.type,
        query: values.query,
        status: values.status,
        'range[from]': values.range ? values.range.from : null,
        'range[to]': values.range ? values.range.to : null
      }
    });
  }

  componentDidMount () {
    const { match } = this.props;
    waitUntilFetched.call(this,
      dropdownsSearch('tickets_officers_filter', { agency_id: match.params.agency_id })
        .then(response => {
          this.setState({
            dropdowns: {
              ...this.state.dropdowns,
              officers: response.data
            }
          });
        })
        .catch(this.handleFailed),
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
    );
  }

  render () {
    const { match, backPath } = this.props;
    const { statuses, officers } = this.state.dropdowns;
    const agencyId = match.params.agency_id;
    const agency = this.props.list[0] && this.props.list[0].agency;
    return (
      <IndexTable
        {...this.props}
        paginationQuery={{ agency_id: agencyId }}
        toolbar={ <BasicBackListToolbar {...this.props} label={`${agency && agency.name} Tickets`} link={backPath} fetcher={index.bind(this, { agency_id: agencyId })}/>}
        filterFields={filterFields(officers, statuses)}
        filterFetcher={this.filterFetcher}
        columns={
          <React.Fragment>
            <th attr="parking_tickets.id">#</th>
            <th attr="parking_rules.name">Violation Name</th>
            <th attr="parking_lots.name">Parking Lot Name</th>
            <th attr="parking_tickets.created_at">Date Commited</th>
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
  backPath: PropTypes.string.isRequired
};

export default connectList('ticket', SET_LIST, resourceFetcher(index), Index);
