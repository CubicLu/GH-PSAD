import React, { useState } from 'react';
import { ReactComponent as Info } from 'assets/info_icon.svg'
import { Tooltip } from 'reactstrap';

const TooltipInfo = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <React.Fragment>
      <Info className={props.className} width="14" height="14" id={props.target}/>
      <Tooltip placement="top" isOpen={tooltipOpen} target={props.target} toggle={toggle}>
        {props.text}
      </Tooltip>
    </React.Fragment>
  )
}

export default TooltipInfo;