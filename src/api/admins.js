import resourceApi from 'components/modules/resource_api';
const { index, show, update, destroy, create } = resourceApi('admins');
export { index, show, update, destroy, create };
