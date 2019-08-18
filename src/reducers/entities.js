const reduceEntity = actions => {
  const index = (state = { list: [], total: 0, perPage: 10, page: 1 }, action) => {
    switch (action.type) {
      case actions.SET_LIST:
        return Object.assign({}, state, action.payload);
      default:
        return state;
    }
  };

  const records = (state = {}, action) => {
    switch (action.type) {
      case actions.SET_RECORD:
        return Object.assign({}, state, {
          [action.payload.id]: action.payload
        });
      default:
        return state;
    }
  };

  return { index, records };
};

export default reduceEntity;
