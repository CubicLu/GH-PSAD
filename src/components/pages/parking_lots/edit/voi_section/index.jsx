import React from 'react';
import List from 'components/pages/voi/list';
import { SET_VOI_LIST, setVoiList } from 'actions/parking_lots';
import { index } from 'api/voi';
import resourceFetcher from 'components/modules/resource_fetcher';
import CollapsableCard from 'components/base/collapsable_card';
import connectList from 'components/modules/connect_list';
import { bindActionCreators } from 'redux';

const VoiSection = props => {
  const { list, isFetching } = props;

  return isFetching ? <div>Loading data...</div> :
    <CollapsableCard body={<List list={list}/>} header="Vehicles of Interest"/>;
};

const mapState = (state, ownProps) => {
  const { voi } = state.parking_lot;
  const { match } = ownProps;
  const { params } = match;
  const { nestedParams } = params;
  return voi[nestedParams.lot_id] || {};
};

const mapDispatch = (dispatch, ownProps) => {
  const { match } = ownProps;
  const { params } = match;
  const { nestedParams } = params;
  return bindActionCreators({ setList: setVoiList(nestedParams.lot_id) }, dispatch)
};

export default connectList(null, SET_VOI_LIST, resourceFetcher(index), VoiSection, { mapState, mapDispatch });
