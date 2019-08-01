import React from 'react';
import PropTypes from 'prop-types';
import { SET_LIST } from 'actions/agencies/tickets';
import { index } from 'api/parking/tickets';
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
        parking_ticket={record}
        url={match.url}
      />
    ));
  };

  render () {
    const { match, backPath } = this.props;
    const agencyId = match.params.agencyId;
    const agency = this.props.list[0] && this.props.list[0].agency;
    return (
      <IndexTable
        {...this.props}
        fetcher={index}
        paginationQuery={{ agencyId }}
        toolbar={ <BasicBackListToolbar {...this.props} label={`${agency && agency.name} Tickets`} link={backPath} fetcher={index}/>}
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
