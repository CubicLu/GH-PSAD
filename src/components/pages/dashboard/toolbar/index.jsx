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

      <Row className="w-100 px-3 justify-content-between " sm="12">
        <Col sm={12} lg={4} className={`${styles.title} mt-2 align-items-center d-flex pb-1 pl-0`}>
          <h4 className="text-nowrap d-inline-block">
            Dashboard
          </h4>
          <Button onClick={() => filter()} size="sm" outline color="primary" className="general-text-1 py-2 px-5 ml-3 ">
            <FontAwesomeIcon icon={faSync} className="pointer mr-2"/>
            <span className="">Refresh</span>
          </Button>
        </Col>
        <Col sm={12} lg={4} className="justify-content-center mt-2 pb-1 pr-0 align-items-center pr-0 d-flex">
          <Col className={`${styles.filterContainer} ${styles.search} m-0 align-items-center justify-content-end d-flex pr-0`} xs={12}>
            <input className="form-control" type="text" onChange={(e) => search(e.target.value)} placeholder="Search by keyword" />
            <FontAwesomeIcon className={`${styles.magnifier}`} color="grey" icon={faSearch} />
          </Col>
        </Col>
        <Col sm={12} lg={4} className="justify-content-center mt-2 pb-1 pr-0 align-items-center pr-0">
          <Col className={`${styles.filterContainer} m-0 align-items-center d-flex pr-0`} xs={12}>
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
              <Button
                onClick={this.resetDate}
                className="float-left bg-grey-dark text-nowrap ml-1 px-5 py-2 d-none d-sm-block"
              >
                Clear filters
              </Button>
          </Col>
        </Col>
        <DateModal isOpen={modalIsOpen} apply={this.dateModalApply} toggleModal={() => this.setState({ modalIsOpen: false })} />
      </Row>
    );
  }
}

Toolbar.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setList: PropTypes.func.isRequired,
  label: PropTypes.string
};

export default Toolbar;
