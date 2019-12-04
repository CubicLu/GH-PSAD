import React, { useContext } from 'react';
import Loader from 'components/helpers/loader';
import { isEmpty } from 'underscore';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import styles from '../parking_plans.module.sass'
import { ReactComponent as LocationIcon } from 'assets/location_icon.svg'
import { ReactComponent as RecordsIcon } from 'assets/records_icon.svg'
import { ReactComponent as EllipsiIcon } from 'assets/ellipsi_icon.svg'

import { ParkingPlanContext } from '../index'

const SlotElement = (slot) => {
  const parkingPlanContext = useContext(ParkingPlanContext)
  const { locateSlotOnParkingPlan, setSessionRecords } = parkingPlanContext.func

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
              <EllipsiIcon width="15" height="15"/>
            </DropdownToggle>
            <DropdownMenu right>
              {
                slot.coordinate_parking_plan && (
                  <DropdownItem onClick={() => locateSlotOnParkingPlan(slot.id)} className="p-3 text-grey">
                      <LocationIcon className={`mr-1 svg-dark`} width="20" height="20"/>
                      <span className="general-text-1" >Locate</span>
                  </DropdownItem>
                )
              }
              <DropdownItem onClick={() => setSessionRecords(slot.active_parking_session)} className="p-3 text-grey not-allowed">
                  <RecordsIcon className={`mr-2 svg-dark`} width="15" height="15" />
                  <span className="general-text-1" >Session Records</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Col>
    </React.Fragment>
  )
}

const SlotPane = () => {

  const parkingPlanContext = useContext(ParkingPlanContext)
  const { list, isRefreshingData } = parkingPlanContext.state

  return (
    isRefreshingData ?
      (
        <Col className="p-3 row d-flex justify-content-center">
          <div className="general-text-1">
            <Loader/>
          </div>
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
          {list.map(slot => SlotElement(slot))}
        </Col>
      )
  )
}

export default SlotPane;