import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, NavItem, Collapse, NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

function DropdownNavigation (props) {
  const [isOpen, setIsOpen ] = useState(false)
  return (
    <Navbar>
      <NavLink onClick={() => setIsOpen(!isOpen)} >
        <span className="mr-1">{props.title}</span>
        <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown}/>
      </NavLink>
      <Collapse isOpen={isOpen}>
        {props.children.map((element, index) => (
          <NavItem className="ml-3" key={element}>
            {element}
          </NavItem>
        ))}
      </Collapse>
    </Navbar>
  );
}

export default DropdownNavigation;
