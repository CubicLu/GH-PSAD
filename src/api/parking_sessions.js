import fetchApi from 'components/modules/fetch_api';

const show = (params = {}) => {
  const { id } = params;
  return fetchApi(`dashboard/parking_sessions/${id}`, { method: 'GET' });
};

const index = (params = {}) => {
  const { page, perPage, parkingLotId, query } = params;
  return fetchApi(`dashboard/parking_sessions`, { method: 'GET', params: { page, perPage, parking_lot_id: parkingLotId, ...query } });
};

const filterFetcher = (params = {}) => {
  const { page, perPage, query, id, filters = {} } = params;
  debugger
  return index({
    page,
    perPage,
    query: Object.assign({}, {
      parking_session_id: filters.id,
      query: {
        ...query,
      }
    }),
    parkingLotId: id
  });
};

export { filterFetcher, show };
