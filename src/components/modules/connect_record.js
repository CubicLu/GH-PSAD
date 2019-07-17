import fetchData from './fetch_data';

const connectRecord = (entity, actionType, fetcher, Component) => {
  const prop = 'record';
  const action = 'setRecord';

  const mapState = (state, ownProps) => {
    const { params } = ownProps.match;
    const { records } = state[entity];
    return { [prop]: records[params.id] };
  };

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      prop,
      actionType,
      action
    }
  );
};

export default connectRecord;
