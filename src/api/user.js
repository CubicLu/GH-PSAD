import env from '.env';
import fetch from 'cross-fetch';

function authFetch(username, password) {
  return fetch(`${env.backend_url}/dashboard/auth/sign_in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
}

export { authFetch };
