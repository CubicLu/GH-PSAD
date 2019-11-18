import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_RECORD } from 'actions/cameras';
import { SET_LIST_ELEMENT } from 'actions/parking_lots';
/* API */
import { showSingle } from 'api/cameras';
/* Base */
/* Helpers */
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import { Link } from 'react-router-dom';
import {
  Col, Row, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import withFetching from 'components/modules/with_fetching'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withCurrentUser from 'components/modules/with_current_user';
import { invoke } from 'actions';
import './cameras.module.sass'


class Show extends React.Component {
  state = {
    currentWatchers: []
  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }
  // values = () => {
  //   const { record } = this.props;
  //   return Object.assign({}, record, {
  //     created_at: displayUnixTimestamp(record.created_at),
  //     updated_at: displayUnixTimestamp(record.updated_at)
  //   });
  // };


  renderHeader() {
    const { backPath } = this.props;
    return (<Row className="p-4" >
      <Col md={2} className="d-flex align-items-center">
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft} />
        </Link>
      </Col>
    </Row>);
  }

  renderRecord() {
    const { record, backPath } = this.props;
    return (
      <Row >
        <React.Fragment>
          {record.map((rec, idx) => {
            return (
              <Col md={6} style={{ padding: 0 }} >
                <div className="card">
                  <p >{rec.name} <Link to={backPath} className="mr-2" >
                    <FontAwesomeIcon color="grey" icon={faEllipsisH} />
                  </Link></p>
                  <img width="80%" src={require("../../../../assets/parking.jpg")} alt="Card image cap" />
                </div>
              </Col>
            )
          })}
        </React.Fragment>
      </ Row >
    );
  }
  render() {
    return this.isFetching() ? <Loader /> : (
      <React.Fragment >
        {this.renderHeader()}
        {this.renderRecord()}
      </React.Fragment>

    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};

function mapDispatch(dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

const mapStateToProps = state => ({
  record: state.camera.records[undefined]

})


// export default connectList('camera', SET_LIST, resourceFetcher(showSingle), Show);
export default connectRecord('camera', SET_RECORD, resourceFetcher(showSingle, 'camera'), connect(
  mapStateToProps,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
