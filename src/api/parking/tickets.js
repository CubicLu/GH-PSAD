import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';
const resources = 'parking/tickets'
const { show, update } = resourceApi(resources);

function statuses() {
  return fetchApi(`dashboard/parking/tickets/statuses`, { method: 'GET', params: {  } });
}
const index = (params = {}) => {
  const { page, perPage, agency_id, query } = params;
  return fetchApi(`dashboard/${resources}`, { method: 'GET', params: { page, perPage, agency_id, ...query} });
};

const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {}, agency_id } = params
  return index({
    page,
    perPage,
    agency_id: agency_id,
    query: {
      ...query,
      ticket_id: filters.ticket_id,
      admin_ids: filters.admin_ids,
      type: filters.type,
      query: filters.query,
      status: filters.status,
      'range[from]': filters.range ? filters.range.from : null,
      'range[to]': filters.range ? filters.range.to : null
    }
  });
}


export { filterFetcher, show, update, statuses };
