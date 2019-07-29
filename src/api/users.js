import env from '.env';
import axios from 'axios';

function auth (username, password) {
  return axios.post(`${env.backend_url}/dashboard/auth/sign_in`, { username, password });
}

function sendResetPasswordInstructionsRequest (username) {
  return axios.post(`${env.backend_url}/dashboard/auth/send_reset_password_instructions`, { username });
}

function resetPasswordRequest (password, resetPasswordToken) {
  return axios.put(`${env.backend_url}/dashboard/auth/reset_password`, { password, resetPasswordToken });
}

export {
  auth,
  sendResetPasswordInstructionsRequest,
  resetPasswordRequest
};
