import resourceApi from 'components/modules/resource_api';
const { index, show, update, destroy, create } = resourceApi('cameras');
export { index, show, update, destroy, create };
