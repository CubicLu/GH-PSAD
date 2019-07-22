import React from 'react';
import { Col, Card, CardHeader, CardBody, Row, Nav } from 'reactstrap';
import { generatePath, NavLink } from 'react-router-dom';
import { show } from 'api/parking_lots';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/parking_lots';
import { fields } from 'components/helpers/parking_lots';
import ReadonlyForm from 'components/base/readonly_form';

class Show extends React.Component {
  renderRecord() {
    const { record, backPath, match } = this.props;
    const showPath = generatePath(match.path, { id: record.id });

    return (<Card>
      <CardHeader>
        <Row>
          <Col sm={2} className="align-self-center">
            {record.name}
          </Col>
          <Col sm={{ size: 2, offset: 3 }} className="align-self-center">
            ID: {record.id}
          </Col>
          <Nav pills>
            <NavLink to={showPath} className="nav-link">Information</NavLink>
            <NavLink to={`${showPath}/rules`} className="nav-link">Parking Rules</NavLink>
            <NavLink to={`${showPath}/spaces`} className="nav-link">Parking Spaces</NavLink>
          </Nav>
        </Row>
      </CardHeader>
      <CardBody>
        <ReadonlyForm backPath={backPath} match={match} values={record} fields={fields} />
      </CardBody>
    </Card>);
  }

  render() {
    return this.props.isFetching ? (<div>Loading data...</div>) : this.renderRecord();
  }
}

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), Show);
