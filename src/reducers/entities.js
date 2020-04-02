const reduceEntity = actions => {
  const index = (state = { list: [], total: 0, perPage: 10, page: 1 }, action) => {
    switch (action.type) {
      case actions.SET_LIST:
        return Object.assign({}, state, action.payload);
      case actions.SET_LIST_ELEMENT:
        return Object.assign({}, state, {
          list: state.list.map(element => (
            action.payload.id !== element.id ? element : action.payload
          ))
        });
      case actions.POP_LIST_ELEMENT:
        return Object.assign({}, state, {
          list: state.list.filter(element => (
            action.payload.id === element.id
          ))
        });
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
