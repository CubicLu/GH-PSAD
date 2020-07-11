import asyncComponent from './asyncComponent';

const ParkingSpaces = asyncComponent(() => {
  return import(
    '../components/pages/parking_lots/show/parking_spaces/index.jsx'
  );
});

export { ParkingSpaces };
