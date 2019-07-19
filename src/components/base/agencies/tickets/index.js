import React from 'react';
import { displayUnixTimestamp } from 'components/helpers';
import { Link } from 'react-router-dom';

const Tickets = props => {
  const { parking_ticket, agency_id, index } = props
  const query = index ? '?index=true' : ''
  return (
     <tr>
      <th scope="row">{parking_ticket.id}</th>
      <td>{parking_ticket.officer.email}</td>
      <td>{parking_ticket.lot.name}</td>
      <td>
        <span className={`btn btn-${parking_ticket.status === 'opened' ? 'success' : 'warning'}`}>
          {parking_ticket.status}
        </span>
      </td>
      <td>{parking_ticket.type}</td>
      <td>{displayUnixTimestamp(parking_ticket.created_at)}</td>
      <td>
        <Link to={`/dashboard/agencies/${agency_id}/tickets/${parking_ticket.id}/edit${query}`} className="btn btn-primary mr-1">Edit</Link>
        <Link to={`/dashboard/agencies/${agency_id}/tickets/${parking_ticket.id}${query}`} className="btn btn-info mr-1">Show</Link>
      </td>
    </tr>
  )
}

export default Tickets;