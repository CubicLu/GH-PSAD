import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Card, CardHeader, CardBody, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { show } from 'api/parking_lots';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/parking_lots';
import { fields } from 'components/helpers/parking_lots';

class Show extends React.Component {
  render() {
    return null;
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })
};

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), Show);
