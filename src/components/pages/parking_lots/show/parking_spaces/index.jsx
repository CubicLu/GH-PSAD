import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Row,
  Nav,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSync } from '@fortawesome/free-solid-svg-icons';
import { isEmpty, isMatch } from 'underscore';
import {
  isUserInsideEditingZone
} from './mouse_events'

import ParkingPlanEditableZone from './parking_plan_editable_zone'
import FileLayoutModal from './file_layout_modal'
import UpperPanel from './upper_panel'
import SlotPane from './slot_pane'

/* Actions */
import { SET_RECORD } from 'actions/parking_lots';
/* API */
import { index as indexParkingSlot } from 'api/parking_slots';
import { show, createParkingPlan, deleteParkingPlan, updateParkingPlan } from 'api/parking_lots';
/* Base */
/* Helpers */
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import ConfirmationModal from 'components/helpers/modals/confirmation';
import { btnSpinner } from 'components/helpers';
/* Modules */
import withFetching from 'components/modules/with_fetching';
import resourceFetcher from 'components/modules/resource_fetcher';
import connectRecord from 'components/modules/connect_record';
import withCurrentUser from 'components/modules/with_current_user';
/* Assets */
import styles from './parking_plans.module.sass'

/**
  * @state (Bool)  isEditing indicate if the user is in editing mode
  * @state (Bool) isInsideEditingZone indicate if the user pointer is inside the layout parking space
  * @state (Bool) isMovingExistingSlot indicate if the user is moving a circle that was already on parking space
  * @state (Bool) isRefreshingData indicate if the suer pressed the reload button on the parking slot pane
  * @state (Array) drawedSlotContainer contains circle drawed on top of the parking space
  * @state (Array) tmpDrawedSlotContainer contains the initial data of drawedSlotContainer variable to check if the data was changed when the user tries to turn off the edit mode
  * @state (Array) list contains a list of parking slot and its state
  * @state (Array) parkingPlans contains a list of images associated to Parking Lot
  * @state (Integer) slotIdClicked contains the ID of the slot selected on 'Edit mode'
  * @state (Integer) selectedIndexParkingPlan contains the index of the current parking space where the user is working on
  * @state (Object) newCircleInfo store temporaly the information about the new circle that will be created
  * @state (Integer) slotIdToBeDeleted store temporaly the slot id to wait user deletion confirmation
*/

export const ParkingPlanContext = React.createContext();

class ParkingPlans extends Component {
  state = {
    /* Modal */
    showCircleConfirmationModal: false,
    showParkingPlanDeleteConfirmationModal: false,
    showUnsavedChangesModal: false,
    showFileLayoutModal: false,
    showLocateSlotModalConfirmation: false,
    /* Loader State */
    isRefreshingData: false,
    isSavingCoordinates: false,
    isSavingParkingPlan: false,
    isListFetching: true,

    fileLayoutModalShouldUpdate: false,
    list: [],
    parkingPlans: [],
    selectedIndexParkingPlan: 0,
    slotIdToBeDeleted: null,
    errors: {},
    isEditing: false,
    isInsideEditingZone: false,
    isMovingExistingSlot: false,
    isChangingIdToExistingSlot: false,
    slotIdClicked: null,
    locateSlotId: null,
    newCircleInfo: {},
    drawedSlotContainer: [],
    tmpDrawedSlotContainer: []
  }

  static contextType = AlertMessagesContext

  mapRef = React.createRef();
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
      isMovingExistingSlot: false,
      newCircleInfo: {},
      slotIdClicked: null,
      isEditing: false,
      isChangingIdToExistingSlot: false
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

  clearLocateSlotId = () => this.setState({ locateSlotId: null })

  toggleFileLayoutModal = () => this.setState({ showFileLayoutModal: !this.state.showFileLayoutModal})

  toggleUnsavedChangesModal = () =>  this.setState((state) => ({ showUnsavedChangesModal: !state.showUnsavedChangesModal }))

