import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Nav } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'informed';
import  { permissions } from 'config/permissions/forms_fields/towns/new'
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/towns';
/* API */
import { create } from 'api/towns';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { fieldsNew, exampleData } from 'components/helpers/fields/towns';
import Loader from 'components/helpers/loader';
import { FieldType } from 'components/helpers/form_fields';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import styles from './towns.module.sass'

class New extends React.Component {

  state = {
    isSaving: false,
    isDropdownFetching: true,
    inputChanged: false,
    dropdowns: {
      townManagers: [],
      statuses: []
    },
    errors: {}
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isDropdownFetching } = this.state
    return isDropdownFetching
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: {...this.state.dropdowns, [key]: data} })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setInputChanged = () => {
    this.setState({ inputChanged: true })
  }

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setInputChanged()
    }
  })


  save = () => {
    const { backPath } = this.props;
    this.setState({ isSaving: true });
    const values = setEmptyFields(fieldsNew(), this.formApi);
    values.avatar = this.formApi.getValue('avatar');
    values.allow_save = 1

    saveRecord.call(this, create, backPath, values);
  };

  renderFields () {
    const { dropdowns } = this.state;
    const { currentUserRoleName } = this.props;

    return (
      renderFieldsWithGrid(
        fieldsNew(dropdowns.statuses, dropdowns.townManagers, permissions[currentUserRoleName]),
        2,
        6,
        {...this.fieldProps(), errors: this.state.errors }
      )
    );
  }

  renderHeader () {
    const { backPath } = this.props;

    return (<Row>
      <Col sm={12} className="p-4 row">
        <Col md={7}>
          <Link to={backPath} className="mr-2" >
            <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
          </Link>
          Create a new towns account
        </Col>
        <Col md={5}>
          <Nav pills className="align-items-center float-right mx-auto">
            <div className="mr-4 text-green">
              <span className={styles['border-number']}>1</span>
              Information
            </div>
          </Nav>
        </Col>
      </Col>
      <Col sm={12} className="bg-grey-light">
       <p className="general-text-2 py-3 m-0">
        Fields marked with an asterik (*) are mandatory
       </p>
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success" className="px-5 text-uppercase py-2 mb-4 float-right"  onClick={() => this.save()}>
          {isSaving ? btnSpinner() : 'Submit >'}
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
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, this.fieldProps())}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
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
    const { startFetching } = this.props
    Promise.all([
      startFetching(dropdownsSearch('admins_by_role-town_manager'))
        .then(response => this.setDropdowns('townManagers', response.data)),
      startFetching(dropdownsSearch('town_statuses_list'))
        .then(response => this.setDropdowns('statuses', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }))
  }

  render () {
    return this.isFetching() ? <Loader/> : (
      <React.Fragment>
        <div>
          {this.renderRecord()}
          {this.renderSaveButton()}
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatch (dispatch) {
  return {...bindActionCreators({ setRecord: invoke(SET_RECORD), setListElement: invoke(SET_LIST_ELEMENT) }, dispatch)};
}

New.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connect(
  null,
  mapDispatch
)(
  withFetching (
    withCurrentUser(New)
  )
);
