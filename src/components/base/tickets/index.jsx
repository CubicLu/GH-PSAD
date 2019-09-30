import React from 'react';
import { displayUnixTimestamp } from 'components/helpers';
import { Link } from 'react-router-dom';

const Tickets = props => {
  const { parkingTicket, url } = props;
  return (
    <tr>
      <th scope="row">{parkingTicket.id}</th>
      <td><Link to={`${url}/${parkingTicket.id}`} className="mr-1">{parkingTicket.type}</Link></td>
      <td>{parkingTicket.lot.name}</td>
      <td>{displayUnixTimestamp(parkingTicket.created_at)}</td>
      <td>{parkingTicket.officer ? parkingTicket.officer.email : 'Unassigned'}</td>
      <td>{parkingTicket.status}</td>
    </tr>
  );
};

export default Tickets;
