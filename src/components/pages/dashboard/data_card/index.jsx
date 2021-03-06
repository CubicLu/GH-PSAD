import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isEmpty } from 'underscore';
import {
  Row,
  Col,
  Card,
  CardTitle,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverBody
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as EllipsiIcon } from 'assets/ellipsi_icon.svg'
import moment from 'moment';
import DateModal from 'components/base/date_modal'
import Dropdown from 'components/base/dropdown'
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
        label: 'Today',
        text: `Today (${moment().format('L')})`,
        since: 'since yesterday'
      },
      {
        from: moment().startOf('isoWeek'),
        to: moment().endOf('isoWeek'),
        label: 'This week',
        text: `This week (${moment().startOf('isoWeek').format('MM/DD')}-${moment().endOf('isoWeek').format('MM/DD')})`,
        since: 'since last week'
      },
      {
        from: moment().startOf('month'),
        to: moment().endOf('month'),
        label: 'This month',
        text: `This month (${moment().startOf('month').format('MMM')})`,
        since: 'since last month'
      }
    ],
    currentSinceText: 'last week',
    tileInfoOpen: false,
    selectedParkingLot: this.props.defaultParkingLot
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

  updateData = (parkingLot) => {
    const { type } = this.props
    const { from, to } = this.state
    this.setState({ selectedParkingLot: parkingLot });
    filterFetcher({
      type,
      parkingLotIds: parkingLot.value === 0 ? [] : [parkingLot.value],
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

  toggleTileInfo = () => {
    this.setState({ tileInfoOpen: !this.state.tileInfoOpen });
  }

  componentDidMount() {
    this.fetchData()
  }

  isActiveMenu = (menu) => {
    return this.state.data.range_current_period === menu
  }

  render() {
    const { data, datesToFilter, modalIsOpen, selectedParkingLot } = this.state
    const { parkingLots, display, maxDate, info, type, reportType } = this.props

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
                    {
                      info ?
                      <React.Fragment>
                        <button className="ml-2 border-0 bg-white text-primary" id={type}><FontAwesomeIcon color="primary" icon={faQuestionCircle} /></button>
                        <Popover placement="bottom" isOpen={this.state.tileInfoOpen} target={type} toggle={this.toggleTileInfo} trigger="click hover focus">
                          <PopoverBody>{info}</PopoverBody>
                        </Popover>
                      </React.Fragment> :
                      ''
                    }
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
                            (
                              datesToFilter &&
                              datesToFilter.map(data => (
                                <DropdownItem className={`${this.isActiveMenu(data.label) ? 'active' : ''} general-text-1`} key={data.from.format('YYYY-M-D')} onClick={() => this.fetchData(data.from.format('YYYY-M-D'), data.to ? data.to.format('YYYY-M-D') : null, data.since)}>
                                  { data.text }
                                </DropdownItem>
                              ))
                            )
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
                <Row className={style.currentValueRow}>
                  <Col className={`${style.currentValue} pr-0 d-flex align-items-center`}>
                    {data.result}
                  </Col>
                  <Col xs="auto" className="pl-0">
                    <Dropdown
                      options={parkingLots}
                      onChange={this.updateData}
                      value={selectedParkingLot}
                      width="150px"
                      size="sm"
                    />
                  </Col>
                </Row>
                <Row className={style.previousResultRow}>
                  {
                    (data.result_previous_period && data.compare_with_previous_period) && (
                      <Col>
                        <FontAwesomeIcon color={data.compare_with_previous_period.raise ? 'green' : 'red'} icon={data.compare_with_previous_period.raise ? faArrowUp : faArrowDown} className="mr-1" />
                        <span className={style.secondaryText}> {data.result_previous_period}</span>
                      </Col>
                    )
                  }
                </Row>
                <Row className={style.moreRow}>
                  <Col className="justify-content-end pointer d-flex">
                    <Link to={`dashboard/reports/detailed/${reportType}`}>
                      <span className="general-text-2 text-primary">MORE</span>
                    </Link>
                  </Col>
                </Row>
              </React.Fragment>
            )
          }
        </Card>
        <DateModal maxDate={maxDate && (maxDate.toDate())} isOpen={modalIsOpen} apply={this.fetchData} toggleModal={() => this.setState({ modalIsOpen: false })} title={data.title} />
      </React.Fragment>
    )
  }
}

export default DataCard;