import fetchApi from 'components/modules/fetch_api';

const search = (fieldName, query = {}) => {
  return fetchApi(`dashboard/dropdowns/${fieldName}`, { method: 'GET', params: { ...query } });
};

export { search };
