import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { generatePath } from 'react-router';
import { show, update } from 'api/agencies';
import { fields } from 'components/helpers/fields/agencies';
import connectRecord from 'components/modules/connect_record';
import { SET_RECORD } from 'actions/agencies';
import CommonForm from 'components/base/common_form';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import updateRecord from 'components/modules/form_actions/update_record';
import { fromJson as showErrors } from 'components/helpers/errors';

class Edit extends React.Component {
  state = {
    isSaving: false
  };

  values = () => {
    const { record } = this.props;
    let values = Object.assign({}, record);
    values.manager_id = record.manager ? record.manager.id : null;
    values.town_manager_id = record.town_manager ? record.town_manager.id : null;
    values.officer_ids = record.officers ? record.officers : null;
    return values;
  };

  renderRecord() {
    const { backPath, record, dropdowns } = this.props;
    const { officer, manager, town_manager } = dropdowns;
    const path = generatePath(backPath, { id: record.id });

    return (
      <Card>
        <CardHeader>Edit Agency</CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          <CommonForm
            {...this.props}
            backPath={path}
            values={this.values()}
            fields={fields(officer, manager, town_manager)}
            isFetching={this.state.isSaving}
            submitForm={updateRecord.bind(this, update, path)}/>
        </CardBody>
      </Card>
    );
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderRecord();
  }
}

const showWithDropdowns = (wrapper, condition, callback) => {
  const { params } = wrapper.props.match;

  const promise1 = show(params).then(callback);
  const promise2 = searchAdminByRoleName(['manager', 'officer', 'town_manager'])
    .then(result => wrapper.setState({ dropdowns: { ...result } }));

  Promise.all([promise1, promise2])
    .catch(err => console.error(err))
    .finally(wrapper.fetchFinished);
};

export default connectRecord('agency', SET_RECORD, showWithDropdowns, Edit);
