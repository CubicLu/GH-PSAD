import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { cloneDeep } from 'lodash'
import ModalRecipients from '../../shared/rules/recipients'
import { renderRecords } from '../../shared/rules'
import Header from '../../shared/header'
import permissions from 'config/permissions';

/* Actions */
import { SET_RECORD } from 'actions/parking_lots';
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { index as indexRules, update as updateRules } from 'api/parking_rules';
import { show } from 'api/parking_lots';
/* Base */
import IndexTable from 'components/base/table';
import Button from 'components/base/button';
/* Helpers */
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import TooltipInfo from 'components/helpers/tooltip_info';
/* Modules */
import withFetching from 'components/modules/with_fetching';
import resourceFetcher from 'components/modules/resource_fetcher';
import connectRecord from 'components/modules/connect_record';
import withCurrentUser from 'components/modules/with_current_user';
import doesUserHasPermission from 'components/modules/does_user_has_permission';
/* Styles/Assets */
import styles from './rules.module.sass';

class Rules extends React.Component {

  state = {
    isSaving: false,
    inputChanged: false,
    showModalRecipient: false,
    dropdowns: {
      officers: []
    },
    list: [],
    currentRule: {
      recipients: []
    },
    isFetching: true
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    return this.state.isFetching;
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  toggleModal = () => this.setState({showModalRecipient: false})

  updateRecipientsList = newList => {
    const { list, currentRule } = this.state
    this.setState({
      list: list.map(rule => {
        if(rule.name === currentRule.name) {
          rule.recipients = newList
        }
        return rule
      })
    })
  }

  fieldProps = () => ({
    lSize: 6
  })

  save = () => {
    const { record } = this.props
    this.setState({ isSaving: true });
    const list = cloneDeep(this.state.list).map(rule => {
      rule.recipient_ids = rule.recipients.map(recipient => recipient.id)
      delete rule.recipients
      return rule
    })

    updateRules({
      parkingLotId: record.id,
      query: {
        parking_rules: list
      }
    })
      .then(() => {
        this.context.addAlertMessages([{
          type: 'Success',
          text: 'Rules saved succesfully'
        }])
      })
      .catch((errors) => {
        this.context.addAlertMessages([{
          type: 'Error',
          text: errors.message
        }])
        console.error(errors)
      })
      .finally(() => this.setState({ isSaving: false }))
  };

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Row>
        <Col className="d-flex justify-content-end">
          <Button
            status="success"
            className={styles.btnSave}
            size="md"
            onClick={this.save}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    );
  }

  renderForm () {
    const { currentUserPermissions } = this.props;
    const { list } = this.state;
    const disabled = !doesUserHasPermission(currentUserPermissions, permissions.UPDATE_PARKINGLOT);
    return (
      <div className="position-relative">
        <IndexTable
          list={list}
          perPage={100}
          total={list.length}
          {...this.props}
          isFetching={this.isFetching}
          toolbar={ null }
          resource={'parking_rules'}
          filterFetcher={indexRules}
          columns={
            <React.Fragment>
              <th disableSort style={{ width: '15%' }}>Status</th>
              <th disableSort style={{ width: '30%' }}>Rule's name</th>
              <th disableSort style={{ width: '30%' }}>
                <TooltipInfo className="mr-1" text="Optional. Lists all assignable officers from parking lot assigned agency." target="agency"  />
                Assigned Agency Officer
              </th>
              <th disableSort style={{ width: '25%' }}>
                <TooltipInfo className="mr-1" text="Optional. Lists all email addresses who will receive notification when the parking rule is violated" target="recipients"  />
                Notification Recipient
              </th>
            </React.Fragment>
          }
          renderRecords={renderRecords.bind(this)}
        />
        {disabled && <div className={styles.overlay} />}
        {!disabled && this.renderSaveButton()}
      </div>
    );
  }

  fetchData = (record) => {
    if (!record) return;
    const { startFetching } = this.props;
    const promises = [];
    promises.push(
      startFetching(
        indexRules({ query: { parking_lot_id: record.id } })
      ).then((response) => this.setState({ list: response.data }))
    );
    if (record.agency_id) {
      promises.push(
        startFetching(
          dropdownsSearch('agency_officers_list', { agency_id: record.agency_id })
        ).then(response => this.setDropdowns('officers', response.data))
      );
    }
    Promise.all(promises)
      .finally(() => this.setState({ isFetching: false }));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.record && !this.props.record) {
      this.fetchData(nextProps.record);
    }
  }

  componentDidMount () {
    const { record } = this.props;
    this.fetchData(record);
  }

  render () {
    if (this.isFetching()) {
      return <Loader/>;
    }
    const { showModalRecipient, currentRule } = this.state;
    const { list } = this.state;
    const activeRules = list.reduce((accumulator, currentValue) => (accumulator + (currentValue.status ? 1 : 0)), 0);
    return (
      <React.Fragment>
        <Header {...this.props} />
        <div className={`${styles.hint} bg-grey-light`}>
          <p className="general-text-2 py-3">
            Please select the parking rules that you want to be enforced. You can change this later
          </p>
          <p className="general-text-1">
            Activated: {activeRules} rules
          </p>
          {
            this.props.record && !this.props.record.agency_id ?
            <p className="general-text-2 py-3 text-danger">
              Please <Link to={`/dashboard/parking_lots/${this.props.record.id}`}>assign</Link> agency to this parking lot first before you can assign agency's officer for each rule.
            </p> : ''
          }
        </div>
        {this.renderForm()}
        <ModalRecipients
          updateRecipientsList={this.updateRecipientsList}
          recipientsList={currentRule.recipients}
          isOpen={showModalRecipient}
          toggleModal={this.toggleModal}
        />
      </React.Fragment>
    );
  }
}

Rules.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  currentUserPermissions: PropTypes.array
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  withFetching(
    withCurrentUser(Rules)
  )
);
