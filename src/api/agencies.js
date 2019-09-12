import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';

const { index, show, update, create } = resourceApi('agencies');

const search = searchApi('agencies');

const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {} } = params;

  return index({
    page,
    perPage,
    query: {
      ...query,
      'query[agencies.email]': filters.email,
      'query[agencies.name]': filters.name,
      'query[agencies.phone]': filters.phone,
      'query[locations.full_address]': filters.full_address
    }
  });
};

export { filterFetcher, show, update, create, search };
