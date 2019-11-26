import fetchApi from 'components/modules/fetch_api';


const show = (params = {}) => {
  const { page, perPage, parking_lot_id, id, query } = params;
  return fetchApi(`dashboard/cameras`, { method: 'GET', params: { parking_lot_id: id } });
};

export { show };
