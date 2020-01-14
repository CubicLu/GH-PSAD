import fetchApi from 'components/modules/fetch_api';
import resourceApi from 'components/modules/resource_api';

const { index } = resourceApi('parking_lots');

const show = (params = {}) => {
  const { id } = params;
  return fetchApi(`dashboard/cameras`, { method: 'GET', params: { parking_lot_id: id } });
};

const search = (params = {}) => {
  const { name, id } = params;
  return fetchApi(`dashboard/cameras`, { method: 'GET', params: { parking_lot_id: id, name: name } });
};
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
      available_cameras: filters.available_cameras,
      query: {
        parking_lots: {
          email: filters.email,
          name: filters.name ? encodeURIComponent(filters.name) : '',
          phone: filters.phone,

        },
        locations: {
          full_address: filters.full_address
        }
      }
    }
  });
};
export { show, search, filterFetcher };
