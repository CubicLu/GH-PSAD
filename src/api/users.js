import env from '.env';
import axios from 'axios';
import fetchApi from 'components/modules/fetch_api';

function auth (username, password) {
  return axios.post(`${env.backend_url}/dashboard/auth/sign_in`, { username, password });
}

function sendResetPasswordInstructionsRequest (username) {
  return axios.post(`${env.backend_url}/dashboard/auth/send_reset_password_instructions`, { username });
}

function resetPasswordRequest (password, resetPasswordToken) {
  return axios.put(`${env.backend_url}/dashboard/auth/reset_password`, { password, reset_password_token: resetPasswordToken });
}

function me () {
  const critical = true;
  return fetchApi(`dashboard/admins/me `, { method: 'GET' }, critical);
}

export {
  auth,
  sendResetPasswordInstructionsRequest,
  resetPasswordRequest,
  me
};
