import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, create } = resourceApi('parking_lots');

const updateMap = (params = {}) => {
  const { mapBase64, id } = params
  return fetchApi(`dashboard/parking_lots/${id}/map`, { method: 'PUT', data: { map: mapBase64 } });
}


const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {} } = params;

  return index({
    page,
    perPage,
    query: {
      ...query,
      id: filters.id,
      status: filters.status,
      parking_admins: filters.parking_admins,
      town_managers: filters.town_managers,
      query: {
        parking_lots: {
          email: filters.email,
          name: filters.name ? encodeURIComponent(filters.name) : '',
          phone: filters.phone
        },
        locations: {
          full_address: filters.full_address
        }
      }
    }
  });
};

export { filterFetcher, show, update, create, updateMap };
