import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import DropdownNavigation from './dropdown_navigation'

function SideNavigation () {
  return (
    <Nav vertical pills>
      <NavLink className='nav-link' to='/dashboard/admins'>Admins</NavLink>
      <DropdownNavigation title="Law enf agency">
        <NavLink to='/dashboard/agencies'>Law agencies</NavLink>
        <NavLink to='/dashboard/tickets'>Tickets</NavLink>
        <NavLink to=''>Tickets Handling Reports</NavLink>
      </DropdownNavigation>
      <NavLink className='nav-link' to='/dashboard/cameras'>Cameras</NavLink>
      <NavLink className='nav-link' to='/dashboard/parking_lots'>Parking Lots</NavLink>
    </Nav>
  );
}

export default SideNavigation;
