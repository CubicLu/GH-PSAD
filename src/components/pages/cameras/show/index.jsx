import React from 'react';
import { Col, Form, FormGroup, Input, Label, Card, CardHeader, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { show } from 'api/cameras';
import { SET_RECORD } from 'actions/cameras';
import { parkingLot } from 'components/helpers/cameras';
import { displayUnixTimestamp } from 'components/helpers';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';

class Show extends React.Component {
  renderRecord() {
    const { record, backPath, match } = this.props;

    return (<Card>
      <CardHeader>{record.name}</CardHeader>
      <CardBody>
        <Form>
          <FormGroup row>
            <Label for="stream" sm={2}>Stream</Label>
            <Col sm={10}>
              <Input id="stream" plaintext readOnly value={record.stream}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="login" sm={2}>Login</Label>
            <Col sm={10}>
              <Input id="login" plaintext readOnly value={record.login}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="password" sm={2}>Password</Label>
            <Col sm={10}>
              <Input id="password" plaintext readOnly value={record.password}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="created_at" sm={2}>Created At</Label>
            <Col sm={10}>
              <Input id="created_at" plaintext readOnly value={displayUnixTimestamp(record.created_at)}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="updated_at" sm={2}>Updated At</Label>
            <Col sm={10}>
              <Input id="updated_at" plaintext readOnly value={displayUnixTimestamp(record.updated_at)}/>
            </Col>
          </FormGroup>
          {parkingLot(record.parking_lot)}
          <Link to={backPath} className="btn btn-primary mr-1">Back</Link>
          <Link to={`${match.url}/edit`} className="btn btn-primary">Edit</Link>
        </Form>
      </CardBody>
    </Card>);
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Show);
