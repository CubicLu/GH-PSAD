import resourceApi from 'components/modules/resource_api';
const { index, show, update, destroy, create } = resourceApi('parking_lots');
export { index, show, update, destroy, create };
