import React from 'react';
import connectList from 'components/modules/connect_list';
import { SET_LIST } from 'actions/parking_lots/voi';
import { index } from 'api/parking_lots/voi';
import resourceFetcher from 'components/modules/resource_fetcher';
import List from '../list';

const Index = props => {
  const { list, isFetching } = props;
  return isFetching ? <div>Loading data...</div> : <List list={list} />
};

export default connectList('voi', SET_LIST, resourceFetcher(index), Index);
