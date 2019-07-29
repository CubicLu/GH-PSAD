import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Form } from 'informed';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    };
  }


  render() {
    const { match, record, backPath } = this.props;
    const { isFetching } = this.state;

    return (
      <Card>
        <CardHeader>

        </CardHeader>
        <CardBody>
          <fieldset disabled={isFetching}>
            <Form>
              {
                ({ formState }) => (
                  <React.Fragment>
                    {/*<Row>*/}
                      {/*<Col md={4}>*/}
                        {/*{renderField({ name: 'avatar', type: 'file' }, fieldProps)}*/}
                      {/*</Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                      {/*{this.renderFields()}*/}
                    {/*</Row>*/}
                    {/*{renderButtons(formState, { isFetching, backPath })}*/}
                  </React.Fragment>
                )
              }
            </Form>
          </fieldset>
        </CardBody>
      </Card>
    );
  }
}
// export default connectRecord('parking/setting', SET_RECORD, resourceFetcher(show), Edit);
export default connect()(Edit);