  toggleParkingPlanDeleteConfirmationModal = () => this.setState((state) => ({ showParkingPlanDeleteConfirmationModal:  !state.showParkingPlanDeleteConfirmationModal }))

  hideConfirmationLocateSlotModal = () => this.setState({ showLocateSlotModalConfirmation: false, tmplocateSlotId: null })

  toggleCircleConfirmationModal = (slotId) => {
    this.setState({
      slotIdToBeDeleted: slotId,
      showCircleConfirmationModal: true
    });
  }

  cancelParkingSlotCircleDeletion = () => {
    this.setState({
      slotIdToBeDeleted: null,
      slotIdClicked: null,
      showCircleConfirmationModal: false
    })
  }

  willDataBeErased = () => {
    const { drawedSlotContainer, tmpDrawedSlotContainer } = this.state;
    const willErase = drawedSlotContainer.length !== tmpDrawedSlotContainer.length ? false :
    drawedSlotContainer.every((slot, index) => {
      return isMatch(slot, tmpDrawedSlotContainer[index])
    })

    return !willErase
  }

  toggleEdit = () => {
    const { drawedSlotContainer, parkingPlans, selectedIndexParkingPlan, isEditing } = this.state;

    if(parkingPlans[selectedIndexParkingPlan]) {

      if(isEditing && this.willDataBeErased()) {
          this.toggleUnsavedChangesModal();
          return
      }
      const copyDrawedSlotContainer = drawedSlotContainer

      this.setState({
        tmpDrawedSlotContainer: [...copyDrawedSlotContainer],
        slotIdToBeDeleted: null,
        showCircleConfirmationModal: false,
        isInsideEditingZone: false,
        isMovingExistingSlot: false,
        newCircleInfo: {},
        slotIdClicked: null,
        isEditing: !isEditing
      })
    }
  }

  refreshData = () => {
    const { record, startFetching } = this.props
    const { list } = this.state
    this.setState({ isRefreshingData: true })
    return startFetching(
      indexParkingSlot({
        parkingLotId: record.id
      }))
        .then(response => {
          const newList = list.map(slot => {
              return response.data.find( dataSlot => dataSlot.id === slot.id )
          })
          this.setState({
            list: newList
          })
          return response;
        })
        .finally(() => this.setState({isRefreshingData: false}))

  }

  // Sync Parking Slot marked on the map
  syncSlotContainerOnMap = () => {
    const { parkingPlans, selectedIndexParkingPlan, isEditing, list } = this.state
    let drawedSlotContainer = [];
    if(!isEmpty(parkingPlans)){
      const parkingPlanId = parkingPlans[selectedIndexParkingPlan || 0].id ;
      let setSlotList = list.filter(slot => slot.coordinate_parking_plan);

      if(setSlotList) {
        const slotList = setSlotList.filter(slot => slot.coordinate_parking_plan.image_id === parkingPlanId)
        drawedSlotContainer = slotList.map(slot => slot.coordinate_parking_plan)
      }
    }

    this.setState({
      drawedSlotContainer,
      tmpDrawedSlotContainer: isEditing ? drawedSlotContainer : []
    })

  }

  // Change parking space
  selectIndexParkingPlan = (index) => {
    this.resetData();
    this.setState({
      selectedIndexParkingPlan: index
    }, this.syncSlotContainerOnMap)
  }


  // Cancel when user selects on the parking space in editing mode
  cancelMarkingSlotOnParkingPlan = () => {
    this.setState({
      newCircleInfo: {},
      isChangingIdToExistingSlot: false,
      slotIdClicked: null
    })
  }

  // Add new point on the parking space after select parking slot on dropdown
  applyMarkingSlotOnParkingPlan = (selectedOptions) => {
    const { isChangingIdToExistingSlot } = this.state
    if(isChangingIdToExistingSlot)  {
      this.changeIdToSlotOnParkingPlan(selectedOptions);
      return;
    }

    const newCircleInfo = this.state.newCircleInfo;
    newCircleInfo.parking_slot_id = selectedOptions.value;

    this.setState({
      newCircleInfo: {},
      drawedSlotContainer: [
        ...this.state.drawedSlotContainer,
        newCircleInfo
      ]
    })
  }

