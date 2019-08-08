import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { create } from 'api/cameras';
import { invoke } from 'actions';
import { SET_RECORD } from 'actions/cameras';
import { fields } from 'components/helpers/fields/cameras';
import { fromJson as showErrors } from 'components/helpers/errors';
import saveRecord from 'components/modules/form_actions/save_record';
import CommonForm from 'components/base/common_form';

class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false
    }
  }

  render() {
    return (
      <Card>
        <CardHeader>New Camera</CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          <CommonForm
            {...this.props}
            fields={fields()}
            isFetching={this.state.isSaving}
            submitForm={saveRecord.bind(this, create)}/>
        </CardBody>
      </Card>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setRecord: invoke(SET_RECORD) }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(New);
