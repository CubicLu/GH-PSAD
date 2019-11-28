import fetchApi from 'components/modules/fetch_api';

const index = (params = {}) => {
  const { parkingLotId } = params;
  return fetchApi(`dashboard/parking_lots/${parkingLotId}/parking_slots`, { method: 'GET' });
};

export { index };