  changeIdToSlotOnParkingPlan = (selectedOptions) => {
    const { slotIdClicked } = this.state
    const drawedSlotContainer = [...this.state.drawedSlotContainer]
    let replacementIndex;
    const newSlot = drawedSlotContainer.find((slot, index ) => {
      if(slot.parking_slot_id === slotIdClicked) {
        replacementIndex = index;
        return true
      }
      return false
    });
    newSlot.parking_slot_id = selectedOptions.value;
    drawedSlotContainer.splice(replacementIndex, 1);
    this.setState({
      newCircleInfo: {},
      isChangingIdToExistingSlot: false,
      drawedSlotContainer: [
        newSlot,
        ...drawedSlotContainer
      ]
    })
  }

  onMouseDownOnSlotCircle = (id) => {
    const { isEditing } = this.state
    if(isEditing) {
      this.setState({
        slotIdClicked: id
      })
    }
  }

  onMouseDragOnSlotCircle = () => this.setState({ isMovingExistingSlot: true })

  onMouseUpOnSlotCircle = (e) => {
    const { isMovingExistingSlot, isEditing, slotIdClicked } = this.state

    if(isEditing && isMovingExistingSlot) {
      const target = e.target.tagName.toLowerCase() === 'p' ? e.target.parentElement : e.target
      const leftTarget = target.getBoundingClientRect().left
      const topTarget = target.getBoundingClientRect().top

      const offsetX = leftTarget - this.mapRef.current.getBoundingClientRect().left;
      const offsetY = topTarget - this.mapRef.current.getBoundingClientRect().top;

      const drawedSlotContainer = [...this.state.drawedSlotContainer]
      const slotToDelete = drawedSlotContainer.findIndex(drawedSlot => drawedSlot.parking_slot_id === slotIdClicked)
      drawedSlotContainer.splice(slotToDelete, 1)

      this.setState({
        newCircleInfo: {},
        slotIdClicked: null,
        isMovingExistingSlot: false,
        drawedSlotContainer: [
          ...drawedSlotContainer,
          {
            x: offsetX,
            y: offsetY,
            parking_slot_id: slotIdClicked
          }
        ]
      })
    }

    this.setState({
      slotIdClicked: isMovingExistingSlot ? null : slotIdClicked,
      isMovingExistingSlot: false
    })
  }

  editParkingSlotCircle = () =>  this.setState({ isChangingIdToExistingSlot: true })

  // Show info of the clicked circle
  showCircleDrawSlowInfo = (id) => {
    this.setState({
      slotIdClicked: id,
      isChangingIdToExistingSlot: false, // To reset SlotAssignmentBar in case decide to click another one while editing ID
      newCircleInfo: {}
    })
  }

