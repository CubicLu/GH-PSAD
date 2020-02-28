import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import Toolbar from './toolbar'
import DataCard from './data_card'
import { index } from 'api/parking_lots';

class Dashboard extends Component {

  state = {
    parkingLots: [],
    dateRange: {},
    types: [
      {
        name: 'vehicles_parked',
        display: true,
        reload: false
      },
      {
        name: 'vehicles_currently_parked',
        display: true,
        reload: false
      },
      {
        name: 'violations_commited',
        display: true,
        reload: false
      },
      {
        name: 'voi_match',
        display: true,
        reload: false
      },
      {
        name: 'voi_matches_currently',
        display: true,
        reload: false
      },
      {
        name: 'revenue',
        display: true,
        reload: false
      },
      {
        name: 'parking_tickets_issued',
        display: true,
        reload: false
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
      dateRange: {},
      types: types.map(element => {
        return {
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
          parkingLots: [{label: 'All Parking Lots', value: 0}].concat(res.data.map((parking_lot) => ({label: parking_lot.name, value: parking_lot.id})))
        })
      })
  }

  render() {
    const { types, dateRange, parkingLots } = this.state
    return (
      <Row>
        <Col xs="12">
          <Col xs="12" className="my-3">
            <Toolbar {...this.props} filter={this.filter} resetFilter={this.resetFilter} search={this.search} />
          </Col>
          <Col xs="12">
          </Col>
        </Col>
        <Col xs="12" className="row">
          {
            types.map((type) => (
              <Col sm="12" lg="4" className={`py-4 ${type.display ? '' : 'd-none' }`} >
                <DataCard
                  parkingLots={parkingLots}
                  type={type.name}
                  reset={type.reset}
                  reload={type.reload}
                  display={type.display}
                  disable_date_range={type.disable_date_range}
                  stopRefreshing={this.stopRefreshing}
                  from={dateRange.from}
                  to={dateRange.to}
                />
              </Col>
            ))
          }
        </Col>
      </Row>
    )
  }
}

export default Dashboard;