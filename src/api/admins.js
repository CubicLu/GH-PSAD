import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, destroy, create } = resourceApi('admins');

const search = (query) => {
  return fetchApi(`dashboard/admins/search`, { method: 'GET', params: { ...query } });
};

function checkAdminPassword (password) {
  return fetchApi(`dashboard/admins/check_password`, { method: 'POST', data: { password } });
}

export { index, show, update, destroy, create, search, checkAdminPassword };
