import React from 'react';
import { Col, FormGroup, Input, Label } from 'reactstrap';

const parkingLot = lot => {
  if (!lot) return;
  return (
    <FormGroup row>
      <Label for="parking_lot" sm={2}>Parking Lot</Label>
      <Col sm={10}>
        <Input id="parking_lot" plaintext readOnly value={lot.name}/>
      </Col>
    </FormGroup>
  );
};

const fields = () => [
  { name: 'name', mandatory: true },
  { name: 'stream', mandatory: true },
  { name: 'login' },
  { name: 'password' },
  { name: 'parking_lot_id',  mandatory: true }
];

const showFields = () => [
  { name: 'name', label: 'Name' },
  { name: 'stream', label: 'Stream' },
  { name: 'login', label: 'Login' },
  { name: 'password', label: 'Password' },
  { name: 'parking_lot.id', label: 'Parking Lot' },
  { name: 'created_at', label: 'Created At' },
  { name: 'updated_at', label: 'Updated At' }
];

const filterFields = () => [
  { name: 'name', label: 'Name' },
  { name: 'stream', label: 'Stream' },
  { name: 'parking_lot', label: 'Parking Lot' }
]

export { parkingLot, fields, showFields, filterFields};
