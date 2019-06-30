/*eslint default-case: "off"*/
import {INIT, UserActions} from "actions";

const persistTokenMiddleware = _ => next => action => {
  switch (action.type) {
    case INIT:
      // TODO: add token verification logic here (via fetch 'verify-token')
      const token_payload = localStorage.TOKEN;

      if (token_payload) {
        return next(UserActions.setToken(token_payload));
      } else {
        return next(action);
      }
    case UserActions.SET_TOKEN:
      localStorage.setItem("TOKEN", action.payload);
      break;
    case UserActions.CLEAR_TOKEN:
      localStorage.removeItem("TOKEN");
  }

  return next(action);
};

export default persistTokenMiddleware;
