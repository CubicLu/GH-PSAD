import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, create } = resourceApi('parking_lots');

const createParkingPlan = (params = {}) => {
  const { parkingPlanImage, parkingLotId, name } = params;
  return fetchApi(`dashboard/parking_lots/${parkingLotId}/parking_plans`, { method: 'POST', data: { parking_plan_image: parkingPlanImage, name } });
};

const deleteParkingPlan = (params = {}) => {
  const { parkingLotId, parkingPlanId } = params;
  return fetchApi(`dashboard/parking_lots/${parkingLotId}/parking_plans/${parkingPlanId}`, { method: 'DELETE' });
};

const updateParkingPlan = (params = {}) => {
  const { parkingLotId, parkingPlanImage, parkingPlanCoordinates, parkingPlanId, name } = params;
  return fetchApi(`dashboard/parking_lots/${parkingLotId}/parking_plans/${parkingPlanId}`, { method: 'PUT', data: { parking_plan_coordinates: parkingPlanCoordinates, name, parking_plan_image: parkingPlanImage } });
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

export { filterFetcher, show, update, create, createParkingPlan, deleteParkingPlan, updateParkingPlan };
