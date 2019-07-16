import { list as selectList } from 'selectors/list';
import fetchData from './fetch_data';

const connectList = (entity_name, action_type, fetcher, Component) => {
  const prop = 'list';
  const action = 'setList';

  const mapState = state => state[entity_name].index;

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      action_type,
      prop,
      action,
      selector: selectList
    }
  );
};

export default connectList;
