import React from 'react';
import { NavLink } from 'react-router-dom';

function SideNavigation() {
  return (
    <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
      <NavLink className="nav-link" activeClassName="active" to="/dashboard/admins">Admins</NavLink>
      <NavLink className="nav-link" activeClassName="active" to="/dashboard/agencies">Agencies</NavLink>
      <NavLink className="nav-link" activeClassName="active" to="/dashboard/cameras">Cameras</NavLink>
      <NavLink className="nav-link" activeClassName="active" to="/dashboard/parking_lots">Parking Lots</NavLink>
    </div>
  );
}

export default SideNavigation;
