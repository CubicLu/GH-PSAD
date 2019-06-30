import store from 'index';
import { clearToken } from 'actions/users';

const withApiCatch = promise => {
  return promise.then(res => {
    switch (res.status) {
      case 401:
        store.dispatch(clearToken);
    }

    return res;
  });
};


export default withApiCatch;
