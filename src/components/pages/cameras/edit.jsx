import React from 'react';
import { Col, Form, FormGroup, Input, Label, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { generatePath } from 'react-router';
import { show, update } from 'api/cameras';
import { btnSpinner } from 'components/helpers';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/cameras';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    }
  }


  componentWillReceiveProps(nextProps, nextContext) {
    const { record } = nextProps;
    if (record) this.setState(record);
  }

  updateRecord = event => {
    event.preventDefault();

    const { id } = this.props.match.params;
    const { name, stream, login, password } = this.state;

    this.setState({ isFetching: true });
    update(id, { name, stream, login, password })
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

  renderRecord() {
    const { record, backPath } = this.props;

    return (
      <Card>
        <CardHeader>Edit Camera</CardHeader>
        <CardBody>
          <fieldset disabled={this.state.isFetching}>
            <Form>
              <FormGroup row>
                <Label for="name" sm={2}>Name</Label>
                <Col sm={10}>
                  <Input id="name" value={this.state.name}
                         onChange={event => this.setState({ name: event.target.value })}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="stream" sm={2}>Stream</Label>
                <Col sm={10}>
                  <Input id="stream" value={this.state.stream}
                         onChange={event => this.setState({ stream: event.target.value })}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="login" sm={2}>Login</Label>
                <Col sm={10}>
                  <Input id="login" value={this.state.login}
                         onChange={event => this.setState({ login: event.target.value })}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="password" sm={2}>Password</Label>
                <Col sm={10}>
                  <Input id="password" type="password" value={this.state.password}
                         onChange={event => this.setState({ password: event.target.value })}/>
                </Col>
              </FormGroup>
              <Link to={generatePath(backPath, { id: record.id })} className="btn btn-primary mr-1">Back</Link>
              <Button onClick={this.updateRecord} color="success" type="submit">
                {this.state.isFetching ? btnSpinner() : 'Update'}
              </Button>
            </Form>
          </fieldset>
        </CardBody>
      </Card>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('camera', SET_RECORD, show, Edit);
