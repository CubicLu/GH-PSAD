import fetchApi from 'components/modules/fetch_api';

const resourceApi = resources => {
  const index = (page, perPage, query) => {
    return fetchApi(`dashboard/${resources}`, { method: 'GET', params: { page, perPage, query } });
  };

  const show = id => {
    return fetchApi(`dashboard/${resources}/${id}`, { method: 'GET' });
  };

  const update = (id, data) => {
    return fetchApi(`dashboard/${resources}/${id}`, {
      method: 'PUT',
      data
    })
  };

  const destroy = id => {
    return fetchApi(`dashboard/${resources}/${id}`, {
      method: 'DELETE'
    })
  };

  const create = data => {
    return fetchApi(`dashboard/${resources}`, {
      method: 'POST',
      data
    })
  };

  return { index, show, update, destroy, create };
};


export default resourceApi;
