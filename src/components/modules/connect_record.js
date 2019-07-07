import { setRecord } from 'actions/entities';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'underscore';
import { connect } from 'react-redux';
import withFetching from 'components/modules/with_fetching';

const connectRecord = (entity_name, action_type, fetcher, Component) => {
  function mapState(state, ownProps) {
    const { params } = ownProps.match;
    const { records } = state[entity_name];
    return { record: records[params.id] };
  }

  function mapDispatch(dispatch) {
    return bindActionCreators({ setRecord: setRecord(action_type) }, dispatch);
  }

  function fetchData(wrapper) {
    if (!isEmpty(wrapper.props.record)) {
      wrapper.fetchFinished();
      return;
    }

    const { params } = wrapper.props.match;

    fetcher(params.id)
      .then(res => wrapper.props.setRecord(res.data))
      .catch(err => console.error(err))
      .finally(wrapper.fetchFinished)
  }

  return connect(
    mapState,
    mapDispatch
  )(withFetching(Component, fetchData));
};

export default connectRecord;
