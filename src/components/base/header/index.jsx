import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav, Navbar,
  NavbarBrand,
  UncontrolledDropdown
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import withCurrentUser from 'components/modules/with_current_user';

function Header (props) {
  const { currentUser } = props;
  return (
    <Navbar color='primary' light expand className='mb-2'>
      <NavbarBrand className='text-light'>
        LOGO
      </NavbarBrand>
      <Nav className='ml-auto' navbar>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret className="text-light">
            { currentUser && currentUser.name }
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <NavLink className='nav-link' to='/user/settings'>Settings</NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink className='nav-link' to='/sign_out'>Sign Out</NavLink>
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

export default withCurrentUser(Header);
