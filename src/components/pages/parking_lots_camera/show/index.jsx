import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_RECORD } from 'actions/cameras';
import { SET_LIST_ELEMENT } from 'actions/parking_lots';
/* API */
import { show } from 'api/parking_lot_camera';
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
import './parking_lots_camera.sass'
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import { FieldType } from 'components/helpers/form_fields';

class Show extends React.Component {
  state = {
    currentWatchers: []
  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

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
  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setInputChanged()
    }
  })
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
                  {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD })}
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
export default connectRecord('camera', SET_RECORD, resourceFetcher(show, 'parking_lot_camera'), connect(
  mapStateToProps,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
