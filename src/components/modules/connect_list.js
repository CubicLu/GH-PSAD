import { list as selectList } from 'selectors/list';
import fetchData from './fetch_data';

const defaultProcessor = res => selectList(res);
const defaultMapper = entity => state => state[entity].index;


const connectList = (entity, actionType, fetcher, Component, props = {}) => {
  const {
    prop = 'list',
    action = 'setList',
    mapState = defaultMapper(entity),
    mapDispatch,
    processResponse = defaultProcessor
  } = props;

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      mapDispatch,
      actionType,
      prop,
      action,
      processResponse
    }
  );
};

export default connectList;
