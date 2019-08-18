import { bindActionCreators } from 'redux';
import { isEmpty } from 'underscore';
import { connect } from 'react-redux';
import { invoke } from 'actions';
import withFetching from 'components/modules/with_fetching';

const defaultProcessor = res => res.data;
const defaultDispatch = (action, actionType) => dispatch => (
  bindActionCreators({ [action]: invoke(actionType) }, dispatch)
);

const fetchData = props => {
  const { Component, fetcher, action, actionType, prop } = props;
  const { processResponse = defaultProcessor } = props;
  const { mapState, mapDispatch = defaultDispatch(action, actionType) } = props;

  const fetch = wrapper => {
    const fetchCondition = isEmpty(wrapper.props[prop]);

    fetcher(wrapper, fetchCondition, res => {
      try {
        wrapper.props[action](processResponse(res));
      } catch (exc) {
        console.error(exc.message);
      }
    });
  };

  return connect(
    mapState,
    mapDispatch
  )(withFetching(Component, fetch));
};

export default fetchData;
