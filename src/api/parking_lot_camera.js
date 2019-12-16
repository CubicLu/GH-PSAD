import fetchApi from 'components/modules/fetch_api';

const show = (params = {}) => {
  const { id } = params;
  return fetchApi(`dashboard/cameras`, { method: 'GET', params: { parking_lot_id: id } });
};

const search = (params = {}) => {
  const { name, id } = params;
  return fetchApi(`dashboard/cameras?parking_lot_id=${id}`, { method: 'GET', params: { name: name } });
};

export { show, search };
