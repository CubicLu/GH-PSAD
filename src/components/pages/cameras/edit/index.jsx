import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/cameras';
import { btnSpinner } from 'components/helpers';
import { fields } from 'components/helpers/cameras';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { SET_RECORD } from 'actions/cameras';
import CommonForm from 'components/base/common_form';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    }
  }

  updateRecord = state => {
    const { id } = this.props.match.params;
    this.setState({ isFetching: true });

    update({ id, data: state.values })
      .then(this.updateSucceed)
      .catch(this.updateFailed)
  };

  updateSucceed = res => {
    const { backPath, match, history, setRecord } = this.props;
    const { id } = match.params;

    setRecord(res.data);
    this.setState({ isFetching: false });
    history.push(generatePath(backPath, { id }));
  };

  updateFailed = error => {
    console.error(error.message);
    this.setState({ isFetching: false });
  };

  values = () => {
    const { record } = this.props;
    let values = Object.assign({}, record);
    values.parking_lot_id = record.parking_lot ? record.parking_lot.id : null;
    return values;
  };

  renderRecord() {
    const { backPath, record } = this.props;

    return (
      <Card>
        <CardHeader>Edit Camera</CardHeader>
        <CardBody>
          <CommonForm
            {...this.props}
            backPath={generatePath(backPath, { id: record.id })}
            values={this.values()}
            fields={fields()}
            isFetching={this.state.isFetching}
            submitForm={this.updateRecord}/>
        </CardBody>
      </Card>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

export default connectRecord('camera', SET_RECORD, resourceFetcher(show), Edit);
