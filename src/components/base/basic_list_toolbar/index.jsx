import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, ButtonToolbar, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

import './back_list_toolbar.sass'

class BasicListToolbar extends React.Component {
  newRecord = () => {
    const { match, history } = this.props;
    history.push(`${match.path}/new`);
  };

  render () {
    const { label, title, badgesFilter, badgesDelete, onClickFilter } = this.props;
    return (
      <React.Fragment>
        <ButtonToolbar className="pb-1 float-left">
          <h4>
            { title }
          </h4>
        </ButtonToolbar>
        <ButtonToolbar className="pb-1 float-right">
          <div className="filter-box shadow">
            <span className="text-muted mr-3">Filter By</span>
            {
              badgesFilter().map(element => (
                <Button onClick={() => badgesDelete(element)} key={element} color="secondary" className="mr-3" >
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
              <ButtonGroup >
                <Button color="primary" onClick={this.newRecord}>{label}</Button>
              </ButtonGroup>
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
  resourceFetchStarted: PropTypes.func.isRequired,
  fetcher: PropTypes.func,
  setList: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default BasicListToolbar;
