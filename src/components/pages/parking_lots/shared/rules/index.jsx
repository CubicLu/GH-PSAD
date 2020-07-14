import React from 'react';
import TooltipInfo from 'components/helpers/tooltip_info';
import Select from 'react-select';
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg'

import styles from './rules.module.sass'

const stylesWithError = (error) => ({
  control: (provided) => {
    return ({
    ...provided,
   borderColor: error ? '#FB745B' : ''
  })}
});

function renderRecords () {
  const { list, dropdown } = this.state;
  return list.map((record, idx) => {
    const { status, agency_id } = record;
    const error = status && !agency_id
    const currentAgency = dropdown.agencies.find(agency => agency.value === record.agency_id) || {}
    return (
      <tr key={idx} className="non-hover">
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
          <TooltipInfo className="ml-2" text={record.description} target={`rule_${record.id}`} />
        </td>
        <td>
          <Select
            value={{value: currentAgency.value, label: currentAgency.label}}
            styles={stylesWithError(error)}
            placeholder="Agencies"
            onChange={(selectedOptions) => {
              const newList = list
              newList[idx].agency_id = selectedOptions.value
              this.setState({
                list: newList
              })
            }}
            options={dropdown.agencies.map(agency => ({value: agency.value, label: agency.label}))}
          />
        </td>
        <td>
          <div className="d-flex align-items-center pointer" onClick={() => this.setState({showModalRecipient: true, currentRule: record })}>
            <span className="ml-5 mr-4">{record.recipients.length} users</span>
            <EditIcon className="svg-primary ml-5 mb-2" />
          </div>
        </td>
      </tr>
    );
  });
};

export {
  renderRecords
}