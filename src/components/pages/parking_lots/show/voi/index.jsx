import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../../shared/header';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/parking_lots';
import { invoke } from 'actions';
/* API */
import { show } from 'api/parking_lots';
/* Base */
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Show extends React.Component {
  state = {
    errors: {}
  };

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    return (
      <Header {...this.props} />
    );
  }
}

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

Show.propTypes = {
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    town_manager: PropTypes.object,
    parking_admin: PropTypes.object,
    vehicle_rules: PropTypes.arrayOf(PropTypes.object),
    setting: PropTypes.object
  })
};

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
