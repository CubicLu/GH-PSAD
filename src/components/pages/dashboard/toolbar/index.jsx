import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Input from 'components/base/input';
import DateInput from 'components/base/date_input';
import { ReactComponent as SearchIcon } from 'assets/search_icon.svg';

import styles from './toolbar.module.sass';

class Toolbar extends React.Component {
  handleDateFilterChange = (from, to) => {
    const { filter, resetFilter } = this.props;
    if (!from || !to) {
      resetFilter();
      return;
    }
    filter(from, to);
  }

  render () {
    const { dateRange, search, refresh } = this.props;
    const { from, to } = dateRange;

    return (
      <Row className={`${styles.toolBar} w-100 align-items-center m-0`} sm="12">
        <Col className={`${styles.title} col-auto align-items-center d-flex px-0`}>
          <span className="text-nowrap d-inline-block">
            Dashboard
          </span>
          <Button onClick={refresh} outline color="primary" className={`general-text-1 ${styles.btnRefresh}`}>
            <FontAwesomeIcon icon={faSync} className="pointer mr-2"/>
            <span>Refresh</span>
          </Button>
        </Col>
        <Col className="col-auto ml-auto d-flex px-0">
          <Input
            onChange={search}
            placeholder="Search by keyword"
            icon={<SearchIcon />}
          />
          <DateInput
            modalTitle="All Reports"
            from={from}
            to={to}
            onChange={this.handleDateFilterChange}
            className={styles.inputDate}
          />
        </Col>
      </Row>
    );
  }
}

Toolbar.propTypes = {
  dateRange: PropTypes.object.isRequired,
  filter: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired
};

export default Toolbar;
