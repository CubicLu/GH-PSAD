import React from 'react';
import { displayUnixTimestamp } from 'components/helpers';
import { Link } from 'react-router-dom';

const Tickets = props => {
  const { parkingTicket, url } = props
  return (
     <tr>
      <th scope="row">{parkingTicket.id}</th>
      <td>{parkingTicket.officer.email}</td>
      <td>{parkingTicket.lot.name}</td>
      <td>
        <span className={`btn btn-${parkingTicket.status === 'opened' ? 'success' : 'warning'}`}>
          {parkingTicket.status}
        </span>
      </td>
      <td>{parkingTicket.type}</td>
      <td>{displayUnixTimestamp(parkingTicket.created_at)}</td>
      <td>
        <Link to={`${url}/${parkingTicket.id}`} className="btn btn-info mr-1">Show</Link>
      </td>
    </tr>
  )
}

export default Tickets;