import React from 'react';
import PropTypes from 'prop-types';
import List from '../list';
/* Actions */
import { SET_LIST } from 'actions/parking_lots/voi';
/* API */
import { index } from 'api/parking_lots/voi';
/* Base */
/* Helpers */
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';

const Index = props => {
  const { list, isFetching } = props;
  return isFetching ? <div>Loading data...</div> : <List list={list} />;
};

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  isFetching: PropTypes.bool
};

export default connectList('voi', SET_LIST, resourceFetcher(index), Index);
