import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, ButtonToolbar, Badge } from 'reactstrap';
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
      <React.Fragment>
        <ButtonToolbar className="pb-1 ml-4">
          <h4>
            { title }
          </h4>
        </ButtonToolbar>
        <ButtonToolbar className="pb-1 mr-4">
          <div className="filter-box shadow">
            <span className="general-text-3 mr-3">Filter By</span>
            {
              badgesFilter().map(element => (
                <Button onClick={() => badgesDelete(element)} key={element} color="secondary" className=" mr-3 general-text-1 btn-badge" >
                  {element.label} <Badge color="secondary"> <FontAwesomeIcon icon={faTimes}/> </Badge>
                </Button>
              ))
            }
            <Button color="dark" onClick={onClickFilter}>
              <FontAwesomeIcon icon={faFilter}/>
            </Button>
         </div>
          {
            label && (
              <PermissibleRender
                userPermissions={permissions[currentUserRoleName]}
                requiredPermissions={createRequiredPermissions || permissions[currentUserRoleName]}
              >
                <ButtonGroup >
                  <Button color="primary-lg" className="btn-md px-4 text-uppercase" onClick={this.newRecord}>{label}</Button>
                </ButtonGroup>
              </PermissibleRender>
            )
          }
        </ButtonToolbar>
      </React.Fragment>
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
