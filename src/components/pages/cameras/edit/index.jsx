import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/cameras';
import { fields } from 'components/helpers/fields/cameras';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/cameras';
import CommonForm from 'components/base/forms/common_form';
import updateRecord from 'components/modules/form_actions/update_record';
import { fromJson as showErrors } from 'components/helpers/errors';

class Edit extends React.Component {
  state = {
    isSaving: false
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.parking_lot_id = record.parking_lot ? record.parking_lot.id : null;
    return values;
  };

  renderRecord () {
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    return (
      <Card>
        <CardHeader>Edit Camera</CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          <CommonForm
            {...this.props}
            backPath={path}
            values={this.values()}
            fields={fields()}
            isFetching={this.state.isSaving}
            submitForm={updateRecord.bind(this, update, path)}/>
        </CardBody>
      </Card>
    );
  }

  render () {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

Edit.propTypes = {
  backPath: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parking_lot: PropTypes.object.isRequired
  })
};

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Edit);
