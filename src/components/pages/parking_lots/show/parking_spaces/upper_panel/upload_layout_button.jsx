import React, { useContext } from 'react';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import { ReactComponent as UploadSVG } from 'assets/upload.svg';

import { ParkingPlanContext } from '../index'

const UploadLayoutButton = () => {
  const parkingPlanContext = useContext(ParkingPlanContext)

  const {
    parkingPlans,
    selectedIndexParkingPlan
  } = parkingPlanContext.state;

  const {
      selectIndexParkingPlan,
      addNewMap
  } = parkingPlanContext.func;

  return (
    parkingPlans[selectedIndexParkingPlan] ? (
      <UncontrolledDropdown className="float-left">
        <DropdownToggle caret color="secondary">
          {parkingPlans[selectedIndexParkingPlan].name}
        </DropdownToggle>
        <DropdownMenu className="p-0">
          {
            parkingPlans.map((parkingPlan, index) => {
              return (
                  <DropdownItem
                    className={`${ parkingPlan.id === parkingPlans[selectedIndexParkingPlan].id ? 'bg-grey-dark text-white' : ''} py-2`}
                    key={parkingPlan.id}
                    onClick={() => selectIndexParkingPlan(index, parkingPlan.id)}
                    disabled={parkingPlan.id === parkingPlans[selectedIndexParkingPlan].id}
                  >
                    {parkingPlan.name}
                  </DropdownItem>
              )
            })
          }
          <DropdownItem divider className="m-0" />
          <DropdownItem onClick={addNewMap} className="py-2">
            <span className="text-primary">+ ADD NEW</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    ) : (
      <Button onClick={addNewMap} className="mb-3 float-left bg-grey-dark ml-4">
        <UploadSVG className="mr-2"/>
        Add a Layout
      </Button>
    )
  )
}

export default UploadLayoutButton;