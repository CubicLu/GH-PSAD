import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav, Navbar,
  NavbarBrand,
  UncontrolledDropdown
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <Navbar color="light" light expand className="mb-2">
      <NavbarBrand>
        LOGO
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            Admin Profile
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <NavLink className="nav-link" to="/user/settings">Settings</NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink className="nav-link" to="/sign_out">Sign Out</NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
  );
}

export default Header;
