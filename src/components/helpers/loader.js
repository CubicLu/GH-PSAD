import React from 'react';
import { Spinner } from 'reactstrap';

const Loader = () => (
  <div className="d-flex justify-content-center align-items-center flex-column pb-2">
    <div className="text-center">Loading...</div>
    <Spinner color="primary" size="lg" />
  </div>
);

export default Loader;
