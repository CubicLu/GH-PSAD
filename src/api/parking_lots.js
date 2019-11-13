import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, create } = resourceApi('parking_lots');

const createParkingSpace = (params = {}) => {
  const { parkingSpaceImage, parkingLotId } = params;
  return fetchApi(`dashboard/parking_lots/${parkingLotId}/parking_spaces`, { method: 'POST', data: { parking_space_image: parkingSpaceImage } });
};

const deleteParkingSpace = (params = {}) => {
  const { parkingLotId, parkingSpaceId } = params;
  return fetchApi(`dashboard/parking_lots/${parkingLotId}/parking_spaces/${parkingSpaceId}`, { method: 'DELETE' });
};

const updateParkingSpace = (params = {}) => {
  const { parkingLotId, parkingSpaceCoordinates, parkingSpaceId } = params;
  return fetchApi(`dashboard/parking_lots/${parkingLotId}/parking_spaces/${parkingSpaceId}`, { method: 'PUT', data: { parking_space_coordinates: parkingSpaceCoordinates } });
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

export { filterFetcher, show, update, create, createParkingSpace, deleteParkingSpace, updateParkingSpace };