  // Locate the parking slot on any pakring space
  locateSlotOnParkingPlan = (id) => {
    const { list, parkingPlans, tmplocateSlotId, selectedIndexParkingPlan, isEditing } = this.state
    const slot = list.find(slot => slot.id === (tmplocateSlotId || id))
    const newSelectedIndexParkingPlan = parkingPlans.findIndex(parkingPlan => parkingPlan.id === slot.coordinate_parking_plan.image_id)

    if(!tmplocateSlotId && newSelectedIndexParkingPlan !== selectedIndexParkingPlan && isEditing && this.willDataBeErased() ) {
      this.setState({
        showLocateSlotModalConfirmation: true,
        tmplocateSlotId: id
      })
      return
    }

    this.setState({
      locateSlotId: id,
      showLocateSlotModalConfirmation: false,
      tmplocateSlotId: null,
      selectedIndexParkingPlan: newSelectedIndexParkingPlan
    }, newSelectedIndexParkingPlan !== selectedIndexParkingPlan ? this.syncSlotContainerOnMap : null)
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

  deleteParkingPlanFile = () => {
    const { record, startFetching } = this.props
    const { selectedIndexParkingPlan, parkingPlans } = this.state
    this.setState({
      showParkingPlanDeleteConfirmationModal: false,
      isSavingParkingPlan: true
    })

    startFetching(deleteParkingPlan({
      parkingLotId: record.id,
      parkingPlanId: parkingPlans[selectedIndexParkingPlan].id
    }))
      .then(responseDeleteParkingPlan => {
        this.refreshData()
          .then(response => {
            this.resetData()
            this.setState({
              selectedIndexParkingPlan: 0,
              parkingPlans: responseDeleteParkingPlan.data.parking_plans,
              list: response.data
            }, this.syncSlotContainerOnMap);
          })
          .catch((error) => {
            this.renderErrorMessage()
            console.log(error);
          })
          .finally(() => this.setState({ isSavingParkingPlan: false }))
      })
      .catch((err) => {
        this.renderErrorMessage()
        console.error(err);
        this.setState({ isSavingParkingPlan: false })
      })
  }

  /**
    SAVE ACTIONS
  */

  saveCoordinateCircles = () => {
    const { startFetching, record } = this.props;
    const { selectedIndexParkingPlan, parkingPlans, drawedSlotContainer } = this.state

    this.setState({ isSavingCoordinates: true })

    startFetching(
      updateParkingPlan({
        parkingLotId: record.id,
        parkingPlanCoordinates: drawedSlotContainer,
        parkingPlanId: parkingPlans[selectedIndexParkingPlan].id
      })
    ).then(() => {
      this.refreshData()
        .then(response => {
          this.setState({
            tmpDrawedSlotContainer: drawedSlotContainer
          })
          this.context.addAlertMessages([{
            type: 'Success',
            text: 'Parking Space data saved succesfully'
          }]);
        })
        .catch((error) => {
          this.renderErrorMessage()
          console.log(error);
        })
        .finally(() => this.setState({ isSavingCoordinates: false }))
    })

  };

  updateParkingPlanFile = (file, fileName) => {
    const { parkingPlans, selectedIndexParkingPlan } = this.state
    const { startFetching, record } = this.props;
    const base64 = file ? file.base64 : ''
    this.setState({
      fileLayoutModalShouldUpdate: false,
      isSavingParkingPlan: true
    })

    startFetching(
      updateParkingPlan({
        parkingLotId: record.id,
        name: fileName,
        parkingPlanImage: base64,
        parkingPlanId: parkingPlans[selectedIndexParkingPlan].id
      })
    )
      .then((response) => this.setState({ parkingPlans: response.data.parking_plans }))
      .finally(() => this.setState({ isSavingParkingPlan: false }))
  }

  saveParkingPlanFile = (file, fileName) => {
    if(this.state.fileLayoutModalShouldUpdate) {
      this.updateParkingPlanFile(file, fileName);
      return;
    }

    if(file) {
      const { record, startFetching } = this.props
      this.setState({ isSavingParkingPlan: true })
      startFetching(
        createParkingPlan({
        parkingLotId: record.id,
        parkingPlanImage: file.base64,
        name: fileName
      }))
        .then(response => {
          this.resetData()
          // Show the map previously uploaded and update parking spaces layout
          this.setState({
            selectedIndexParkingPlan: response.data.parking_plans.length - 1,
            parkingPlans: response.data.parking_plans
          }, this.syncSlotContainerOnMap)
        })
        .catch((err) => {
          this.renderErrorMessage()
          console.error(err);
        })
        .finally(() => this.setState({ isSavingParkingPlan: false }))
    }
  }

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

  /**
    RENDER ACTIONS
  */

  renderErrorMessage = () => {
    this.context.addAlertMessages([{
      type: 'Error',
      text: 'An error has occurred'
    }]);
  }

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

  renderEmptyParkingPlan = () => {
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

  renderParkingPlan = (parkingPlanImageURL) => {

    if (!parkingPlanImageURL) {
      return this.renderEmptyParkingPlan()
    }

    return <ParkingPlanEditableZone
      parkingPlanImageURL={parkingPlanImageURL}
    />
  }


  renderSaveButton = () => {
    const { isEditing, isSavingCoordinates } = this.state
    return (
      isEditing && (
        <Col>
          <Button color="success" className="px-5 py-2 mx-5 my-2 float-right"  onClick={this.saveCoordinateCircles}>
            {isSavingCoordinates ? btnSpinner() : 'Save Changes'}
          </Button>
        </Col>
      )
    )
  }

  renderForm () {
    const { isSavingParkingPlan, parkingPlans, selectedIndexParkingPlan } = this.state

    return (
      <Row onMouseMove={isUserInsideEditingZone.bind(this)} className="pb-5">
        <Col xs={12} md={3} className="p-0">
            <Col className="row d-flex justify-content-between align-items-center text-white bg-primary p-3 m-0" xs={12}>
              <span className="ml-4">Parking Spaces</span>
              <FontAwesomeIcon icon={faSync} className="pointer" onClick={this.refreshData}/>
            </Col>
            <SlotPane/>
        </Col>
        <Col xs={12} md={9} className="p-0 overflow-auto">
          <div className="mb-1">
            <UpperPanel/>
          </div>
          <div className={`${styles.mapContainer} mx-auto card border-dark d-flex justify-content-center align-items-center p-5`}>
            {
              isSavingParkingPlan ? <Loader/> : this.renderParkingPlan(parkingPlans[selectedIndexParkingPlan] ? parkingPlans[selectedIndexParkingPlan].url : null)
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
      parkingPlans,
      selectedIndexParkingPlan,
      showCircleConfirmationModal,
      showParkingPlanDeleteConfirmationModal,
      showUnsavedChangesModal,
      showLocateSlotModalConfirmation
    } = this.state

    return (
      <React.Fragment>
        <FileLayoutModal
          defaultName={fileLayoutModalShouldUpdate ? parkingPlans[selectedIndexParkingPlan].name : ''}
          defaultURL={fileLayoutModalShouldUpdate ? parkingPlans[selectedIndexParkingPlan].url : ''}
          isOpen={showFileLayoutModal}
          toggleModal={this.toggleFileLayoutModal}
          saveParkingPlanFile={this.saveParkingPlanFile}
        />
        <ConfirmationModal
          text={"There are unsaved changes, are you sure you want to disable edit mode?"}
          accept={this.resetUnsavedChanges}
          cancel={this.toggleUnsavedChangesModal}
          isOpen={showUnsavedChangesModal}
        />
        <ConfirmationModal
          text={"The parking slot you are trying to locate is in another plan, the changes won't be saved if you proceed, are you sure do you want ot proceed?"}
          accept={this.locateSlotOnParkingPlan}
          cancel={this.hideConfirmationLocateSlotModal}
          isOpen={showLocateSlotModalConfirmation}
        />
        <ConfirmationModal
          text={"Delete this markup?"}
          accept={this.deleteParkingPlanFile}
          cancel={this.toggleParkingPlanDeleteConfirmationModal}
          isOpen={showParkingPlanDeleteConfirmationModal}
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
      <ParkingPlanContext.Provider value={{
        state: {...this.state},
        func: this
      }}>
        <Row className="m-0">
          <Col xs={12} className="mb-4 bg-white">
            {this.renderHeader()}
          </Col>
          <Col xs={12}>
            {this.renderForm()}
          </Col>
          {this.renderModals()}
        </Row>
      </ParkingPlanContext.Provider>
    );
  }

  fetchData = (record) => {
    const { startFetching } = this.props;

    if (record) {
      startFetching(
        indexParkingSlot({
          parkingLotId: record.id
        })
      )
        .then(response => {
          const updateDrawedSlotContainer = response.data.length > 0 ? this.syncSlotContainerOnMap : null
          this.setState({
            isListFetching: false,
            list: response.data,
            parkingPlans: record.parking_plans
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

ParkingPlans.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  withFetching(
    withCurrentUser(ParkingPlans)
  )
);
