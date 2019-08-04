import React from 'react';
import PropTypes from 'prop-types';
import { SET_LIST } from 'actions/tickets';
import { index } from 'api/parking/tickets';
import { filterFields } from 'components/helpers/fields/tickets';
import connectList from 'components/modules/connect_list';
import BasicBackListToolbar from 'components/base/basic_list_toolbar/back';
import Ticket from 'components/base/agencies/tickets';
import resourceFetcher from 'components/modules/resource_fetcher';
import IndexTable from 'components/base/table';

class Index extends React.Component {
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


  filterFetcher = (values) => {
    const { match } = this.props;
    return index({
      agency_id: match.params.agency_id,
      query: {
        'query[id]': values.tickets_id,
        'query[email]': values.admins_email,
        'query[name]': values.parking_lot_name,
        'query[status]': values.tickets_status,
        'query[type]': values.tickets_type
      }
    })
  }

  render () {
    const { match, backPath } = this.props;
    const agencyId = match.params.agency_id;
    const agency = this.props.list[0] && this.props.list[0].agency;
    return (
      <IndexTable
        {...this.props}
        paginationQuery={{ agency_id: agencyId }}
        toolbar={ <BasicBackListToolbar {...this.props} label={`${agency && agency.name} Tickets`} link={backPath} fetcher={index.bind(this, { agency_id: agencyId })}/>}
        filterFields={filterFields()}
        filterFetcher={this.filterFetcher}
        columns={
          <React.Fragment>
            <th attr="parking_tickets.id">#</th>
            <th attr="admins.name">Officer</th>
            <th attr="parking_lots.name">Parking Lot</th>
            <th attr="parking_tickets.status">Status</th>
            <th attr="parking_rules.name">Type</th>
            <th attr="parking_tickets.created_at">Created At</th>
            <th disableSort>Actions</th>
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
