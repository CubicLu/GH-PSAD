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
import { faChevronLeft, faEllipsisV, faEyeSlash, faEye, faTrash, faSync, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ReactFileReader from 'react-file-reader';
import { isEmpty, isMatch } from 'underscore';
import {
  isUserInsideEditingZone,
  markSlotOnParkingSpace,
  updateCirclePointer
} from './mouse_events'

import ParkingSpaceEditableZone from './parking_space_editable_zone'
import FileLayoutModal from './file_layout_modal'

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
import { btnSpinner } from 'components/helpers';
/* Modules */
import withFetching from 'components/modules/with_fetching';
import resourceFetcher from 'components/modules/resource_fetcher';
import connectRecord from 'components/modules/connect_record';
import withCurrentUser from 'components/modules/with_current_user';
/* Assets */
import styles from './parking_spaces.module.sass'
import { ReactComponent as LocationIcon } from 'assets/location_icon.svg'
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg'
import { ReactComponent as RecordsIcon } from 'assets/records_icon.svg'
import {ReactComponent as UploadSVG } from 'assets/upload.svg';
import {ReactComponent as ChevronDown } from 'assets/chevron_down.svg';

/**
  * @state (Bool)  isEditing indicate if the user is in editing mode
  * @state (Bool) isInsideEditingZone indicate if the user pointer is inside the layout parking space
  * @state (Bool) isEditingExistingSlot indicate if the user is moving/editing a circle that was already on parking space
  * @state (Array) drawedSlotContainer contains circle drawed on top of the parking space
  * @state (Array) tmpDrawedSlotContainer contains the initial data of drawedSlotContainer variable to check if the data was changed when the user tries to turn off the edit mode
  * @state (Array) list contains a list of parking slot and its state
  * @state (Array) parkingSpaces contains a list of images associated to Parking Lot
  * @state (Integer) slotIdClicked contains the ID of the slot selected on 'Edit mode'
  * @state (Integer) selectedIndexParkingSpace contains the index of the current parking space where the user is working on
  * @state (Object) newCircleInfo store temporaly the information about the new circle that will be created
  * @state (Integer) slotIdToBeDeleted store temporaly the slot id to wait user deletion confirmation
*/

class ParkingSpaces extends Component {
  state = {
    /* Modal */
    showCircleConfirmationModal: false,
    showParkingSpaceDeleteConfirmationModal: false,
    showUnsavedChangesModal: false,
    showFileLayoutModal: false,
    /* Loader State */
    isRefreshingData: false,
    isSaving: false,
    isSavingParkingSpace: false,
    isListFetching: true,

    fileLayoutModalShouldUpdate: false,
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
    drawedSlotContainer: [],
    tmpDrawedSlotContainer: []
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
      showCircleConfirmationModal: false,
      isInsideEditingZone: false,
      isEditingExistingSlot: false,
      newCircleInfo: {},
      slotIdClicked: null,
      isEditing: false
    })
  }

  resetUnsavedChanges = () => {
    const { tmpDrawedSlotContainer } = this.state
    this.toggleUnsavedChangesModal();
    this.resetData();
    this.setState({
      drawedSlotContainer: tmpDrawedSlotContainer,
      tmpDrawedSlotContainer: []
    })
  }

  clearLocateSlotId = () => {
    this.setState({
      locateSlotId: null
    });
  }

  toggleCircleConfirmationModal = (slotId) => {
    this.setState({
      slotIdToBeDeleted: slotId,
      showCircleConfirmationModal: true
    });
  }

  toggleUnsavedChangesModal = () => {
    this.setState((state) => ({
      showUnsavedChangesModal: !state.showUnsavedChangesModal
    }));
  }

  toggleParkingSpaceDeleteConfirmationModal = () => {
    this.setState((state) => ({
      showParkingSpaceDeleteConfirmationModal:  !state.showParkingSpaceDeleteConfirmationModal
    }));
  }

  toggleEdit = () => {
    const { drawedSlotContainer, tmpDrawedSlotContainer, parkingSpaces, selectedIndexParkingSpace, isEditing } = this.state;

    if(parkingSpaces[selectedIndexParkingSpace]) {

      if(isEditing) {
        const isNotChanged = drawedSlotContainer.length != tmpDrawedSlotContainer.length ? false :
        drawedSlotContainer.every((slot, index) => {
          return isMatch(slot, tmpDrawedSlotContainer[index])
        })

        if(!isNotChanged) {
          this.toggleUnsavedChangesModal();
          return
        }
      }
      const copyDrawedSlotContainer = drawedSlotContainer

      this.setState({
        tmpDrawedSlotContainer: [...copyDrawedSlotContainer],
        slotIdToBeDeleted: null,
        showCircleConfirmationModal: false,
        isInsideEditingZone: false,
        isEditingExistingSlot: false,
        newCircleInfo: {},
        slotIdClicked: null,
        isEditing: !isEditing
      })
    }
  }

  refreshData = () => {
    const { record, startFetching } = this.props
    const { list } = this.state
    this.setState({isRefreshingData: true})
    startFetching(index({
        query: {
          parking_lot_id: record.id
        }
      }))
        .then(response => {
          const newList = list.map(slot => {
              return response.data.find( dataSlot => dataSlot.id === slot.id )
          })
          this.setState({
            list: newList
          })
        })
        .finally(() => this.setState({isRefreshingData: false}))

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
      showCircleConfirmationModal: false
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
      showCircleConfirmationModal: false,
      slotIdClicked: null,
      slotIdToBeDeleted: null,
      drawedSlotContainer
    })
  }

  deleteParkingSpaceFile = () => {
    const { record, startFetching } = this.props
    const { selectedIndexParkingSpace, parkingSpaces } = this.state
    this.setState({
      showParkingSpaceDeleteConfirmationModal: false,
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
          this.context.addAlertMessages([{
            type: 'Success',
            text: 'Parking Space data saved succesfully'
          }]);

          this.setState({
            tmpDrawedSlotContainer: drawedSlotContainer,
            list: response.data
          });
        })
        .catch((error) => {
          console.log(error);
          this.context.addAlertMessages([{
            type: 'Error',
            text: 'An error has occurred'
          }]);
        })
    })
  };

  updateParkingSpaceFile = (file, fileName) => {
    const { parkingSpaces, selectedIndexParkingSpace } = this.state
    const { startFetching, record } = this.props;
    const base64 = file ? file.base64 : ''
    this.setState({
      fileLayoutModalShouldUpdate: false,
      isSavingParkingSpace: true
    })

    startFetching(
      updateParkingSpace({
        parkingLotId: record.id,
        name: fileName,
        parkingSpaceImage: base64,
        parkingSpaceId: parkingSpaces[selectedIndexParkingSpace].id
      })
    )
      .then((response) => this.setState({ parkingSpaces: response.data.parking_spaces }))
      .finally(() => this.setState({ isSavingParkingSpace: false }))
  }

  saveParkingSpaceFile = (file, fileName) => {
    if(this.state.fileLayoutModalShouldUpdate) {
      this.updateParkingSpaceFile(file, fileName);
      return;
    }

    const { record, startFetching } = this.props
    this.setState({ isSavingParkingSpace: true })
    startFetching(
      createParkingSpace({
      parkingLotId: record.id,
      parkingSpaceImage: file.base64,
      name: fileName
    }))
      .then(response => {
        this.resetData()
        this.setState({
          selectedIndexParkingSpace: response.data.parking_spaces.length - 1,
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
        <TooltipInfo text="Edit Mode allows you to create, update or delete markups on the parking lot layout screen." target="recipients"  />
        <span className="mx-2">Markup Mode</span>
        <input type="checkbox" className="d-none" readOnly checked={isEditing ? 'checked' : ''} />
        <div className={`${styles.onoffswitch}`} >
            <div className={styles['onoffswitch-label']}>
                <div className={styles['onoffswitch-inner']}></div>
                <div  className={`${parkingSpaces[selectedIndexParkingSpace] ? '' : styles.disabledToggle} ${styles['onoffswitch-switch']}`}></div>
            </div>
        </div>
      </div>
    )
  }

  renderUploadLayout = () => {
    const { parkingSpaces, selectedIndexParkingSpace } = this.state;

    return (
      parkingSpaces[selectedIndexParkingSpace] ? (
        <UncontrolledDropdown className="float-left">
          <DropdownToggle caret>
            {parkingSpaces[selectedIndexParkingSpace].name}
          </DropdownToggle>
          <DropdownMenu>
            {
              parkingSpaces.map((parkingSpace, index) => {
                return (
                    <DropdownItem
                      key={parkingSpace.id}
                      onClick={() => this.selectIndexParkingSpace(index, parkingSpace.id)}
                      disabled={parkingSpace.id === parkingSpaces[selectedIndexParkingSpace].id}
                    >
                      {parkingSpace.name}
                    </DropdownItem>
                )
              })
            }
            <DropdownItem divider />
            <DropdownItem onClick={this.addNewMap}>
              <span class="text-primary">+ ADD NEW</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ) : (
        <Button onClick={this.addNewMap} className="mb-3 float-left bg-grey-dark  ml-4 ">
          <UploadSVG className="mr-2"/>
          Add a Layout
        </Button>
      )
    )
  }

  toggleFileLayoutModal = () => this.setState({ showFileLayoutModal: !this.state.showFileLayoutModal})

  addNewMap = () => {
    this.toggleFileLayoutModal();
    this.setState({
      fileLayoutModalShouldUpdate: false
    })
  }

  editCurrentMap = () => {
    this.toggleFileLayoutModal();
    this.setState({
      fileLayoutModalShouldUpdate: true
    })
  }

  renderUpperPanel = () => {
    const { parkingSpaces, selectedIndexParkingSpace } = this.state;
    return (
      <Col className="row">
        <Col sm={12} className="mb-5">
          <hr className="w-100 position-absolute"/>
        </Col>
        <Col>
          {this.renderUploadLayout()}
          <Button color="primary" onClick={this.editCurrentMap} className={`${parkingSpaces[selectedIndexParkingSpace] ? '' : 'disabled not-allowed ' } mb-3 float-left ml-4`}>
              <EditIcon />
          </Button>
          <Button color="danger" onClick={this.toggleParkingSpaceDeleteConfirmationModal} className={`${parkingSpaces[selectedIndexParkingSpace] ? '' : 'disabled not-allowed ' } mb-3 float-left ml-4`}>
              <FontAwesomeIcon color="white" icon={faTrash}/>
          </Button>
          <Button color="secondary" onClick={() => {}} className={`${parkingSpaces[selectedIndexParkingSpace] ? '' : 'disabled not-allowed ' } mb-3 float-left ml-4`}>
              <RecordsIcon className="white"/>
          </Button>

          {this.renderEnableButton()}
        </Col>
      </Col>
    );
  }

  renderSlot = (slot) => {
    const statusColor = slot.status === "free" ? 'bg-green' : 'bg-red'

    return (
      <React.Fragment key={slot.id}>
        <Col xs={12} className={`${styles.rowParkingSlot} position-relative px-0 d-flex justify-content-between align-items-center`}>
          <div className={`border-right border-dark ${styles.availabilitySpace} ${statusColor}`}>
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
                        <LocationIcon className={`mr-1 ${styles.svgDark}`} width="20" height="20"/>
                        <span className="general-text-1" >Locate</span>
                    </DropdownItem>
                  )
                }
                <DropdownItem className="p-3 text-grey">
                    <RecordsIcon className={`mr-2 ${styles.svgDark}`} width="15" height="15" />
                    <span className="general-text-1" >Session Records</span>
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
      toggleConfirmationModal={this.toggleCircleConfirmationModal}
      multiSelectContainerRef={this.multiSelectContainerRef}
      applyMarkingSlotOnParkingSpace={this.applyMarkingSlotOnParkingSpace}
      cancelMarkingSlotOnParkingSpace={this.cancelMarkingSlotOnParkingSpace}
      showCircleDrawSlowInfo={this.showCircleDrawSlowInfo}
      markSlotOnParkingSpace={markSlotOnParkingSpace.bind(this)}
      clearLocateSlotId={this.clearLocateSlotId}
      updateCirclePointer={updateCirclePointer.bind(this)}
    />
  }

  renderSlotPane = (parkingSpaceId) => {
    const { list, isRefreshingData } = this.state

    return (
      isRefreshingData ?
        (
          <Col className="p-3 row d-flex justify-content-center">
            <p className="general-text-1">
              <Loader/>
            </p>
          </Col>
        )
      : isEmpty(list) ?
        (
          <Col className="p-3 row d-flex justify-content-center">
            <p className="general-text-1">
              You don't have any parking space for now.
            </p>
          </Col>
        ) : (
          <Col className={`overflow-auto ${styles.slotContainer} p-0 mb-4`}>
            {list.map(slot => this.renderSlot(slot))}
          </Col>
        )

    )
  }

  renderSaveButton = () => {
    const { isEditing, isSaving } = this.state
    return (
      isEditing && (
        <Col>
          <Button color="success" className="px-5 py-2 mx-5 my-2 float-right"  onClick={this.saveCoordinateCircles}>
            {isSaving ? btnSpinner() : 'Save Changes'}
          </Button>
        </Col>
      )
    )
  }

  renderForm () {
    const { isSavingParkingSpace, parkingSpaces, selectedIndexParkingSpace } = this.state

    return (
      <Row onMouseMove={isUserInsideEditingZone.bind(this)}>
        <Col xs={12} md={3} className="p-0">
            <Col className="row d-flex justify-content-between align-items-center text-white bg-primary p-3 m-0" xs={12}>
              <span className="ml-4">Parking Spaces</span>
              <FontAwesomeIcon icon={faSync} className="pointer" onClick={this.refreshData}/>
            </Col>
            {this.renderSlotPane()}
        </Col>
        <Col xs={12} md={9} className="p-0 overflow-auto">

          <div className="mb-1">
            {this.renderUpperPanel()}
          </div>
          <div className={`${styles.mapContainer} mx-auto card border-dark d-flex justify-content-center align-items-center p-5`}>
            {
              isSavingParkingSpace ? <Loader/> : this.renderParkingSpace(parkingSpaces[selectedIndexParkingSpace] ? parkingSpaces[selectedIndexParkingSpace].url : null)
            }
          </div>
          {this.renderSaveButton()}
        </Col>
      </Row>
    )
  }

  renderModals = () => {
     const {
      showFileLayoutModal,
      slotIdToBeDeleted,
      fileLayoutModalShouldUpdate,
      parkingSpaces,
      selectedIndexParkingSpace,
      showCircleConfirmationModal,
      showParkingSpaceDeleteConfirmationModal,
      showUnsavedChangesModal
    } = this.state

    return (
      <React.Fragment>
        <FileLayoutModal
          defaultName={fileLayoutModalShouldUpdate ? parkingSpaces[selectedIndexParkingSpace].name : ''}
          defaultURL={fileLayoutModalShouldUpdate ? parkingSpaces[selectedIndexParkingSpace].url : ''}
          isOpen={showFileLayoutModal}
          toggleModal={this.toggleFileLayoutModal}
          saveParkingSpaceFile={this.saveParkingSpaceFile}
        />
        <ConfirmationModal
          text={"There are unsaved changes, are you sure you want to disable edit mode?"}
          accept={this.resetUnsavedChanges}
          cancel={this.toggleUnsavedChangesModal}
          isOpen={showUnsavedChangesModal}
        />
        <ConfirmationModal
          text={"Delete this markup?"}
          accept={this.deleteParkingSpaceFile}
          cancel={this.toggleParkingSpaceDeleteConfirmationModal}
          isOpen={showParkingSpaceDeleteConfirmationModal}
        />
        <ConfirmationModal
          text={"Delete this parking space?"}
          accept={() => this.deleteParkingSlotCircle(slotIdToBeDeleted)}
          cancel={this.cancelParkingSlotCircleDeletion}
          isOpen={showCircleConfirmationModal}
        />
      </React.Fragment>
    )
  }

  renderRecord () {
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
        {this.renderModals()}
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
