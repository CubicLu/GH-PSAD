import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { isEmpty } from 'underscore';

/* Actions */
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { index } from 'api/parking_rules';
/* Base */
 import IndexTable from 'components/base/table';
import Button from 'components/base/button';
/* Helpers */
 import Loader from 'components/helpers/loader';
 import { AlertMessagesContext } from 'components/helpers/alert_messages';
import TooltipInfo from 'components/helpers/tooltip_info';
/* Modules */
 import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';

import styles from './rules.module.sass';
import ModalRecipients from '../../shared/rules/recipients'
import { renderRecords } from '../../shared/rules'

class Rules extends React.Component {
  state = {
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

  save = () => {
    const list = this.state.list.map(rule => {
      rule.recipient_ids = rule.recipients.map(recipient => recipient.id)
      rule.agency_id = rule.agency_id || null
      return rule
    })
    this.props.save(list)
  };

  renderSaveButton = () => {
    const { backParkingRule, isSaving } = this.props;
    return (
      <Row>
        <Col className={styles.btnWrapper}>
          <Button
            status="secondary"
            className="mr-4"
            onClick={backParkingRule}
            size="md"
            isLoading={isSaving}
          >
            {'< Back'}
          </Button>
          <Button
            status="success"
            onClick={this.save}
            size="md"
            isLoading={isSaving}
          >
            Submit
          </Button>
        </Col>
      </Row>
    );
  }

  renderForm () {
    const { list } = this.state;
    return (
      <React.Fragment>
        <IndexTable
          list={list}
          perPage={100}
          total={list.length}
          {...this.props}
          isFetching={this.isFetching}
          toolbar={ null }
          resource={'parking_rules'}
          filterFetcher={index}
          columns={
            <React.Fragment>
              <th disableSort style={{ width: '15%' }}>Status</th>
              <th disableSort style={{ width: '30%' }}>Rule's name</th>
              <th disableSort style={{ width: '30%' }}>
                <TooltipInfo className="mr-1" text="This is the enforcement agency where a violation of the parking rule will be reported to" target="agency"  />
                Assigned Agency
              </th>
              <th disableSort style={{ width: '25%' }}>
                <TooltipInfo className="mr-1" text="Lists all email addresses who will receive notification when the parking rule is violated" target="recipients"  />
                Notification Recipient
              </th>
            </React.Fragment>
          }
          renderRecords={renderRecords.bind(this)}
        />
        {this.renderSaveButton()}
      </React.Fragment>
    );
  }

  componentDidMount () {
    const { startFetching, currentUser } = this.props

    startFetching(index())
      .then((result) => {
        this.setState({
          list: result.data
        });
      })
    startFetching(dropdownsSearch('parking_rule-agencies_list', { admin_id:currentUser.id }))
      .then((result) => {
        this.setState({
          dropdown: {
            agencies: result.data
          }
        });
      })
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
  backParkingRule: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  isSaving: PropTypes.bool
};

export default withFetching(
  withCurrentUser(Rules)
);
