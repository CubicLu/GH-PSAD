import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Card, CardHeader, CardBody, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { show } from 'api/parking_lots';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/parking_lots';

class Show extends React.Component {
  renderRecord () {
    const { record, backPath, match } = this.props;

    return (<Card>
      <CardHeader>
        <Row>
          <Col sm={2}>
            {record.name}
          </Col>
          <Col sm={{ size: 2, offset: 3 }}>
            ID: {record.id}
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Form>
          <Link to={backPath} className='btn btn-primary mr-1'>Back</Link>
          <Link to={`${match.url}/edit`} className='btn btn-primary'>Edit</Link>
        </Form>
      </CardBody>
    </Card>);
  }

  render () {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
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
