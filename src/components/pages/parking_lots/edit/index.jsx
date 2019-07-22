import React from 'react';
import { generatePath } from 'react-router';
import { btnSpinner } from 'components/helpers';
import { Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import HorizontalForm from 'components/base/horizontal_form';
import { fields } from 'components/helpers/parking_lots';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/parking_lots';
import resourceFetcher from 'components/modules/resource_fetcher';
import { show, update } from 'api/parking_lots';
import { NavLink } from 'react-router-dom';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    }
  }

  updateRecord = state => {
    const { id } = this.props.match.params;
    this.setState({ isFetching: true });

    update({ id, data: state.values })
      .then(this.updateSucceed)
      .catch(this.updateFailed)
  };

  updateSucceed = res => {
    const { backPath, match, history, setRecord } = this.props;
    const { id } = match.params;

    setRecord(res.data);
    this.setState({ isFetching: false });
    history.push(generatePath(backPath, { id }));
  };

  updateFailed = error => {
    console.error(error.message);
    this.setState({ isFetching: false });
  };

  values = () => {
    const { record } = this.props;
    let values = Object.assign({}, record);
    values.parking_lot_id = record.parking_lot ? record.parking_lot.id : null;
    return values;
  };

  renderRecord() {
    const { match, record } = this.props;

    return (
      <Card>
        <CardHeader>
          <Row>
            <Col sm={2} className="align-self-center">
              Edit {record.name}
            </Col>
            <Col sm={{ size: 2, offset: 3 }} className="align-self-center">
              ID: {record.id}
            </Col>
            <Nav pills>
              <NavLink to={match.url} className="nav-link">Information</NavLink>
              <NavLink to={`${match.url}/rules`} className="nav-link">Parking Rules</NavLink>
              <NavLink to={`${match.url}/spaces`} className="nav-link">Parking Spaces</NavLink>
            </Nav>
          </Row>
        </CardHeader>
        <CardBody>
          <HorizontalForm
            {...this.props}
            values={this.values()}
            fields={fields}
            isFetching={this.state.isFetching}
            submitForm={this.updateRecord}/>
        </CardBody>
      </Card>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), Edit);
