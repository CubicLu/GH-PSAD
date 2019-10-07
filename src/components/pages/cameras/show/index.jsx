import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody } from 'reactstrap';
/* Actions */
import { SET_RECORD } from 'actions/cameras';
/* API */
import { show } from 'api/cameras';
/* Base */
import { ShowForm } from 'components/base/forms';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { showFields } from 'components/helpers/fields/cameras';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';

class Show extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  values = () => {
    const { record } = this.props;
    return Object.assign({}, record, {
      created_at: displayUnixTimestamp(record.created_at),
      updated_at: displayUnixTimestamp(record.updated_at)
    });
  };

  renderRecord () {
    const { record, backPath, match } = this.props;

    return (<Card>
      <CardHeader>{record.name}</CardHeader>
      <CardBody>
        <ShowForm
          fields={showFields()}
          values={this.values()}
          backPath={backPath}
          editURL={match.url}
        />
      </CardBody>
    </Card>);
  }

  render () {
    return this.isFetching() ? <Loader/> : this.renderRecord();
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Show);
