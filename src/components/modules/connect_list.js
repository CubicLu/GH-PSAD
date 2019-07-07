import { setList } from 'actions/entities';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'underscore';
import { connect } from 'react-redux';
import withFetching from 'components/modules/with_fetching';
import { list as selectList } from 'selectors/list';

const connectList = (entity_name, action_type, fetcher, Component) => {
  function mapState(state) {
    return state[entity_name].index;
  }

  function mapDispatch(dispatch) {
    return bindActionCreators({ setList: setList(action_type) }, dispatch);
  }

  function fetchData(wrapper) {
    if (!isEmpty(wrapper.props.list)) {
      wrapper.fetchFinished();
      return;
    }

    fetcher()
      .then(res => wrapper.props.setList(selectList(res)))
      .catch(err => console.error(err))
      .finally(wrapper.fetchFinished)
  }

  return connect(
    mapState,
    mapDispatch
  )(withFetching(Component, fetchData));
};

export default connectList;
