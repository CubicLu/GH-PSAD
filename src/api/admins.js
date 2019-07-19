import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, destroy, create } = resourceApi('admins');

const search = (query) => {
  return fetchApi(`dashboard/admins/search`, { method: 'GET', params: { ...query } });
};

export { index, show, update, destroy, create, search };
