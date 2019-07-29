import React from 'react';
import { show } from 'api/parking_lots';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/parking_lots';
import { fields } from 'components/helpers/parking_lots';

class Show extends React.Component {
  render() {
    return null;
  }
}

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), Show);
