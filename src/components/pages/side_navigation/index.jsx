import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav } from 'reactstrap';
import DropdownNavigation from './dropdown_navigation'
import { ReactComponent as DashboardIcon } from 'assets/menu_icons/dashboard_icon.svg'
import { ReactComponent as AdminIcon } from 'assets/menu_icons/user_accounts_icon.svg'
import { ReactComponent as AgenciesIcon } from 'assets/menu_icons/law_enf_icon.svg'
import { ReactComponent as CameraIcon } from 'assets/menu_icons/stream_footages_icon.svg'
import { ReactComponent as ParkingLotIcon } from 'assets/menu_icons/parking_lot_icon.svg'
import { ReactComponent as ReportIcon } from 'assets/menu_icons/reports_icon.svg'
import styles from './side-navigation.module.sass'
import { permissions } from 'config/permissions'
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';
import { INDEX_PARKING_LOT } from 'config/permissions'

const routes = {
  dashboard: '/dashboard',
  admins: '/dashboard/admins',
  agencies: '/dashboard/agencies',
  tickets: '/dashboard/tickets',
  ticketsReport: '/dashboard/tickets-reports',
  cameras: '/dashboard/cameras',
  parkingLots: '/dashboard/parking_lots',
  parkingLotsCamera: '/dashboard/live/parking_lots',
  reports: '/dashboard/reports',
  archive: ''
}

const isActive = (location, path) => (
  location ? (
    location.pathname === path ? 'selected-point' : 'menu-points'
  ) : 'menu-points'
)

function SideNavigation(props) {
  const { currentUserRoleName } = props
  return (
    <Nav vertical pills className={`${styles.sideNavigation} shadow-sm pr-0 bg-white h-100`}>
      <li>
        <Link className={`nav-link ${isActive(props.location, routes.dashboard)}`} to={routes.dashboard}>
          <DashboardIcon className="float-left mr-2" />
          <span className="d-none d-xl-block">
            Dashboard
          </span>
        </Link>
      </li>
      <li>
        <Link className={`nav-link ${isActive(props.location, routes.admins)}`} to={routes.admins}>
          <AdminIcon className="float-left mr-2" />
          <span className="d-none d-xl-block">
            User accounts
          </span>
        </Link>
      </li>
      <PermissibleRender
        userPermissions={permissions[currentUserRoleName]}
        requiredPermissions={[INDEX_PARKING_LOT]}
      >
        <li>
          <Link className={`nav-link ${isActive(props.location, routes.parkingLots)}`} to={routes.parkingLots}>
            <ParkingLotIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Parking lot accounts
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <li>
        <DropdownNavigation title="Law enf agency" className="selected-point" icon={<AgenciesIcon className="float-left mr-2"/>}>
          <Link className={`nav-link ${isActive(props.location, routes.agencies)}`} to={routes.agencies}>Law agencies</Link>
          <Link className={`nav-link ${isActive(props.location, routes.tickets)}`} to={routes.tickets}>Tickets</Link>
          <Link className={`nav-link ${isActive(props.location, routes.ticketsReport)}`} to={routes.ticketsReport}>Tickets Handling Reports</Link>
        </DropdownNavigation>
      </li>
      <li>
        <DropdownNavigation title="Stream footages" className="selected-point" icon={<CameraIcon className="float-left mr-2" />}>
          <Link className={`nav-link ${isActive(props.location, routes.cameras)}`} to={routes.parkingLotsCamera}>Live</Link>
          <Link className={`nav-link ${isActive(props.location, routes.archive)}`} to={routes.archive}>Archive</Link>
        </DropdownNavigation>
      </li>
        <li>
        <Link className={`nav-link ${isActive(props.location, routes.reports)}`} to={routes.reports}>
          <ReportIcon className="float-left mr-2" />
          <span className="d-none d-xl-block">
            Reports
          </span>
        </Link>
      </li>
    </Nav>
  );
}

export default withRouter(withCurrentUser(SideNavigation));
