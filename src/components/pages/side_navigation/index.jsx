import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';

function SideNavigation() {
  return (
    <Nav vertical pills>
      <NavLink className="nav-link" to="/dashboard/admins">Admins</NavLink>
      <NavLink className="nav-link" to="/dashboard/agencies">Agencies</NavLink>
      <NavLink className="nav-link" to="/dashboard/cameras">Cameras</NavLink>
      <NavLink className="nav-link" to="/dashboard/parking_lots">Parking Lots</NavLink>
    </Nav>
  );
}

export default SideNavigation;
