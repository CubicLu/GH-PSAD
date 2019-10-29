import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'informed';
import { isEmpty } from 'underscore';
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/admins';
/* API */
import { create } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { fields, exampleData } from 'components/helpers/fields/admins';
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
    return renderFieldsWithGrid(fields(roles), 2, 6, {...fieldProps, errors: this.state.errors });
  }

  renderHeader () {
    const { backPath } = this.props;

    return (<Row>
      <Col sm={12} className="p-4">
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
        </Link>
        Create user account
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success" className="px-5 py-2 mb-4 float-right"  onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save Changes'}
        </Button>
      </Col>
    );
  }

  renderForm () {
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={exampleData()}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, fieldProps)}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
            { this.renderSaveButton()}
          </Row>
        </Form>
      </fieldset>
    );
  }

  renderRecord () {
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
      </Row>
    );
  }

  componentDidMount () {
    dropdownsSearch('role_id', { admin_id: this.props.currentUser.id })
      .then(response => this.setState({ dropdowns: { roles: response.data } }));
  }

  render () {
    return this.isFetching() ? <Loader/> : (
      <React.Fragment>
        {this.renderRecord()}
      </React.Fragment>
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
