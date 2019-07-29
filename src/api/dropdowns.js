import fetchApi from 'components/modules/fetch_api';

const search = (fieldName) => {
  return fetchApi(`dashboard/dropdowns/${fieldName}`, { method: 'GET' });
};

export { search };
