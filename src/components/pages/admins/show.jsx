import React from 'react';
import { Col, Form, FormGroup, Input, Label, Card, CardHeader, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { show } from 'api/admins';
import { SET_RECORD } from 'actions/admins'; 
import { displayUnixTimestamp } from 'components/helpers';
import connectRecord from 'components/modules/connect_record';
import { index } from 'api/roles';
import humanizeString from 'humanize-string';

class Show extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: []
    }
  }
  
  componentDidMount() {
    // Index Roles
    index()
      .then(response => {
        this.setState({roles: response.data});
      })
  }
  
  renderRecord() {
    const { record, backPath, match } = this.props; 
    return (<Card>
      <CardHeader>{record.email}</CardHeader>
      <CardBody>
        <Form>
          <FormGroup row>
            <Label for="email" sm={2}>Email</Label>
            <Col sm={10}>
              <Input id="email" plaintext readOnly value={record.email}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="username" sm={2}>Username</Label>
            <Col sm={10}>
              <Input id="username" plaintext readOnly value={record.username}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="name" sm={2}>Name</Label>
            <Col sm={10}>
              <Input id="name" plaintext readOnly value={record.name}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="phone" sm={2}>Phone</Label>
            <Col sm={10}>
              <Input id="phone" plaintext readOnly value={record.phone}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="role" sm={2}>Role</Label>
            <Col sm={10}>
              <Input id="role" plaintext readOnly value={showRoleName(this.state.roles, record.role_id)}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="status" sm={2}>Status</Label>
            <Col sm={10}>
              <Input id="status" plaintext readOnly value={record.status}/>
            </Col>
          </FormGroup>
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

function showRoleName(roles, role_id) {
  if (roles.length) {
    const role = roles.find(role => role.id == role_id)
    if (role) {
      return humanizeString(role.name)
    }
  } 
}

export default connectRecord('admin', SET_RECORD, show, Show);
