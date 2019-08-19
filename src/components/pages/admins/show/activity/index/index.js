import React from 'react';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';

class Index extends React.Component {
  render () {
    return (
      <Card>
        <CardHeader>
          Acitvity/Logs
        </CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Result</th>
                <th>Description</th>
                <th>Parking Slot</th>
              </tr>
            </thead>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

export default Index;
