import env from '.env';
import fetch from 'cross-fetch';

const fetchApi = (endpoint, data) => {
  return fetch(`${env.backend_url}/${endpoint}`, Object.assign({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.TOKEN
    }
  }, data));
};

export default fetchApi;
