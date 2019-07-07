import env from '.env';
import axios from 'axios';
import withApiCatch from './with_api_catch';

const fetchApi = (endpoint, data) => {
  return withApiCatch(
    axios(Object.assign({
        url: `${env.backend_url}/${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.TOKEN
        }
      }, data)
    )
  );
};

export default fetchApi;
