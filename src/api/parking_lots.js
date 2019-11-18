import resourceApi from 'components/modules/resource_api';

const { index, show, update, create } = resourceApi('parking_lots');

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
          full_address: filters.full_address,
          city: filters.city
        }
      }
    }
  });
};

export { filterFetcher, show, update, create };
