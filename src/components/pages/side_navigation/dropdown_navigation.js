import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, NavItem, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

function DropdownNavigation (props) {
  const [isOpen, setIsOpen ] = useState(false)

  /* Close dropdown when route changes and doesn't match any route inside of it */
  useEffect(() => {
    const routeMatched = props.children.some(element => {
      const currentRouteRegex = new RegExp(`^${element.props.to}`)
      return currentRouteRegex.test(props.location.pathname)
    })
    setIsOpen(routeMatched)
  }, [props.location.pathname]);


  return (
    <Navbar>
      <div className="text-primary" onClick={() => setIsOpen(!isOpen)} >
        <span className="mr-1">{props.title}</span>
        <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown}/>
      </div>
      <Collapse isOpen={isOpen}>
        {props.children.map((element, index) => {
          return (
            <NavItem className="ml-3" key={element.props.to}>
              {element}
            </NavItem>
          )
        })}
      </Collapse>
    </Navbar>
  );
}

export default withRouter(DropdownNavigation);
