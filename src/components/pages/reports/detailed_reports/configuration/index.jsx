import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import styles from './configuration.module.sass';
import DateInput from 'components/base/date_input';
import Dropdown from 'components/base/dropdown';
import { ReactComponent as InfoIcon } from 'assets/info_icon.svg';

const Configuration = ({ name, title, config, onConfigChange, parkingLots, defaultParkingLot }) => {
  const [parkingLot, setParkingLot] = useState(defaultParkingLot);
  const handleDateChange = (from, to) => {
    onConfigChange(name, { range: { from, to } });
  };
  const handleParkingLotChange = (parkingLot) => {
    setParkingLot(parkingLot);
    onConfigChange(name, { parking_lot_ids: parkingLot.value === 0 ? [] : [parkingLot.value] });
  };
  return (
    <Col xs="12" className="col-lg">
      <Row className={styles.configLabelWrapper}>
        <Col className="d-flex align-items-center">
          <span className={`general-text-1 ${styles.configLabel}`}>
            {title}
          </span>
          <InfoIcon width="14" height="14" />
        </Col>
      </Row>
      <Row className="no-gutters">
        <Col>
          <DateInput
            className={styles.configDatePicker}
            from={config.range.from}
            to={config.range.to}
            onChange={handleDateChange}
          />
          <span className={`general-text-2 ${styles.configNote}`}>
            *Maximum of 10
          </span>
        </Col>
        <Col className={`${styles.configSplitter} col-auto`} />
        <Col>
          <Dropdown
            options={parkingLots}
            value={parkingLot}
            onChange={handleParkingLotChange}
            size="sm"
          />
        </Col>
      </Row>
    </Col>
  );
};

Configuration.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onConfigChange: PropTypes.func.isRequired,
  parkingLots: PropTypes.array,
  defaultParkingLot: PropTypes.object
};

export default Configuration;
