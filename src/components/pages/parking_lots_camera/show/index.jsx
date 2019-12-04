import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_RECORD } from 'actions/cameras';
import { SET_LIST_ELEMENT } from 'actions/parking_lots';
/* API */
import { show } from 'api/parking_lot_camera';
/* Helpers */
import Loader from 'components/helpers/loader';
import fieldsDropdowns from '../../../helpers/fields/parking_lot_camera'
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching'
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { Col, Row, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Modal, ModalHeader, ModalBody } from 'reactstrap';
/* Font Awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
/* Redux */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { invoke } from 'actions';
/* Style */
import styles from './parking_lots_camera.sass'
import NotAllowed from '../../../helpers/form_fields/image/NotAllowNotConnect/NotAllowed'
import NotConnect from '../../../helpers/form_fields/image/NotAllowNotConnect/NotConnect'
import BasicBackListToolbarWithSearch from 'components/base/parking_lot_camera/back';
import debounce from 'lodash/debounce'

class Show extends React.Component {
  state = {
    currentWatchers: [],
    showDropdown: false,
    searchInput: '',
    modal: false,

  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  // for show dropdown of single camera
  toggleDropdown = (e, name) => {
    if (name) {
      if (this.state.showDropdown[name]) {
        this.setState({ showDropdown: { ...this.state.showDropdown, [name]: !this.state.showDropdown[name] } })
      } else {
        this.setState({ showDropdown: { ...this.state.showDropdown, [name]: true } })
      }
    }
  }
  //for expand stream of single camera
  toggle = (name) => {
    if (name) {
      if (this.state.modal[name]) {
        this.setState({ modal: { ...this.state.modal, [name]: !this.state.modal[name] } })
      } else {
        this.setState({ modal: { ...this.state.modal, [name]: true } })
      }
    }
  }

  renderHeader() {
    const { backPath, history: { location: { state: { record: { name } } } }, history } = this.props;
    let id = this.props.match.params.id
    return (<Row className="p-4" >
      <Col md={2} className="d-flex align-items-center">
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft} />
        </Link>
        <span>{name}</span>
      </Col>
      <Col md={10} >
        <BasicBackListToolbarWithSearch id={id} onHandleChange={this.onHandleChange} history={history} />
      </Col>
    </Row>);
  }

  renderRecord() {
    const { record } = this.props;
    return (
      <Row >
        <React.Fragment>
          {record.map((rec, idx) => {
            return (
              <Col md={6} className="card-adjust" >
                <div className="card">
                  <p className="cameraName">{rec.name}
                    <Dropdown direction="left" isOpen={this.state.showDropdown[rec.name]} toggle={(e) => this.toggleDropdown(e, rec.name)}>
                      <DropdownToggle color="none">
                        <FontAwesomeIcon color="grey" icon={faEllipsisH} />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-right">
                        {fieldsDropdowns.map(fieldsDropdown => {
                          return (
                            <DropdownItem >
                              {fieldsDropdown.name === 'Expand' ? (<p onClick={() => this.toggle(rec.name)}>{fieldsDropdown.name}</p>) : <Link className="dropdownmenu" to={`${fieldsDropdown.path}`}>{fieldsDropdown.name}</Link>}
                              <Modal isOpen={this.state.modal[rec.name]} toggle={() => this.toggle(rec.name)}>
                                <ModalHeader toggle={() => this.toggle(rec.name)} >{rec.name}</ModalHeader>
                                <ModalBody>
                                  {this.renderStream(idx)}
                                </ModalBody>
                              </Modal>
                            </DropdownItem>)
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </p>
                  {this.renderStream(idx)}
                </div>
              </Col>
            )
          })
          }
        </React.Fragment>
      </Row >
    );
  }

  renderStream(idx) {
    const { currentUser: { role: { name } } } = this.props
    const { record } = this.props
    return (
      ReactPlayer.canPlay(record[idx].stream) ? <div><ReactPlayer className="stream" url={record[idx].stream} playing={true} width={'80 %'} /><p className="live">Live</p></div> : <NotConnect />
    )
  }

  onHandleChange = debounce(((searchInput) => {
    this.setState({
      searchInput
    })
  }), 1000);


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
