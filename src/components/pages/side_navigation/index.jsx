import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav } from 'reactstrap';
import DropdownNavigation from './dropdown_navigation'
import { ReactComponent as DashboardIcon } from 'assets/menu_icons/dashboard_icon.svg'
import { ReactComponent as AdminIcon } from 'assets/menu_icons/user_accounts_icon.svg'
import { ReactComponent as AgenciesIcon } from 'assets/menu_icons/law_enf_icon.svg'
import { ReactComponent as CameraIcon } from 'assets/menu_icons/stream_footages_icon.svg'
import { ReactComponent as ParkingLotIcon } from 'assets/menu_icons/parking_lot_icon.svg'
import styles from './side-navigation.module.sass'

const routes = {
  dashboard: '/dashboard',
  admins: '/dashboard/admins',
  agencies: '/dashboard/agencies',
  tickets: '/dashboard/tickets',
  ticketsReport: '/dashboard/tickets-reports',
  cameras: '/dashboard/cameras',
  parkingLots: '/dashboard/parking_lots',
}

const isActive = (location, path) => (
  location ? (
    location.pathname === path ? 'selected-point' : 'menu-points'
  ) : 'menu-points'
)

function SideNavigation (props) {
  return (
    <Nav vertical pills className={`${styles.sideNavigation} shadow-sm pr-0 m-0 bg-white d-fixed h-100'`}>
      <li>
        <Link className={`nav-link ${isActive(props.location, routes.dashboard)}`} to={routes.dashboard}>
          <DashboardIcon className="float-left mr-2"/>
          <span className="d-none d-lg-block d-xl-block">
            Dashboard
          </span>
        </Link>
      </li>
      <li>
        <Link className={`nav-link ${isActive(props.location, routes.admins)}`} to={routes.admins}>
          <AdminIcon className="float-left mr-2"/>
          <span className="d-none d-lg-block d-xl-block">
            User accounts
          </span>
        </Link>
      </li>
      <li>
        <Link className={`nav-link ${isActive(props.location, routes.parkingLots)}`} to={routes.parkingLots}>
          <ParkingLotIcon className="float-left mr-2"/>
          <span className="d-none d-lg-block d-xl-block">
            Parking lot accounts
          </span>
        </Link>
      </li>
      <li>
        <DropdownNavigation title="Law enf agency" className="selected-point" icon={<AgenciesIcon className="float-left mr-2"/>}>
          <Link className={`nav-link ${isActive(props.location, routes.agencies)}`} to={routes.agencies}>Law agencies</Link>
          <Link className={`nav-link ${isActive(props.location, routes.tickets)}`} to={routes.tickets}>Tickets</Link>
          <Link className={`nav-link ${isActive(props.location, routes.ticketsReport)}`} to={routes.ticketsReport}>Tickets Handling Reports</Link>
        </DropdownNavigation>
      </li>
      <li>
        <Link className={`nav-link ${isActive(props.location, routes.cameras)}`} to={routes.cameras}>
          <CameraIcon className="float-left mr-2"/>
          <span className="d-none d-lg-block d-xl-block">
            Stream footages
          </span>
        </Link>
      </li>
    </Nav>
  );
}

export default withRouter(SideNavigation);
