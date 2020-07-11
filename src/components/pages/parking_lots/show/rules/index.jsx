import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Nav } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'underscore';
import { cloneDeep } from 'lodash'
import ModalRecipients from '../../shared/rules/recipients'
import { renderRecords } from '../../shared/rules'

/* Actions */
import { SET_RECORD } from 'actions/parking_lots';
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { index as indexRules, update as updateRules } from 'api/parking_rules';
import { show } from 'api/parking_lots';
/* Base */
 import IndexTable from 'components/base/table';
/* Helpers */
 import { btnSpinner } from 'components/helpers';
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import TooltipInfo from 'components/helpers/tooltip_info';
/* Modules */
import withFetching from 'components/modules/with_fetching';
import resourceFetcher from 'components/modules/resource_fetcher';
import connectRecord from 'components/modules/connect_record';
 import withCurrentUser from 'components/modules/with_current_user';

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

  renderHeader () {
    const { backPath, parentPath, history, match, record } = this.props;
    const { list } = this.state;
    const activeRules = list.reduce((accumulator, currentValue) => ( accumulator + (currentValue.status ? 1 : 0) ), 0)

    return (<Row>
      <Col sm={12} className="p-4 row">
        <Col md={7} className="d-flex align-items-center ">
          <Link to={backPath} className="mr-2" >
            <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
          </Link>
          Parking Lot Details
          <span className="ml-4 general-text-3 text-nowrap">
            <h6 className="m-0">
              ID: {record.id}
            </h6>
          </span>
        </Col>
        <Col md={5}>
          <Nav pills className="align-items-center float-right mx-auto">
              <Button className="mr-1" onClick={() => history.push(parentPath)} color="disabled-lg">
                Information
              </Button>
              <Button className="mr-1" onClick={() => history.push(`${parentPath}/voi`)} color="disabled-lg">
                VOI
              </Button>
              <Button className="mr-1" onClick={() => history.push(match.url)} color="primary-lg">
                Parking rules
              </Button>
              <Button className="mr-1" onClick={() => history.push(`${parentPath}/spaces`)} color="disabled-lg">
                Parking spaces
              </Button>
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
      <Col>
        <Button color="success" className="px-5 py-2 mb-4 float-right"  onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save Changes'}
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
          filterFetcher={indexRules}
          columns={
            <React.Fragment>
              <th disableSort>Status</th>
              <th disableSort>Rule's name</th>
              <th disableSort>
                <TooltipInfo className="mr-2" text="Optional. Lists all agencies where we can assign the parking rule" target="agency"  />
                Assigned Agency
              </th>
              <th disableSort>
                <TooltipInfo className="mr-2" text="Optional. Lists all email addresses who will receive notification when the parking rule is violated" target="recipients"  />
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
    return this.isFetching() ?  <Loader/> : this.renderRecord()
  }
}

Rules.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  withFetching(
    withCurrentUser(Rules)
  )
);
