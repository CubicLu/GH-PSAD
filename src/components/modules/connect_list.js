import { list as selectList } from 'selectors/list';
import fetchData from './fetch_data';

const connectList = (entity, actionType, fetcher, Component) => {
  const prop = 'list';
  const action = 'setList';
  const processResponse = res => selectList(res);

  const mapState = state => state[entity].index;

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      actionType,
      prop,
      action,
      processResponse
    }
  );
};

export default connectList;
