import { list as selectList } from 'selectors/list';
import fetchData from './fetch_data';

const connectList = (entity, actionType, fetcher, Component) => {
  const prop = 'list';
  const action = 'setList';

  const mapState = state => state[entity].index;

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      actionType,
      prop,
      action,
      selector: selectList
    }
  );
};

export default connectList;
