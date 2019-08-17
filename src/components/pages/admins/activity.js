import React from 'react';
import { Card, CardBody, CardHeader, Row, Table } from 'reactstrap';
import { fields } from 'components/helpers/fields/parking/settings';
import { Form } from 'informed';

class ShowActivity extends React.Component {
  render () {
    const { record, setFormApi } = this.props;

    return (
      <Card>
        <CardHeader>
          Acitvity/Logs
        </CardHeader>
        <CardBody>
          <Table>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Result</th>
              <th>Description</th>
              <th>Parking Slot</th>
            </tr>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

const fieldProps = { lSize: 6 };

export default ShowActivity;
