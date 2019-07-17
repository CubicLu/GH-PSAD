import { bindActionCreators } from 'redux';
import { isEmpty } from 'underscore';
import { connect } from 'react-redux';
import { invoke } from 'actions';
import withFetching from 'components/modules/with_fetching';

const fetchData = props => {
  const { Component, fetcher, action, actionType, prop, mapState, selector } = props;

  const mapDispatch = dispatch => {
    return bindActionCreators({ [action]: invoke(actionType) }, dispatch);
  };

  const fetch = wrapper => {
    if (!isEmpty(wrapper.props[prop])) {
      wrapper.fetchFinished();
      return;
    }

    const { params } = wrapper.props.match;

    fetcher(params)
      .then(res => wrapper.props[action](selector ? selector(res) : res.data))
      .catch(err => console.error(err))
      .finally(wrapper.fetchFinished)
  };

  return connect(
    mapState,
    mapDispatch
  )(withFetching(Component, fetch));
};

export default fetchData;
