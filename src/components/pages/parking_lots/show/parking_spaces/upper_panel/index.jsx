import React, { useContext } from 'react';
import {
  Button,
  Col,
} from 'reactstrap';

import { ReactComponent as EditIcon } from 'assets/edit_icon.svg'
import { ReactComponent as RecordsIcon } from 'assets/records_icon.svg'
import {ReactComponent as TrashIcon } from 'assets/trash_icon.svg';

import { ParkingPlanContext } from '../index'
import EnableButton from './enable_button'
import UploadLayoutButton from './upload_layout_button'

const UpperPanel = () => {
    const parkingPlanContext = useContext(ParkingPlanContext)

    const {
      parkingPlans,
      selectedIndexParkingPlan
    } = parkingPlanContext.state;

    const {
      editCurrentMap,
      toggleParkingPlanDeleteConfirmationModal
    } = parkingPlanContext.func

    return (
      <Col className="row">
        <Col sm={12} className="mb-5">
          <p className="m-0 h2-title">Parking Lot Layout</p>
          <hr className="w-100 position-absolute"/>
        </Col>
        <Col>
          <UploadLayoutButton/>
          <Button color="primary" onClick={editCurrentMap} className={`${parkingPlans[selectedIndexParkingPlan] ? '' : 'disabled not-allowed ' } mb-3 float-left ml-4`}>
              <EditIcon />
          </Button>
          <Button color="danger" onClick={toggleParkingPlanDeleteConfirmationModal} className={`${parkingPlans[selectedIndexParkingPlan] ? '' : 'disabled not-allowed ' } mb-3 float-left ml-4`}>
              <TrashIcon className="svg-white" />
          </Button>
          <Button color="secondary" onClick={() => {}} className={`${parkingPlans[selectedIndexParkingPlan] ? '' : 'disabled  ' } mb-3 not-allowed float-left ml-4`}>
              <RecordsIcon width="18" height="18" className="white"/>
          </Button>
          <EnableButton/>
        </Col>
      </Col>
    );
  }

export default UpperPanel;