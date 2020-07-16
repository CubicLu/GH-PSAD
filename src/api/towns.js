import resourceApi from 'components/modules/resource_api';

const { index, show, update, create } = resourceApi('towns');


const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {} } = params;

  return index(
      {
    page,
    perPage,
    query: {
      ...query,
      id: filters.id,
      status: filters.status,
    }
  }
  );
};

export { filterFetcher, show, index, create };
