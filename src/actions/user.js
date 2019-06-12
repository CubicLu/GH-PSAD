import fetch from 'cross-fetch';
import env from '.env';

const SET_TOKEN = 'SET_TOKEN';


function authFetch(username, password) {
  return fetch(`${env.backend_url}/dashboard/auth/sign_in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
}

function setToken(token) {
  return {
    type: SET_TOKEN,
    token: token
  }
}


export {SET_TOKEN, authFetch, setToken};
