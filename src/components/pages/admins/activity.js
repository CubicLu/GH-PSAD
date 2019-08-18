import React from 'react';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';

class ShowActivity extends React.Component {
  render () {
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

export default ShowActivity;
