import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/admins';
import { btnSpinner } from 'components/helpers';
import { fields } from 'components/helpers/admins';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/admins';
import CommonForm from 'components/base/common_form';
import { index } from 'api/roles';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      roles: []
    }
  }

  componentDidMount() {
    index().then(response => this.setState({ roles: response.data }));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { record } = nextProps;
    if (record) this.setState(record);
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
    return Object.assign({}, record, {
      role_id: record.role.id
    })
  };

  renderRecord() {
    const { backPath, record } = this.props;
    return (
      <Card>
        <CardHeader>Edit Admin</CardHeader>
        <CardBody>
          <CommonForm
            {...this.props}
            backPath={generatePath(backPath, { id: record.id })}
            values={this.values()}
            fields={fields(this.state.roles)}
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

export default connectRecord('admin', SET_RECORD, show, Edit);
