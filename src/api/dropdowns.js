import fetchApi from 'components/modules/fetch_api';

const search = (fieldName) => {
  return fetchApi(`dashboard/dropdowns`, { method: 'GET', params: { fieldName } });
};

export { search };
