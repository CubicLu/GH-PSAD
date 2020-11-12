import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { isEmpty } from 'underscore';
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
    dropdown: {},
    list: [],
    currentRule: {
      recipients: []
    }
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { list, dropdown } = this.state
    return isEmpty(list) || isEmpty(dropdown)
  }

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
      if (!rule.agency_id) {
        delete rule.agency_id
      }
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
                <TooltipInfo className="mr-1" text="Optional. Lists all agencies where we can assign the parking rule" target="agency"  />
                Assigned Agency
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
    const { startFetching, currentUser } = this.props;

    if (record) {

      startFetching(indexRules({ query: {parking_lot_id: record.id }}))
        .then((result) => {
          this.setState({
            list: result.data
          });
        })

      startFetching(dropdownsSearch('parking_rule-agencies_list', { admin_id: currentUser.id, parking_lot_id: record.id  }))
        .then((result) => {
          this.setState({
            dropdown: {
              agencies: result.data
            }
          });
        })
    }
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
