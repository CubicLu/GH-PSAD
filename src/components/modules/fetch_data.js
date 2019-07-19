import { bindActionCreators } from 'redux';
import { isEmpty } from 'underscore';
import { connect } from 'react-redux';
import { invoke } from 'actions';
import withFetching from 'components/modules/with_fetching';

const fetchData = props => {
  const { Component, fetcher, action, actionType, prop, mapState } = props;
  let { processResponse } = props;

  if (!processResponse) {
    processResponse = res => res.data;
  }

  const mapDispatch = dispatch => {
    return bindActionCreators({ [action]: invoke(actionType) }, dispatch);
  };

  const fetch = wrapper => {
    const fetchCondition = isEmpty(wrapper.props[prop]);
    fetcher(wrapper, fetchCondition, res => wrapper.props[action](processResponse(res)));
  };

  return connect(
    mapState,
    mapDispatch
  )(withFetching(Component, fetch));
};

export default fetchData;
