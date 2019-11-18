import fetchApi from 'components/modules/fetch_api';

const index = (params = {}) => {
  const { page, perPage, query } = params;
  return fetchApi(`dashboard/parking_rules`, { method: 'GET', params: { page, perPage, ...query } });
};

const update = (params = {}) => {
  const { page, perPage, parking_lot_id, query } = params;
  return fetchApi(`dashboard/parking_rules`, { method: 'PUT', params: { page, perPage, ...query, parking_lot_id } });
};

export { index, update };
