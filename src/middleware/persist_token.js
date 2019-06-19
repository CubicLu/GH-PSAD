/*eslint default-case: "off"*/
import {ON_INIT, UserActions} from "actions";

const persistTokenMiddleware = _ => next => action => {
  switch (action.type) {
    case ON_INIT:
      // TODO: add token verification logic here (via fetch 'verify-token')
      const token_payload = localStorage.getItem("TOKEN");

      if (token_payload) {
        return next(UserActions.setToken(token_payload));
      } else {
        return next(action);
      }
    case UserActions.SET_TOKEN:
      localStorage.setItem("TOKEN", action.payload);
  }

  return next(action);
};

export default persistTokenMiddleware;
