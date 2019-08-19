import React from 'react';
import PropTypes from 'prop-types';
import List from 'components/pages/voi/list';
import CollapsableCard from 'components/base/collapsable_card';

const VoiSection = props => {
  const { records = [] } = props;
  return <CollapsableCard body={<List list={records}/>} header="Vehicles of Interest"/>;
};

VoiSection.propTypes = {
  records: PropTypes.arrayOf(PropTypes.object)
};

export default VoiSection;
