import React from 'react';
import { Col, FormGroup, Input, Label } from 'reactstrap';
import faker from 'faker'

const parkingLot = lot => {
  if (!lot) return;
  return (
    <FormGroup row>
      <Label for="parking_lot" sm={2}>Parking Lot</Label>
      <Col sm={10}>
        <Input id="parking_lot" plaintext readOnly value={lot.name} />
      </Col>
    </FormGroup>
  );
};

const fields = () => [
  { name: 'name', mandatory: true },
  { name: 'stream', mandatory: true },
  { name: 'login' },
  { name: 'password' },
  { name: 'parking_lot_id', mandatory: true }
];

const fieldsStream = () => [
  { name: 'Stream Name', label: 'Name', mandatory: true },
  { name: 'IP Address', label: 'IP Adress', mandatory: true },
  { name: 'Server', label: 'Server', mandatory: true },
  { name: 'Other required Information', label: 'Other required Information' },
]

const streamHeading = () => [
  { name: 'Please Enter the folowing information to connect to the camera and add it to your live footage' },

];

const showFields = () => [
  { name: 'name', label: 'Name' },
  { name: 'stream', label: 'Stream' },
  { name: 'login', label: 'Login' },
  { name: 'password', label: 'Password' },
  { name: 'parking_lot_id', label: 'Parking Lot' },
  { name: 'created_at', label: 'Created At' },
  { name: 'updated_at', label: 'Updated At' }
];

const filterFields = () => [
  { name: 'name', label: 'Name' },
  { name: 'id', label: 'Parking Lot' },
  { name: 'city', label: 'Location' },
  { name: 'available_cameras', label: 'Available Cameras' },
]

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  name: faker.lorem.words(),
  stream: faker.internet.url(),
  login: faker.internet.userName(),
  password: faker.internet.password()
} : {
  } // These are defaults values for each field

export { parkingLot, fields, showFields, filterFields, exampleData, fieldsStream, streamHeading };
