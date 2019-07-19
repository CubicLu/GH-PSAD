import fetchApi from 'components/modules/fetch_api';

const resourceApi = resources => {
  const index = (params = {}) => {
    const { page, perPage, query } = params;
    return fetchApi(`dashboard/${resources}`, { method: 'GET', params: { page, perPage, ...query } });
  };

  const show = (params = {}) => {
    const { id } = params;
    return fetchApi(`dashboard/${resources}/${id}`, { method: 'GET' });
  };

  const update = (params = {}) => {
    const { id, data } = params;
    return fetchApi(`dashboard/${resources}/${id}`, {
      method: 'PUT',
      data
    })
  };

  const destroy = (params = {}) => {
    const { id } = params;
    return fetchApi(`dashboard/${resources}/${id}`, {
      method: 'DELETE'
    })
  };

  const create = (params = {}) => {
    const { data } = params;
    return fetchApi(`dashboard/${resources}`, {
      method: 'POST',
      data
    })
  };

  return { index, show, update, destroy, create };
};


export default resourceApi;
