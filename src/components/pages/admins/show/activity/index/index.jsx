import React from 'react';
import { Table } from 'reactstrap';

class Index extends React.Component {
  render () {
    return (

      <Table className="bg-dark text-white mt-5">
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
    );
  }
}

export default Index;
