import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';

const { index, show, update, create } = resourceApi('agencies');

const search = searchApi('agencies');

export { index, show, update, create, search };
