import fetchData from './fetch_data';

const connectRecord = (entity_name, action_type, fetcher, Component) => {
  const prop = 'record';
  const action = 'setRecord';

  const mapState = (state, ownProps) => {
    const { params } = ownProps.match;
    const { records } = state[entity_name];
    return { [prop]: records[params.id] };
  };

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      prop,
      action_type,
      action
    }
  );
};

export default connectRecord;
