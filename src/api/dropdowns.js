import fetchApi from 'components/modules/fetch_api';

const search = (field_name) => {
  return fetchApi(`dashboard/dropdowns`, { method: 'GET', params: { field_name } });
};

export { search }