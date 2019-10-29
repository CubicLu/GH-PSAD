import React from 'react';
import TooltipInfo from 'components/helpers/tooltip_info';
import Select from 'react-select';

import styles from './rules.module.sass'

function renderRecords () {
  const { list, dropdown } = this.state;
  return list.map((record, idx) => {
    const currentAgency = dropdown.agencies.find(agency => agency.id === record.agency_id) || {}
    return (
      <tr key={idx}>
        <td>
          <div className={styles.toggleGroup} onClick={() => {
            const newList = list
            newList[idx].status = !record.status
            this.setState({
              list: newList
            })
          }}>
            <input type="checkbox" className="d-none" checked={record.status ? 'checked' : ''} />
            <div className={`${styles.onoffswitch}`} >
                <div className={styles['onoffswitch-label']}>
                    <div className={styles['onoffswitch-inner']}></div>
                    <div  className={styles['onoffswitch-switch']}></div>
                </div>
            </div>
          </div>
        </td>
        <td>
          {record.name}
          <TooltipInfo className="ml-2" text="Rule name" target="recipients" />
        </td>
        <td>
          <Select
            value={{value: currentAgency.id, label: currentAgency.name}}
            placeholder="Agencies"
            onChange={(selectedOptions) => {
              const newList = list
              newList[idx].agency_id = selectedOptions.value
              this.setState({
                list: newList
              })
            }}
            options={dropdown.agencies.map(agency => ({value: agency.id, label: agency.name}))}
          />
        </td>
        <td onClick={() => this.setState({showModalRecipient: true, currentRule: record })}>{record.recipients.length} users</td>
      </tr>
    );
  });
};

export {
  renderRecords
}