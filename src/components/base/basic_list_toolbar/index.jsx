import React from 'react';
import PropTypes from 'prop-types';
import { Button, Badge, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import  { permissions } from 'config/permissions'
/* Modules */
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';

import './back_list_toolbar.sass'

class BasicListToolbar extends React.Component {
  newRecord = () => {
    const { match, history } = this.props;
    history.push(`${match.path}/new`);
  };

  render () {
    const {
      label,
      title,
      onClickFilter,
      badgesFilter,
      badgesDelete,
      createRequiredPermissions,
      currentUserRoleName
    } = this.props;

    return (
      <Row className="w-100 justify-content-around">
        <Col md={4} className="d-flex align-items-center pb-1 pl-0">
          <h4>
            { title }
          </h4>
        </Col>
        <Col md={6} className="row pb-1 align-items-center justify-content-end pr-0">
          <Col className="m-0"  xs={12} sm={8} md={8} lg={8}>
            <div className="filter-box shadow d-inline-block float-right">
              <span className="general-text-3 mr-3">Filter By</span>
              {
                badgesFilter.map(element => (
                  <Button onClick={() => badgesDelete(element)} key={element} color="secondary" className="mr-3" >
                    {element.label} <Badge color="secondary"> <FontAwesomeIcon icon={faTimes}/> </Badge>
                  </Button>
                ))
              }
              <Button color="dark" onClick={onClickFilter}>
                <FontAwesomeIcon icon={faFilter}/>
              </Button>
            </div>
         </Col>
          {
            label && (
              <PermissibleRender
                userPermissions={permissions[currentUserRoleName]}
                requiredPermissions={createRequiredPermissions || permissions[currentUserRoleName]}
              >
                <Col xs={12} sm={4} md={4} lg={4} className="pr-0">
                  <Button color="primary-lg" className="btn-md px-4 text-uppercase " onClick={this.newRecord}>{label}</Button>
                </Col>
              </PermissibleRender>
            )
          }
        </Col>
      </Row>
    );
  }
}

BasicListToolbar.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onClickFilter: PropTypes.func,
  setList: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default withCurrentUser(BasicListToolbar);
