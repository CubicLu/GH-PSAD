import fetchApi from 'components/modules/fetch_api';

const show = (params = {}) => {
  const { id } = params;
  return fetchApi(`dashboard/parking_sessions/${id}`, { method: 'GET' });
};

const index = (params = {}) => {
  const { page, perPage, parkingLotId } = params;
  return fetchApi(`dashboard/parking_sessions`, { method: 'GET', params: { page, perPage, parking_lot_id: parkingLotId } });
};

const filterFetcher = (params = {}) => {
  const { page, perPage, id } = params;

  return index({
    page,
    perPage,
    parkingLotId: id
  });
};

export { filterFetcher, show };
