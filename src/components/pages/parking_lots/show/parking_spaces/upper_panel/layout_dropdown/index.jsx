import React, { useContext } from 'react';
import { ReactComponent as UploadIcon } from 'assets/upload.svg';

import { ParkingPlanContext } from '../../index';
import Dropdown from 'components/base/dropdown';
import Button from 'components/base/button';
import styles from './layout_dropdown.module.sass';

const LayoutDropdown = () => {
  const parkingPlanContext = useContext(ParkingPlanContext);

  const {
    parkingPlans,
    selectedIndexParkingPlan
  } = parkingPlanContext.state;

  const {
    selectIndexParkingPlan,
    addNewMap
  } = parkingPlanContext.func;

  if (!parkingPlans[selectedIndexParkingPlan]) {
    return (
      <Button
        status="secondary"
        onClick={addNewMap}
        className={styles.btnAddLayout}
      >
        <UploadIcon className="mr-2"/>
        Add a Layout
      </Button>
    );
  }
  return (
    <Dropdown
      options={parkingPlans.map(({ name }, i) => ({ value: i, label: name }))}
      customOptions={[{
        label: '+ ADD NEW',
        onClick: addNewMap,
        className: styles.layoutOptionAddNew
      }]}
      onChange={(selectedOptions) => selectIndexParkingPlan(selectedOptions[0])}
      className={styles.layoutDropdown}
      selectedOptionClassName={styles.layoutSelectedOption}
    />
  );
};

export default LayoutDropdown;
