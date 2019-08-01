import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { show } from 'api/admins';
import { SET_RECORD } from 'actions/admins';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import ShowForm from 'components/base/forms/show_form';
import { showFields } from 'components/helpers/fields/admins';

class Show extends React.Component {
  renderRecord () {
    const { record, backPath, match } = this.props;
    return (<Card>
      <CardHeader>{record.email}</CardHeader>
      <CardBody>
        <ShowForm
          fields={showFields()}
          values={record}
          backPath={backPath}
          editURL={record.actions.update ? match.url : ''}
        />
      </CardBody>
    </Card>);
  }

  render () {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  })
};

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), Show);
