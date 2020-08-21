import React from 'react';
import TooltipInfo from 'components/helpers/tooltip_info';
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg'

import styles from './rules.module.sass';
import Toggle from 'components/base/toggle';
import Dropdown from 'components/base/dropdown';

function renderRecords () {
  const { list, dropdown } = this.state;
  const handleToggleStatus = (idx) => {
    const updatedList = list.map((item, i) => {
      if (i !== idx) return item;
      return {
        ...item,
        status: !item.status
      };
    });
    this.setState({
      list: updatedList
    });
  };
  const handleAgencyChange = (idx, selectedValues) => {
    if (!Array.isArray(selectedValues) || selectedValues.length === 0) return;
    const updatedList = list.map((item, i) => {
      if (i !== idx) return item;
      return {
        ...item,
        agency_id: selectedValues[0]
      };
    });
    this.setState({
      list: updatedList
    });
  };
  return list.map((record, idx) => {
    return (
      <tr key={idx} className={`non-hover ${record.status ? styles.active : ''}`}>
        <td>
          <Toggle
            value={record.status}
            onChange={() => handleToggleStatus(idx)}
          />
        </td>
        <td>
          {record.name}
          <TooltipInfo className="ml-1" text={record.description} target={`rule_${record.id}`} />
        </td>
        <td>
          <Dropdown
            options={dropdown.agencies}
            onChange={(selectedValues) => handleAgencyChange(idx, selectedValues)}
          />
        </td>
        <td
          className="pointer"
          onClick={() => this.setState({ showModalRecipient: true, currentRule: record })}
        >
          <span className="ml-3 mr-4">{record.recipients.length} users</span>
          <EditIcon className="svg-primary" />
        </td>
      </tr>
    );
  });
};

export {
  renderRecords
}