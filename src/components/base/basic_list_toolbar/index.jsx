import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Badge, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { permissions } from 'config/permissions'
/* Modules */
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';

import styles from './basic_list_toolbar.module.sass'

class BasicListToolbar extends React.Component {
  newRecord = () => {
    const { match, history } = this.props;
    history.push(`${match.path}/new`);
  };

  render() {
    const {
      label,
      title,
      onClickFilter,
      badgesFilter,
      badgesDelete,
      createRequiredPermissions,
      currentUserRoleName,
      goBackPath,
      extraButtons = () => { },
      addStreamView

    } = this.props;

    return (

      <Row className="w-100 justify-content-around">
        <Col md={2} className="d-flex align-items-center pb-1 pl-0">
          <h4>
            {
              goBackPath && (
                <Link to={goBackPath} className="mr-3" >
                  <FontAwesomeIcon size="sm" color="grey" icon={faChevronLeft} />
                </Link>
              )
            }
            {title}
          </h4>
        </Col>
        <Col md={!addStreamView ? 6 : 10} className="row pb-1 align-items-center justify-content-end pr-0">
          <Col className="m-0 align-items-center d-flex justify-content-end" xs={12} sm={12} md={10} lg={8}>
            <div className={`d-inline-block float-right`}>
              {extraButtons()}
            </div>
            {!addStreamView &&
              <div className={`${styles.filterBox} shadow d-inline-block float-right`}>
                <span className="general-text-3 mr-3">Filter By</span>
                {
                  badgesFilter.map(element => (
                    <Button onClick={() => badgesDelete(element)} key={element} color="secondary" className="mr-3" >
                      {element.label} <Badge color="secondary"> <FontAwesomeIcon icon={faTimes} /> </Badge>
                    </Button>
                  ))
                }
                <Button color="dark" onClick={onClickFilter}>
                  <FontAwesomeIcon icon={faFilter} />
                </Button>
              </div>
            }
          </Col>
          {
            label && (
              <PermissibleRender
                userPermissions={permissions[currentUserRoleName]}
                requiredPermissions={createRequiredPermissions || permissions[currentUserRoleName]}
              >
                <Col xs={12} sm={12} md={2} lg={4} className="pr-0">
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
  label: PropTypes.string
};

export default withCurrentUser(BasicListToolbar);
