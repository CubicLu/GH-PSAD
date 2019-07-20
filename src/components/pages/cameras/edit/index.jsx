import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/cameras';
import { fields } from 'components/helpers/fields/cameras';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/cameras';
import CommonForm from 'components/base/common_form';
import updateRecord from 'components/modules/form_actions/update_record';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    }
  }

  values = () => {
    const { record } = this.props;
    let values = Object.assign({}, record);
    values.parking_lot_id = record.parking_lot ? record.parking_lot.id : null;
    return values;
  };

  renderRecord() {
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id })

    return (
      <Card>
        <CardHeader>Edit Camera</CardHeader>
        <CardBody>
          <CommonForm
            {...this.props}
            backPath={path}
            values={this.values()}
            fields={fields()}
            isFetching={this.state.isFetching}
            submitForm={updateRecord.bind(this, update, path)}/>
        </CardBody>
      </Card>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Edit);
