import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col, Row, Nav } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'underscore';

/* Actions */
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { index } from 'api/parking_rules';
/* Base */
 import IndexTable from 'components/base/table';
import Button from 'components/base/button';
/* Helpers */
import { btnSpinner } from 'components/helpers';
 import Loader from 'components/helpers/loader';
 import { AlertMessagesContext } from 'components/helpers/alert_messages';
import TooltipInfo from 'components/helpers/tooltip_info';
/* Modules */
 import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';

import sharedStyles from '../shared.module.sass'
import ModalRecipients from '../../shared/rules/recipients'
import { renderRecords } from '../../shared/rules'

class New extends React.Component {

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

  save = () => {
    const list = this.state.list.map(rule => {
      rule.recipient_ids = rule.recipients.map(recipient => recipient.id)
      rule.agency_id = rule.agency_id || null
      return rule
    })
    this.props.save(list)
  };

  renderHeader () {
    const { backPath } = this.props;
    const { list } = this.state;
    const activeRules = list.reduce((accumulator, currentValue) => ( accumulator + (currentValue.status ? 1 : 0) ), 0)

    return (<Row>
      <Col sm={12} className="p-4 row">
        <Col md={7}>
          <Link to={backPath} className="mr-2" >
            <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
          </Link>
          Create a new parking lot account
        </Col>
        <Col md={5}>
          <Nav pills className="align-items-center float-right mx-auto">
            <div className="mr-4">
              <span className={sharedStyles['border-number']}>1</span>
              Information
            </div>
            <div className="mr-1 text-green">
              <span className={sharedStyles['border-number']}>2</span>
              Parking rules
            </div>
          </Nav>
        </Col>
      </Col>
      <Col sm={12} className="bg-grey-light">
        <p className="general-text-2 py-3 m-0">
          Please select the parking rules that you want to be enforced. You can change this later
        </p>
        <p className="general-text-1 p-0 m-0">
          Activated: {activeRules} rules
        </p>
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col className="mt-4">
        <Button
          status="success"
          className="text-uppercase mb-4 float-right"
          onClick={this.save}
          size="md"
        >
          {isSaving ? btnSpinner() : 'Submit'}
        </Button>
        <Button
          status="secondary"
          className="text-uppercase mb-4 mr-4 float-right"
          onClick={this.props.backParkingRule}
          size="md"
        >
          {isSaving ? btnSpinner() : '< Back'}
        </Button>
      </Col>
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
              <th disableSort>Status</th>
              <th disableSort>Rule's name</th>
              <th disableSort>
                <TooltipInfo className="mr-2" text="This is the enforcement agency where a violation of the parking rule will be reported to" target="agency"  />
                Assigned Agency
              </th>
              <th disableSort>
                <TooltipInfo className="mr-2" text="Lists all email addresses who will receive notification when the parking rule is violated" target="recipients"  />
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

  renderRecord () {
    const { showModalRecipient, currentRule } = this.state
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
        <ModalRecipients
          updateRecipientsList={this.updateRecipientsList}
          recipientsList={currentRule.recipients}
          isOpen={showModalRecipient}
          toggleModal={this.toggleModal}
        />
      </Row>
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
    return this.isFetching() ?  <Loader/> : this.renderRecord()
  }
}


New.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default withFetching (
  withCurrentUser(New)
);