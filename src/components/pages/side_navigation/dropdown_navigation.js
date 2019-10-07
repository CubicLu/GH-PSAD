import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, NavItem, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import styles from './side-navigation.module.sass'

function DropdownNavigation (props) {
  const [isOpen, setIsOpen ] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [props.location.pathname]);

  const isSomeLinkActive = props.children.some(element => {
    return element.props.className.includes('selected-point')
  })

  return (
    <Navbar className={`p-0 ${isSomeLinkActive ? 'selected-point' : ''}`}>
      <div className={`${isOpen ? styles.svgWhite : ''} menu-points d-flex align-items-center`}  onClick={() => setIsOpen(!isOpen)} >
        {props.icon}
        <span className=" d-none d-lg-block d-xl-block mr-2">
          {props.title}
        </span>
        <FontAwesomeIcon className="d-none d-lg-block d-xl-block" icon={isOpen ? faAngleUp : faAngleDown}/>
      </div>
      <div className={`${isOpen ? styles.activeNavbar : ''} ${styles.transitionWidth} d-flex d-sm-none d-none d-sm-flex d-md-none d-md-flex d-lg-none h-100 d-flex align-items-center position-absolute`}>
        <span className="mr-3 float-right">
          {props.title}
          <ul className="shadow-sm bg-white p-0">
           {props.children.map((element, index) => {
          return (
            <NavItem className="ml-3 text-center" key={element.props.to}>
              {element}
            </NavItem>
          )
        })}
          </ul>
        </span>
      </div>
      <Collapse isOpen={isOpen}>
        {props.children.map((element, index) => {
          return (
            <NavItem className="ml-3 d-none d-lg-block d-xl-block" key={element.props.to}>
              {element}
            </NavItem>
          )
        })}
      </Collapse>
    </Navbar>
  );
}

export default withRouter(DropdownNavigation);
