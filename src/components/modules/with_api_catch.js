import store from 'index';
import { clearToken } from 'actions/users';
import { notFound, internal } from 'actions/server_errors';

const withApiCatch = promise => {
  return promise.catch(error => {
    const { response } = error;

    switch (response.status) {
      case 401:
        store.dispatch(clearToken);
        break;
      case 404:
        store.dispatch(notFound(error));
        break;
      case 422:
        throw error;
      case 500:
        store.dispatch(internal(error));
        break;
      default:
        console.error(error.toJSON());
    }
  });
};


export default withApiCatch;
