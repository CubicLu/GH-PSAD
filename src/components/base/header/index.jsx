import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  UncontrolledDropdown
} from 'reactstrap';
import { NavLink, withRouter, Link } from 'react-router-dom';
import withCurrentUser from 'components/modules/with_current_user';
import {ReactComponent as Logo } from 'assets/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSignOutAlt, faAngleDown } from '@fortawesome/free-solid-svg-icons';

function Header (props) {
  const { currentUser } = props;
  return (
    <Navbar color='primary' light expand className="shadow-sm" >
      <Link  to='/dashboard' className='ml-4 btn-default text-light'>
        <Logo/>
      </Link>
      <Nav className='ml-auto' navbar>
        <UncontrolledDropdown nav inNavbar className="d-flex align-items-center">
          <DropdownToggle nav  className="float-left text-light">
            <FontAwesomeIcon className="d-none d-lg-block d-xl-block" icon={faAngleDown}/>
          </DropdownToggle>
          <DropdownToggle nav className="text-light float-right pr-3">
            {  currentUser ? (
                <span>
                  <span className="d-none d-sm-inline">{ process.env.NODE_ENV !== 'production' ? currentUser.role.name : currentUser.name}</span>
                  <img src ={ currentUser.avatar || 'https://i.stack.imgur.com/34AD2.jpg'} alt="profile" className="rounded-circle ml-3" width="40" height="40"/>
                </span>
              ) : (
                <span>
                  Loading...
                </span>
              )
            }
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <NavLink className='nav-link menu-points' to='/user/settings'>
                <FontAwesomeIcon size="xs" icon={faPencilAlt} className="mr-2"/>
                Edit account
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink className='nav-link menu-points' to='/sign_out'>
                <FontAwesomeIcon size="xs" icon={faSignOutAlt} className="mr-2"/>
                Log out
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
  );
}

Header.propTypes = {
  currentUser: PropTypes.object
};

export default withRouter(
  withCurrentUser(Header, Header)
);
