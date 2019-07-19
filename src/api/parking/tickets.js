import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';
const resources = 'parking/tickets'
const { show, update } = resourceApi(resources);

function statuses() {
  return fetchApi(`dashboard/parking/tickets/statuses`, { method: 'GET', params: {  } });
}
const index = (params = {}) => {
  const { page, perPage, agency_id } = params;
  return fetchApi(`dashboard/${resources}`, { method: 'GET', params: { page, perPage, agency_id } });
};

export { index, show, update, statuses };
