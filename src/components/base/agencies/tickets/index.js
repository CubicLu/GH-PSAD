import React from 'react';
import { displayUnixTimestamp } from 'components/helpers';
import { Link } from 'react-router-dom';

const Tickets = props => {
  const { parking_ticket, url } = props
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
        <Link to={`${url}/${parking_ticket.id}`} className="btn btn-info mr-1">Show</Link>
      </td>
    </tr>
  )
}

export default Tickets;