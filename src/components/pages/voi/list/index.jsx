import React from 'react';
import TableRow from 'components/base/parking_lots/voi/table_row';
import { Table } from 'reactstrap';


const List = props => {
  const { list } = props;

  return list.length ? (
    <Table>
      <tbody>
      {list.map((record, idx) => <TableRow key={idx} record={record}/>)}
      </tbody>
    </Table>
  ) : 'No Records';
};

export default List;
