import env from '.env';
import axios from 'axios';

const auth = (username, password) => {
  return axios.post(`${env.backend_url}/dashboard/auth/sign_in`, { username, password });
};

const sendResetPasswordInstructionsRequest = (username) => {
  return axios.post(`${env.backend_url}/dashboard/auth/send_reset_password_instructions`, { username });
};

const resetPasswordRequest = (password, resetPasswordToken) => {
  return axios.put(`${env.backend_url}/dashboard/auth/reset_password`, { password, reset_password_token: resetPasswordToken });
};

const checkPasswordToken = (token) => {
  return axios.post(`${env.backend_url}/dashboard/auth/check_reset_password_token`, { token });
};

export {
  auth,
  sendResetPasswordInstructionsRequest,
  resetPasswordRequest,
  checkPasswordToken
};
