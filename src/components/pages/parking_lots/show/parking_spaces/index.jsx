import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Row,
  Nav,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisV, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import ReactFileReader from 'react-file-reader';
import { isEmpty } from 'underscore';
import {ReactComponent as UploadSVG } from 'assets/upload.svg';
import {ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
/* Actions */
import { SET_RECORD } from 'actions/parking_lots';
/* API */
import { index } from 'api/parking_slots';
import { show, createParkingSpace, deleteParkingSpace, updateParkingSpace } from 'api/parking_lots';
/* Base */
/* Helpers */
import Collapse from 'components/helpers/collapse';
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import TooltipInfo from 'components/helpers/tooltip_info';
import GeneralTooltip from 'components/helpers/general_tooltip';
import ConfirmationModal from 'components/helpers/modals/confirmation';
/* Modules */
import withFetching from 'components/modules/with_fetching';
import resourceFetcher from 'components/modules/resource_fetcher';
import connectRecord from 'components/modules/connect_record';
import withCurrentUser from 'components/modules/with_current_user';

import {
  isUserInsideEditingZone,
  markSlotOnParkingSpace,
  updateCirclePointer
} from './mouse_events'

import ParkingSpaceEditableZone from './parking_space_editable_zone'
import styles from './parking_spaces.module.sass'

/**
  * @state (Bool)  isEditing indicate if the user is in editing mode
  * @state (Bool) isInsideEditingZone indicate if the user pointer is inside the layout parking space
  * @state (Bool) isEditingExistingSlot indicate if the user is moving/editing a circle that was already on parking space
  * @state (Array) drawedSlotContainer contains circle drawed on top of the parking space
  * @state (Integer) slotIdClicked contains the ID of the slot selected on 'Edit mode'
  * @state (Integer) selectedIndexParkingSpace contains the index of the current parking space where the user is working on
  * @state (Object) newCircleInfo store temporaly the information about the new circle that will be created
  * @state (Integer) slotIdToBeDeleted store temporaly the slot id to wait user deletion confirmation
*/

class ParkingSpaces extends Component {
  state = {
    showConfirmationModal: false,
    isSaving: false,
    isSavingParkingSpace: false,
    isListFetching: true,
    list: [],
    parkingSpaces: [],
    selectedIndexParkingSpace: 0,
    slotIdToBeDeleted: null,
    errors: {},
    isEditing: false,
    isInsideEditingZone: false,
    isEditingExistingSlot: false,
    slotIdClicked: null,
    locateSlotId: null,
    newCircleInfo: {},
    drawedSlotContainer: []
  }
  static contextType = AlertMessagesContext

  mapRef = React.createRef();
  circleRef = React.createRef();
  multiSelectContainerRef = React.createRef();

  isFetching = () => {
    const { isResourceFetching } = this.props
    const { isListFetching } = this.state
    return isResourceFetching || isListFetching
  }

  resetData = () => {
      this.setState({
      slotIdToBeDeleted: null,
      showConfirmationModal: false,
      isInsideEditingZone: false,
      isEditingExistingSlot: false,
      newCircleInfo: {},
      slotIdClicked: null,
      isEditing: false
    })
  }

  clearLocateSlotId = () => {
    this.setState({
      locateSlotId: null
    })
  }

  toggleConfirmationModal = (slotId) => {
    this.setState({
      slotIdToBeDeleted: slotId,
      showConfirmationModal: true
    })
  }

  toggleEdit = () => {
    const { parkingSpaces, selectedIndexParkingSpace, isEditing } = this.state;

    if(parkingSpaces[selectedIndexParkingSpace]) {

      if(isEditing) {
        this.saveCoordinateCircles(parkingSpaces[selectedIndexParkingSpace].id);
      }

      this.setState({
        slotIdToBeDeleted: null,
        showConfirmationModal: false,
        isInsideEditingZone: false,
        isEditingExistingSlot: false,
        newCircleInfo: {},
        slotIdClicked: null,
        isEditing: !isEditing
      })
    }
  }

  // Sync Parking Slot Left panel
  syncDrawedSlotContainer = () => {
    const { parkingSpaces, selectedIndexParkingSpace, list } = this.state
    let drawedSlotContainer = [];
    if(!isEmpty(parkingSpaces)){
      const parkingSpaceId = parkingSpaces[selectedIndexParkingSpace || 0].id ;
      let setSlotList = list.filter(slot => slot.coordinate_parking_space);

      if(setSlotList) {
        const slotList = setSlotList.filter(slot => slot.coordinate_parking_space.image_id === parkingSpaceId)
        drawedSlotContainer = slotList.map(slot => slot.coordinate_parking_space)
      }
    }

    this.setState({
      drawedSlotContainer
    })

  }

  // Change parking space
  selectIndexParkingSpace = (index) => {
    this.resetData();
    this.setState({
      selectedIndexParkingSpace: index
    }, this.syncDrawedSlotContainer)
  }


  // Cancel when user selects on the parking space in editing mode
  cancelMarkingSlotOnParkingSpace = () => {
    this.setState({
      newCircleInfo: {}
    })
  }

  cancelParkingSlotCircleDeletion = () => {
    this.setState({
      slotIdToBeDeleted: null,
      slotIdClicked: null,
      showConfirmationModal: false
    })
  }

  // Add new point on the parking space after select parking slot on dropdown
  applyMarkingSlotOnParkingSpace = (selectedOptions) => {
    const newCircleInfo = this.state.newCircleInfo;
    newCircleInfo.parking_slot_id = selectedOptions.value

    this.setState({
      newCircleInfo: {},
      drawedSlotContainer: [
        ...this.state.drawedSlotContainer,
        newCircleInfo
      ]
    })
  }

  editParkingSlotCircle = (id) => {
    this.deleteParkingSlotCircle(id)
    this.setState({
      slotIdClicked: id,
      isEditingExistingSlot: true
    })
  }

  // Show info of the clicked circle
  showCircleDrawSlowInfo = (id) => {
    this.setState({
      slotIdClicked: id,
      newCircleInfo: {}
    })
  }

  // Locate the parking slot on any pakring space
  locateSlotOnParkingSpace = (id) => {
    const { list, parkingSpaces } = this.state
    const slot = list.find(slot => slot.id === id)
    const selectedIndexParkingSpace = parkingSpaces.findIndex(parkingSpace => parkingSpace.id === slot.coordinate_parking_space.image_id)

    this.setState({
      locateSlotId: id,
      selectedIndexParkingSpace
    }, this.syncDrawedSlotContainer)
  }

  /**
    DELETE ACTIONS
  */

  deleteParkingSlotCircle = (id) => {
    const drawedSlotContainer = [...this.state.drawedSlotContainer]
    const slotToDelete = drawedSlotContainer.findIndex(drawedSlot => drawedSlot.parking_slot_id === id)
    drawedSlotContainer.splice(slotToDelete, 1)
    this.setState({
      showConfirmationModal: false,
      slotIdClicked: null,
      slotIdToBeDeleted: null,
      drawedSlotContainer
    })
  }

  deleteParkingSpaceFile = () => {
    const { record, startFetching } = this.props
    const { selectedIndexParkingSpace, parkingSpaces } = this.state
    this.setState({
      isSavingParkingSpace: true
    })
    startFetching(deleteParkingSpace({
        parkingLotId: record.id,
        parkingSpaceId: parkingSpaces[selectedIndexParkingSpace].id
      }))
      .then(response => {
        this.resetData()
        this.setState({
          selectedIndexParkingSpace: 0,
          parkingSpaces: response.data.parking_spaces
        }, this.syncDrawedSlotContainer)
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => this.setState({ isSavingParkingSpace: false }))
  }

  /**
    SAVE ACTIONS
  */

  saveCoordinateCircles = (parkingSpaceId) => {
    const { startFetching, record } = this.props;
    const { drawedSlotContainer } = this.state
    startFetching(
      updateParkingSpace({
        parkingLotId: record.id,
        parkingSpaceCoordinates: drawedSlotContainer,
        parkingSpaceId
      })
    ).then(() => {
      startFetching(index({
        query: {
          parking_lot_id: record.id
        }
      }))
        .then(response => {
          this.setState({
            list: response.data
          })
        })
    })
  };

  saveParkingSpaceFile = (file) => {

    const { record, startFetching } = this.props
    this.setState({ isSavingParkingSpace: true })
    startFetching(
      createParkingSpace({
      parkingLotId: record.id,
      parkingSpaceImage: file.base64
    }))
      .then(response => {
        this.resetData()
        this.setState({
          parkingSpaces: response.data.parking_spaces
        }, this.syncDrawedSlotContainer)
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => this.setState({ isSavingParkingSpace: false }))
  }

  /**
    RENDER ACTIONS
  */

  renderHeader () {
    const { backPath, parentPath, history, match, record } = this.props;
    return (
      <Row>
        <Col sm={12} className="px-4 pt-4 row">
          <Col md={7} className="d-flex align-items-center ">
            <Link to={backPath} className="mr-2" >
              <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
            </Link>
            {record.name}
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
                <Button className="mr-1" onClick={() => history.push(`${parentPath}/rules`)} color="disabled-lg">
                  Parking rules
                </Button>
                <Button className="mr-1" onClick={() => history.push(match.url)} color="primary-lg">
                  Parking spaces
                </Button>
            </Nav>
          </Col>
        </Col>
      </Row>);
  }

  renderEnableButton = () => {
    const { isEditing, parkingSpaces, selectedIndexParkingSpace } = this.state;

    return (
      <div
        className={`d-flex float-right justify-content-center align-items-center ${styles.toggleGroup}`}
        onClick={this.toggleEdit}
      >
        <input type="checkbox" className="d-none" readOnly checked={isEditing ? 'checked' : ''} />
        <div className={`${styles.onoffswitch}`} >
            <div className={styles['onoffswitch-label']}>
                <div className={styles['onoffswitch-inner']}></div>
                <div  className={`${parkingSpaces[selectedIndexParkingSpace] ? '' : styles.disabledToggle} ${styles['onoffswitch-switch']}`}></div>
            </div>
        </div>
        <span className="ml-2">Edit Mode</span>
        <TooltipInfo className="ml-1" text="Activate edit mode and edit parking slot on the parking space. Turn off to save the changes" target="recipients"  />
      </div>
    )
  }

  renderBottomPanel = () => {
    const { parkingSpaces, selectedIndexParkingSpace } = this.state;

    return (
      <Col className="row">
        <Col sm={12} className="mb-5">
          <hr className="w-100 position-absolute"/>
        </Col>
        <Col>
          <Button onClick={(file) => this.deleteParkingSpaceFile()} className={`${parkingSpaces[selectedIndexParkingSpace] ? '' : 'disabled' } mb-3  float-left bg-grey-dark  ml-4 ${parkingSpaces[selectedIndexParkingSpace] ? '' : 'disabled' } `}>
            Delete Layout
          </Button>
          <ReactFileReader
              base64={true}
              handleFiles={this.saveParkingSpaceFile}
            >
              <React.Fragment>
                <Button className="mb-3 float-left bg-grey-dark  ml-4 ">
                  <UploadSVG className="mr-2"/>
                  Upload Layout
                </Button>
              </React.Fragment>
            </ReactFileReader>

          {this.renderEnableButton()}
        </Col>
      </Col>
    );
  }

  renderSlot = (slot) => {
    return (
      <React.Fragment key={slot.id}>
        <Col xs={12} className={`${styles.rowParkingSlot} position-relative px-0 d-flex justify-content-between align-items-center`}>
          <div className={`border-right border-dark ${styles.availabilitySpace} ${slot.status === "free" ? 'bg-green' : 'bg-red' }`}>
          </div>
          <div className={`general-text-1 ml-3 ${styles.slotName}`}>
            {slot.name}
          </div>
          <div className="p-3 mr-5">
            <UncontrolledDropdown>
              <DropdownToggle tag="span" className="pointer">
                <FontAwesomeIcon color="grey" icon={faEllipsisV}/>
              </DropdownToggle>
              <DropdownMenu right>
                {
                  slot.coordinate_parking_space && (
                    <DropdownItem onClick={() => this.locateSlotOnParkingSpace(slot.id)} className="p-3 text-grey">
                        LOCATE
                    </DropdownItem>
                  )
                }
                <DropdownItem className="p-3 text-primary">
                    READ MORE >
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </Col>
      </React.Fragment>
    )
  }

  renderEmptyParkingSpace = () => {
    return (
      <React.Fragment>
          <div className={`${styles.emptyImageMap} d-flex justify-content-center align-items-center`}>
            <p className="general-text-1">
              This parking lot account doesn't have any parking spaces.
            </p>
            <p className="general-text-1">
              For creating it, please upload parking lot plan (*PNG or *JPEG)
            </p>
          </div>
      </React.Fragment>
    )
  }

  renderParkingSpace = (parkingSpaceImageURL) => {

    if (!parkingSpaceImageURL) {
      return this.renderEmptyParkingSpace()
    }

    return <ParkingSpaceEditableZone
      {...this.state}
      parkingSpaceImageURL={parkingSpaceImageURL}
      circleRef={this.circleRef}
      mapRef={this.mapRef}
      editParkingSlotCircle={this.editParkingSlotCircle}
      toggleConfirmationModal={this.toggleConfirmationModal}
      multiSelectContainerRef={this.multiSelectContainerRef}
      applyMarkingSlotOnParkingSpace={this.applyMarkingSlotOnParkingSpace}
      cancelMarkingSlotOnParkingSpace={this.cancelMarkingSlotOnParkingSpace}
      showCircleDrawSlowInfo={this.showCircleDrawSlowInfo}
      markSlotOnParkingSpace={markSlotOnParkingSpace.bind(this)}
      clearLocateSlotId={this.clearLocateSlotId}
      updateCirclePointer={updateCirclePointer.bind(this)}
    />
  }

  renderSlotPanel = (parkingSpaceId) => {
    const { list } = this.state
    let slotList;
    let nonSetSlotList = list.filter(slot => !slot.coordinate_parking_space);
    let setSlotList = list.filter(slot => slot.coordinate_parking_space);

    if(parkingSpaceId) {
      slotList = setSlotList.filter(slot => slot.coordinate_parking_space.image_id === parkingSpaceId)
    } else {
      slotList = nonSetSlotList;
    }

    return (
      isEmpty(slotList) ?
        (
          <Col className="p-3 row d-flex justify-content-center">
            <p className="general-text-1">
              You don't have any parking slot for now.
            </p>
          </Col>
        ) : (
          <Col className={`overflow-auto ${styles.slotContainer} p-0 mb-4`}>
            {slotList.map(slot => this.renderSlot(slot))}
          </Col>
        )

    )
  }

  renderForm () {
    const { isSavingParkingSpace, parkingSpaces, selectedIndexParkingSpace } = this.state

    return (
      <Row onMouseMove={isUserInsideEditingZone.bind(this)}>
        <Col xs={12} md={3} className="p-0">
          <Collapse
            initialState={false}
            toggler={(toggleCollapsable) => (
               <Col className="row d-flex justify-content-between text-white bg-primary p-3 m-0" xs={12}>
                <span className="ml-4">Parking Spaces Non marked</span>
                <ChevronDown className="pointer" onClick={toggleCollapsable} />
              </Col>
            )}
          >
            {this.renderSlotPanel()}
          </Collapse>
          {
            parkingSpaces.map((parkingSpace, index) => {
              return (
                <Collapse
                  initialState={selectedIndexParkingSpace === index}
                  toggler={(toggleCollapsable) => (
                    <Col className={`${ selectedIndexParkingSpace === index ? 'bg-green' : 'bg-primary' } row d-flex justify-content-between text-white  p-3 m-0`} xs={12}>
                      <span className="ml-4">Section {index + 1}</span>
                      <div>
                        <GeneralTooltip className="mr-2" text="Load Parking Space Image" target={`section${index}`} >
                          <FontAwesomeIcon
                            icon={selectedIndexParkingSpace === index ? faEyeSlash : faEye }
                            onClick={() => this.selectIndexParkingSpace(index, parkingSpace.id)}
                            className="mr-3 pointer"
                            id={`section${index}`}
                          />
                        </GeneralTooltip>
                        <ChevronDown onClick={toggleCollapsable} className="pointer"/>
                      </div>
                    </Col>
                  )}
                >
                  {this.renderSlotPanel(parkingSpace.id)}
                </Collapse>
              )
            })
          }
        </Col>
        <Col xs={12} md={9} className="p-0 overflow-auto">
          <div className={`${styles.mapContainer} mx-auto card border-dark d-flex justify-content-center align-items-center p-5`}>
            {
              isSavingParkingSpace ? <Loader/> : this.renderParkingSpace(parkingSpaces[selectedIndexParkingSpace] ? parkingSpaces[selectedIndexParkingSpace].url : null)
            }
          </div>
          <div className="mt-4">
            {this.renderBottomPanel()}
          </div>
        </Col>
      </Row>
    )
  }

  renderRecord () {
    const { slotIdToBeDeleted } = this.state
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
        <ConfirmationModal
          text={"Are you sure that you would like to delete this parking slot from the image?"}
          accept={() => this.deleteParkingSlotCircle(slotIdToBeDeleted)}
          cancel={this.cancelParkingSlotCircleDeletion}
          isOpen={this.state.showConfirmationModal}
        />
      </Row>
    );
  }

  fetchData = (record) => {
    const { startFetching } = this.props;

    if (record) {
      startFetching(index({
        query: {
          parking_lot_id: record.id
        }
      }))
        .then(response => {
          const updateDrawedSlotContainer = response.data.length > 0 ? this.syncDrawedSlotContainer : null
          this.setState({
            isListFetching: false,
            list: response.data,
            parkingSpaces: record.parking_spaces
          }, updateDrawedSlotContainer)
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

  render() {
    return this.isFetching() ? <Loader/> : this.renderRecord()
  }
}

ParkingSpaces.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  withFetching(
    withCurrentUser(ParkingSpaces)
  )
);
