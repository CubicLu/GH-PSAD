import React, { useContext } from 'react';
import TooltipInfo from 'components/helpers/tooltip_info';

import { ParkingPlanContext } from '../../index'
import styles from './enable_button.module.sass'

const EnableButton  = () => {

  const parkingPlanContext = useContext(ParkingPlanContext)

  const {
    isEditing,
    parkingPlans,
    selectedIndexParkingPlan
  } = parkingPlanContext.state;

  const {
    toggleEdit
  } = parkingPlanContext.func;

  return (
    <div
      className={`d-flex float-right justify-content-center align-items-center ${styles.toggleGroup}`}
      onClick={toggleEdit}
    >
      <TooltipInfo text="Edit Mode allows you to create, update or delete markups on the parking lot layout screen." target="recipients"  />
      <span className="mx-2">Markup Mode</span>
      <input type="checkbox" className="d-none" readOnly checked={isEditing ? 'checked' : ''} />
      <div className={`${styles.onoffswitch}`} >
          <div className={styles['onoffswitch-label']}>
              <div className={styles['onoffswitch-inner']}></div>
              <div className={`${parkingPlans[selectedIndexParkingPlan] ? '' : styles.disabledToggle} ${styles['onoffswitch-switch']}`}></div>
          </div>
      </div>
    </div>
  )
}

export default EnableButton;