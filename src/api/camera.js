import fetchApi from 'components/modules/fetch_with_headers';

const index = () => {
  return fetchApi('dashboard/cameras', { method: 'GET' });
};

const show = id => {
  return fetchApi(`dashboard/cameras/${id}`, { method: 'GET' });
};

const update = (id, attributes) => {
  return fetchApi(`dashboard/cameras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(attributes)
  })
};

const destroy = id => {
  return fetchApi(`dashboard/cameras/${id}`, {
    method: 'DELETE'
  })
};

const create = attributes => {
  return fetchApi('dashboard/cameras', {
    method: 'POST',
    body: JSON.stringify(attributes)
  })
};

export { index, show, update, destroy, create };
