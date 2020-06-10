import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Badge, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faFilter, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import DateModal from '../date_modal'

import styles from './toolbar.module.sass'

class Toolbar extends React.Component {
  state = {
    modalIsOpen: false,
    dateBadgesFilter: null
  }

  resetDate = () => {
    const { dateBadgesFilter } = this.state
    const { resetFilter } = this.props
    if(dateBadgesFilter) {
      this.setState({dateBadgesFilter: null})
      resetFilter()
    }
  }

  dateModalApply = (from, to) => {
    const { filter } = this.props
    this.setState({
      modalIsOpen: false,
      dateBadgesFilter: `${moment(from).format('MMM Do YYYY')}-${moment(to).format('MMM Do YYYY')}`
    })
    filter(from, to)
  }

  render() {
    const {
      filter,
      search
    } = this.props;

    const { modalIsOpen, dateBadgesFilter } = this.state

    return (

      <Row className={`${styles.toolBar} w-100 align-items-center m-0`} sm="12">
        <Col className={`${styles.title} col-auto align-items-center d-flex px-0`}>
          <span className="text-nowrap d-inline-block">
            Dashboard
          </span>
          <Button onClick={() => filter()} outline color="primary" className={`general-text-1 ${styles.btnRefresh}`}>
            <FontAwesomeIcon icon={faSync} className="pointer mr-2"/>
            <span className="">Refresh</span>
          </Button>
        </Col>
        <Col className="justify-content-center col-auto ml-auto align-items-center d-flex px-0">
          <Col className={`${styles.search} col-auto align-items-center justify-content-end d-flex px-0 ml-0`}>
            <input className="form-control" type="text" onChange={(e) => search(e.target.value)} placeholder="Search by keyword" />
            <FontAwesomeIcon className={`${styles.magnifier}`} color="grey" icon={faSearch} />
          </Col>
          <Col className="col-auto m-0 align-items-center d-flex px-0">
            <div className={`${styles.filterBox} shadow d-inline-block float-right`}>
              <span className="general-text-3 mr-3">Filter By</span>
              {
                dateBadgesFilter && (
                  <Button onClick={this.resetDate} color="secondary" className="mr-3" >
                    {dateBadgesFilter} <Badge color="secondary"> <FontAwesomeIcon icon={faTimes} /> </Badge>
                  </Button>
                )
              }
              <Button color="dark" onClick={() => this.setState({ modalIsOpen: true })}>
                <FontAwesomeIcon icon={faFilter} />
              </Button>
            </div>
          </Col>
        </Col>
        <DateModal isOpen={modalIsOpen} apply={this.dateModalApply} toggleModal={() => this.setState({ modalIsOpen: false })} />
      </Row>
    );
  }
}

Toolbar.propTypes = {
  filter: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired
};

export default Toolbar;
