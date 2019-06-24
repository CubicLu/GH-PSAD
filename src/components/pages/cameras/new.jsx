import React from 'react';
import { Col, Form, FormGroup, Input, Label, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { create } from 'api/camera';
import { setRecord } from 'actions/camera';
import { btnSpinner } from 'components/helpers';
import { fromJson as showErrors } from 'components/helpers/errors';

class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      name: '',
      stream: '',
      login: '',
      password: '',
      parking_lot_id: '',
      errors: {}
    }
  }

  saveRecord = event => {
    event.preventDefault();

    const { name, stream, login, password, parking_lot_id } = this.state;

    this.setState({ isFetching: true });
    create({ name, stream, login, password, parking_lot_id })
      .then(this.handleCreate);
  };

  handleCreate = res => {
    const { backPath, history, setRecord } = this.props;

    if (res.ok) {
      res.json().then(json => {
        setRecord(json);
        history.push(backPath);
      })
    } else {
      res.json().then(json => this.setState({ errors: json.errors }));
    }

    this.setState({ isFetching: false });
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  render() {
    const { backPath } = this.props;

    return (
      <Card>
        <CardHeader>New Camera</CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          <fieldset disabled={this.state.isFetching}>
            <Form>
              <FormGroup row>
                <Label for="name" sm={2}>Name</Label>
                <Col sm={10}>
                  <Input id="name" value={this.state.name} onChange={this.onInputChange}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="stream" sm={2}>Stream</Label>
                <Col sm={10}>
                  <Input id="stream" value={this.state.stream} onChange={this.onInputChange}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="login" sm={2}>Login</Label>
                <Col sm={10}>
                  <Input id="login" value={this.state.login} onChange={this.onInputChange}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="password" sm={2}>Password</Label>
                <Col sm={10}>
                  <Input id="password" type="password" value={this.state.password} onChange={this.onInputChange}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="parking_lot_id" sm={2}>Parking Lot</Label>
                <Col sm={10}>
                  <Input id="parking_lot_id" value={this.state.parking_lot_id} onChange={this.onInputChange}/>
                </Col>
              </FormGroup>
              <Link to={backPath} className="btn btn-primary mr-1">Back</Link>
              <Button onClick={this.saveRecord} color="success" type="submit">
                {this.state.isFetching ? btnSpinner() : 'Save'}
              </Button>
            </Form>
          </fieldset>
        </CardBody>
      </Card>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setRecord }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(New);
