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

export { parkingLot };
