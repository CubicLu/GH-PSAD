import env from '.env';
import axios from 'axios';

function auth(username, password) {
  return axios.post(`${env.backend_url}/dashboard/auth/sign_in`, { username, password })
}

export { auth };
