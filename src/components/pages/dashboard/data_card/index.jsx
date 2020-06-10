import React, { Component } from 'react';
import { isEmpty } from 'underscore';
import {
  Col,
  Card,
  CardTitle,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as EllipsiIcon } from 'assets/ellipsi_icon.svg'
import moment from 'moment';
import DateModal from '../date_modal'
import ParkingLotSelect from './parking_lot_select'
/* Actions */
/* API */
import { filterFetcher } from 'api/statistics';
/* Base */
/* Helpers */
import Loader from 'components/helpers/loader';
/* Modules */
import style from './data_card.module.sass'

class DataCard extends Component {

  state = {
    modalIsOpen: false,
    data: {},
    from: null,
    to: null,
    datesToFilter: [
      {
        from: moment(),
        to: null,
        text: '(Today)',
        since: 'since yesterday'
      },
      {
        from: moment().weekday(1),
        to: moment().weekday(7),
        text: '(Week)',
        since: 'since last week'
      },
      {
        from: moment().startOf('month'),
        to: moment().endOf('month'),
        text: '(This Month)',
        since: 'since last month'
      }
    ],
    currentSinceText: 'last week'
  }

  componentDidUpdate(prevProps) {
    const { reload, from, to, stopRefreshing, reset } = this.props
    if(reload) {
      stopRefreshing()
      if(reset) {
        this.fetchData(moment().weekday(1).format('YYYY-M-D'), moment().weekday(7).format('YYYY-M-D'), 'since last week')
      } else {
        this.fetchData(from ? from : this.state.from, to ? to : this.state.to, from ? '' : this.state.currentSinceText )
      }
    }
  }

  fetchData = (from, to, since = this.state.currentSinceText) => {
    const { type } = this.props
    this.setState({
      data: {},
      modalIsOpen: false,
      currentSinceText: ''
    })
    filterFetcher({
      type,
      range: {
        from,
        to
      }
    })
      .then((res) => {
        this.setState({
          data: res.data,
          currentSinceText: since,
          from,
          to
        })
      })
      .catch(() => {

      })
  }

  updateData = (parkingLotIds) => {
    const { type } = this.props
    const { from, to } = this.state
    filterFetcher({
      type,
      parkingLotIds,
      range: {
        from,
        to
      }
    })
      .then((res) => {
        this.setState({
          data: res.data,
        })
      })
      .catch(() => {

      })
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const { data, datesToFilter, currentSinceText, modalIsOpen } = this.state
    const { parkingLots, display, maxDate } = this.props

    if(!display) {
      return null
    }

    return (
      <React.Fragment>
        <Card body className={`${style.borderPrimary} h-100`}>
          {
            isEmpty(data) ? (
            <Loader/>
            ) : (
              <React.Fragment>
                <CardTitle className={`${style.cardTitle} row`}>
                  <Col className={`${style.title} pr-0`}>
                    {data.title}
                  </Col>
                  <Col xs="auto" className="d-flex align-items-center pl-0">
                  <span className={style.secondaryText}>{data.range_current_period} </span>
                  {
                    !data.disable_date_range && (
                      <UncontrolledDropdown>
                        <DropdownToggle tag="span" className="pointer">
                          <EllipsiIcon width="12" height="12"/>
                        </DropdownToggle>
                        <DropdownMenu right className={style.dateDropdown}>
                          {
                            datesToFilter.map(data => (
                              <DropdownItem key={data.from.format('YYYY-M-D')} onClick={() => this.fetchData(data.from.format('YYYY-M-D'), data.to ? data.to.format('YYYY-M-D') : null, data.since)}>
                                <span className="general-text-1" >{data.from.format('MM/DD')}{data.to ? `-${data.to.format('MM/DD')}` : ''} {data.text}</span>
                              </DropdownItem>
                            ))
                          }
                          <DropdownItem onClick={() => this.setState({ modalIsOpen: true })}>
                            <span className="general-text-1" >Select custom...</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    )
                  }
                  </Col>
                </CardTitle>
                <div className="row">
                  <Col className={`${style.currentValue} pr-0`}>
                    {data.result}
                  </Col>
                  <Col xs="auto" className="pl-0">
                    <ParkingLotSelect
                      options={parkingLots}
                      updateData={this.updateData}
                    />
                  </Col>
                  {
                    data.compare_with_previous_period && (
                      <Col xs="12" className="mt-1">
                        <FontAwesomeIcon color={data.compare_with_previous_period.raise ? 'green' : 'red'} icon={data.compare_with_previous_period.raise ? faArrowUp : faArrowDown} className="mr-1" />
                        <strong className={data.compare_with_previous_period.raise ? style.raise : style.less}>{data.compare_with_previous_period.percentage} </strong>
                        <span className={style.secondaryText}>{currentSinceText}</span>
                      </Col>
                    )
                  }
                  {
                    data.result_previous_period && (
                      <Col xs="12" className="mt-1">
                        <span className={style.secondaryText}> {data.result_previous_period} {currentSinceText ? `- ${currentSinceText}`: ''}</span>
                      </Col>
                    )
                  }
                  {/*
                  <Col xs="12" className="justify-content-end pointer d-flex mt-2">
                    <span className="text-primary">MORE </span>
                  </Col>
                  */}
                </div>
              </React.Fragment>
            )
          }
        </Card>
        <DateModal maxDate={maxDate} isOpen={modalIsOpen} apply={this.fetchData} toggleModal={() => this.setState({ modalIsOpen: false })} />
      </React.Fragment>
    )
  }
}

export default DataCard;