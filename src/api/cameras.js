import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';

const { index, show, update, destroy, create } = resourceApi('cameras');
const search = searchApi('cameras');

export { index, show, update, destroy, create, search };
