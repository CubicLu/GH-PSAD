import React from 'react';
import { btnSpinner } from 'components/helpers';
import { Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { Form } from 'informed';
import { fields } from 'components/helpers/parking_lots';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/parking_lots';
import resourceFetcher from 'components/modules/resource_fetcher';
import { show, update } from 'api/parking_lots';
import { NavLink } from 'react-router-dom';
import updateRecord from 'components/modules/form_actions/update_record';
import { renderFields, renderButtons, renderField } from 'components/base/form';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    }
  }

  onSubmit = () => {
    return updateRecord.bind(this, update, '/dashboard/parking_lots')
  };

  renderFields() {
    const step = 4;
    let start = 0;
    let fieldList = [];

    while (start < fields.length) {
      fieldList.push((<Col key={start} md={4}>{renderFields(fields.slice(start, start + step), fieldProps)}</Col>));
      start += step;
    }

    return fieldList;
  }

  renderRecord() {
    const { match, record, backPath } = this.props;
    const { isFetching } = this.state;

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
          <fieldset disabled={isFetching}>
            <Form initialValues={record} onSubmit={this.onSubmit()}>
              {
                ({ formState }) => (
                  <React.Fragment>
                    <Row>
                      <Col md={4}>
                        {renderField({ name: 'avatar', type: 'file' }, fieldProps)}
                      </Col>
                    </Row>
                    <Row>
                      {this.renderFields()}
                    </Row>
                    {renderButtons(formState, { isFetching, backPath })}
                  </React.Fragment>
                )
              }
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

const fieldProps = { lSize: 6 };

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), Edit);
