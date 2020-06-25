import React, { Component } from 'react';
import Toolbar from './toolbar'
import DataCard from './data_card'
import { index } from 'api/parking_lots';
import { Row, Col } from 'reactstrap';
import styles from './dashboard.module.sass';
import moment from 'moment';

moment.updateLocale("en", { week: {
  dow: 1,
  doy: 4,
}});

const defaultDateFilters = [
  {
    from: moment(),
    to: null,
    label: 'Today',
    text: `Today (${moment().format('L')})`,
    since: 'since yesterday'
  },
  {
    from: moment().startOf('week'),
    to: moment().endOf('week'),
    label: 'This week',
    text: `This week (${moment().startOf('week').format('MM/DD')}-${moment().endOf('week').format('MM/DD')})`,
    since: 'since last week'
  },
  {
    from: moment().startOf('month'),
    to: moment().endOf('month'),
    label: 'This month',
    text: `This month (${moment().startOf('month').format('MMM')})`,
    since: 'since last month'
  }
]

const allParkingLots = {
  label: 'All Parking Lots',
  value: 0
};

class Dashboard extends Component {

  state = {
    parkingLots: [],
    dateRange: {},
    types: [
      {
        name: 'vehicles_parked',
        display: true,
        reload: false,
        maxDate: moment().subtract(1, 'days')
      },
      {
        name: 'vehicles_currently_parked',
        display: true,
        reload: false
      },
      {
        name: 'violation_reports_opened',
        display: true,
        reload: false,
        datesToFilter: defaultDateFilters
      },
      {
        name: 'violation_reports_rejected',
        display: true,
        reload: false,
        datesToFilter: defaultDateFilters
      },
      {
        name: 'voi_match',
        display: true,
        reload: false,
        datesToFilter: defaultDateFilters
      },
      {
        name: 'voi_matches_currently',
        display: true,
        reload: false
      },
      {
        name: 'revenue',
        display: true,
        reload: false,
        datesToFilter: defaultDateFilters
      },
      {
        name: 'parking_tickets_opened',
        display: true,
        reload: false,
        datesToFilter: defaultDateFilters
      },
      {
        name: 'parking_tickets_issued',
        display: true,
        reload: false,
        defaultDateFilters
      },
      {
        name: 'parking_tickets_settled',
        display: true,
        reload: false,
        datesToFilter: defaultDateFilters
      },
      {
        name: 'ai_error',
        display: true,
        reload: false,
        datesToFilter: defaultDateFilters
      },
    ]
  }

  filter = (from, to) => {
    const { types } = this.state
    this.setState({
      dateRange: {
        from,
        to
      },
      types: types.map(element => {
        return {
          name: element.name,
          display: element.display,
          reload: true
        }
      })
    });
  }

  resetFilter = (from, to) => {
    const { types } = this.state
    this.setState({
      dateRange: {},
      types: types.map(element => {
        return {
          name: element.name,
          display: element.display,
          reset: true,
          reload: true
        }
      })
    });
  }

  refresh = () => {
    const { types } = this.state
    this.setState({
      types: types.map(element => {
        return {
          name: element.name,
          reload: true,
          display: element.display
        }
      })
    });
  }

  stopRefreshing = () => {
    const { types } = this.state
    this.setState({
      types: types.map(element => {
        return {
          dateRange: {},
          name: element.name,
          display: element.display,
          reload: false
        }
      })
    });
  }

  search = (value) => {
    const { types } = this.state

    this.setState({
      types: types.map((type) => {
        var display = true
        if (value) {
          const searchValue = value.split(' ').join('_').toLocaleLowerCase()
          display = type.name.includes(searchValue)
        }

        return {
          ...type,
          display
        }
      })
    })

  }

  componentWillUnmount () {
    document.querySelector(".frame-container").classList.remove("bg-transparent", "shadow-none")
  }

  componentDidMount() {
    document.querySelector(".frame-container").classList.add("bg-transparent", "shadow-none")

    index({ perPage: 50})
      .then(res => {
        this.setState({
          parkingLots: [allParkingLots].concat(res.data.map((parking_lot) => ({label: parking_lot.name, value: parking_lot.id})))
        })
      })
  }

  render() {
    const { types, dateRange, parkingLots } = this.state
    return (
      <div className={styles.container}>
        <Row>
          <Col xs="12">
            <Toolbar dateRange={dateRange} filter={this.filter} resetFilter={this.resetFilter} search={this.search} refresh={this.refresh} />
          </Col>
          <Col xs="12">
            <Row className={styles.listDataCard}>
              {
                types.map((type) => (
                  <Col xs="6" xl="4" className={`${styles.dataCardContainer} ${type.display ? '' : 'd-none' }`} key={type.name} >
                    <DataCard
                      parkingLots={parkingLots}
                      defaultParkingLot={allParkingLots}
                      type={type.name}
                      reset={type.reset}
                      reload={type.reload}
                      display={type.display}
                      disable_date_range={type.disable_date_range}
                      stopRefreshing={this.stopRefreshing}
                      from={dateRange.from}
                      to={dateRange.to}
                      maxDate={type.maxDate}
                      datesToFilter={type.datesToFilter}
                    />
                  </Col>
                ))
              }
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard;