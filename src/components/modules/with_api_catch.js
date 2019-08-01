import store from 'index';
import { clearToken } from 'actions/users';

const withApiCatch = promise => (
  promise
    .then(res => res)
    .catch(err => {
      switch (err.response.status) {
        case 401:
          store.dispatch(clearToken);
          break;
        default:
      }
      throw err
    })
)


export default withApiCatch;
