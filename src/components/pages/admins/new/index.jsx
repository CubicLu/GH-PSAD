import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Form } from 'informed';
import { isEmpty } from 'underscore';
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/admins';
/* API */
import { create } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import Breadcrumb from 'components/base/breadcrumb';
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fieldsNew, exampleData } from 'components/helpers/fields/admins';
import Loader from 'components/helpers/loader';
import { FieldType } from 'components/helpers/form_fields';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';

class New extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {
      roles: []
    }
  }

  static contextType = AlertMessagesContext

  isFetching () {
    const { roles } = this.state.dropdowns;
    return isEmpty(roles)
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  save = () => {
    const { values } = this.formApi.getState();
    const { backPath } = this.props;
    saveRecord.call(this, create, backPath, values);
  };

  renderFields () {
    const { roles } = this.state.dropdowns;
    return renderFieldsWithGrid(fieldsNew(roles), 2, 6, {...fieldProps, errors: this.state.errors });
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <div className="d-flex justify-content-end pt-2 pr-4">
        <Button
          size="md"
          status="success"
          onClick={this.save}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </div>
    );
  }

  renderForm () {
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={exampleData()}>
          <Row className="no-gutters px-2">
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, fieldProps)}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  componentDidMount () {
    dropdownsSearch('role_id', { admin_id: this.props.currentUser.id })
      .then(response => this.setState({ dropdowns: { roles: response.data } }));
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    const { backPath } = this.props;
    return (
      <div className="pb-4">
        <Breadcrumb
          title='Create user account'
          backPath={backPath}
        />
        {this.renderForm()}
        {this.renderSaveButton()}
      </div>
    );
  }
}

function mapDispatch (dispatch) {
  return {...bindActionCreators({ setRecord: invoke(SET_RECORD), setListElement: invoke(SET_LIST_ELEMENT) }, dispatch)};
}

const fieldProps = { lSize: 6 };

New.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connect(
  null,
  mapDispatch
)(withCurrentUser(New));
