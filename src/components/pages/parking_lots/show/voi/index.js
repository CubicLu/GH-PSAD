import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Nav, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/parking_lots';
import { invoke } from 'actions';
/* API */
import { show } from 'api/parking_lots';
/* Base */
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Show extends React.Component {
  state = {
    errors: {}
  };

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  renderHeader() {
    const { backPath, parentPath, record, match, history } = this.props;

    return (<Row className="p-4">
      <Col md={2} className="d-flex align-items-center">
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft} />
        </Link>
        {record.name}
        <span className="ml-4 general-text-3 text-nowrap">
          <h6 className="m-0">
            ID: {record.id}
          </h6>
        </span>
      </Col>
      <Col md={10}>
        <Nav pills className="align-items-center float-right mx-auto">
          <Button className="mr-1" onClick={() => history.push(parentPath)} color="disabled-lg">
            Information
          </Button>
                <Button className="mr-1" onClick={() => history.push(match.url)} color="primary-lg">
            VOI
          </Button>
          <Button className="mr-1" onClick={() => history.push(`${parentPath}/rules`)} color="disabled-lg">
            Parking rules
          </Button>
          <Button className="mr-1" onClick={() => history.push(`${parentPath}/spaces`)} color="disabled-lg">
            Parking spaces
          </Button>
        </Nav>
      </Col>
    </Row>);
  }

  renderRecord() {
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
        </Col>
      </Row>
    );
  }

  componentWillReceiveProps(nextProps, nextContext) {
  }

  componentDidMount() {
  }

  render() {
    return this.isFetching() ? <Loader /> : this.renderRecord();
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

Show.propTypes = {
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    town_manager: PropTypes.object,
    parking_admin: PropTypes.object,
    vehicle_rules: PropTypes.arrayOf(PropTypes.object),
    setting: PropTypes.object
  })
};

export default connectRecord('parking_lot', SET_RECORD, resourceFetcher(show), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
