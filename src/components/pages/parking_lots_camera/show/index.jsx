import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/cameras';
import { SET_LIST_ELEMENT } from 'actions/parking_lots_camera';
/* API */
import { show, search } from 'api/parking_lots_camera';
import { filterFetcher } from 'api/parking_lots_camera'
/* Helpers */
import Loader from 'components/helpers/loader';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching'
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { Col, Row, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Modal, ModalHeader, ModalBody, Button, ButtonToolbar, ButtonGroup } from 'reactstrap';
/* Font Awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSearch } from '@fortawesome/free-solid-svg-icons';
/* Redux */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { invoke } from 'actions';
/* Style */
import styles from './parking_lots_camera.module.sass'
import NotAllowedConnect from '../../../helpers/form_fields/image/NotAllowNotConnect/NotAllowedConnect'
import BasicListToolbar from '../../../base/basic_list_toolbar'
import debounce from 'lodash/debounce'
/* API */

class Show extends React.Component {
  state = {
    currentWatchers: [],
    showDropdown: false,
    searchInput: '',
    modal: false,
    refresh: false,
    listFromState: null,
    search: false,
    parkingLotName: '',
    loading: false

  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  // for show dropdown of single camera
  toggleDropdown = (e, name) => {
    if (name) {
      if (this.state.showDropdown[name]) {
        this.setState({ showDropdown: { ...this.state.showDropdown, [name]: !this.state.showDropdown[name] } })
      } else {
        this.setState({ showDropdown: { ...this.state.showDropdown, [name]: true } })
      }
    }
  }
  //for expand stream of single camera
  toggle = (name) => {
    if (name) {
      if (this.state.modal[name]) {
        this.setState({ modal: { ...this.state.modal, [name]: !this.state.modal[name] } })
      } else {
        this.setState({ modal: { ...this.state.modal, [name]: true } })
      }
    }
  }

  componentDidMount() {
    filterFetcher()
      .then(response => {
        let id = this.props.match.params.id
        let resLists = response.data
        resLists.filter(resItem => resItem.id.toString() === id).map((resItem, idx) => {
          return this.setState({
            parkingLotName: resItem.name
          })
        })
      })

  }


  renderHeader() {

    const { backPath } = this.props;
    return (<Row className="p-4" >
      <Col md={12} >
        <BasicListToolbar showFilters={false} goBackPath={backPath} title={this.state.parkingLotName} {...this.props} label="+ Add Stream" badgesFilter={null} extraButtons={() => {
          return (
            this.renderSearchRefresh()
          )
        }} />
      </Col>
    </Row>);
  }



  //show additional button serach and refresh
  renderSearchRefresh() {
    let id = this.props.match.params.id
    return (
      <ButtonToolbar className="float-right">
        <ButtonGroup className={`mr-4 ${styles.search}`}>
          <input className="form-control" type="text" onChange={(e) => this.handleChange(e.target.value, id)} placeholder="Search by keyword" />
          <FontAwesomeIcon className={`${styles.magnifier}`} color="grey" icon={faSearch} />
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button color="primary-lg" className="btn-md px-4 text-uppercase " onClick={() => this.refresh(this.props.match.params.id)}>Refresh</Button>
        </ButtonGroup>
      </ButtonToolbar>
    )
  }

  //Search input
  handleChange = debounce(((searchInput, id) => {
    this.setState({
      searchInput,
      loading: true
    }, () => this.search(id))
  }), 1000);

  search(id) {
    const { searchInput } = this.state
    search({ name: searchInput, id: id })
      .then(response => {
        return this.setState({
          search: true,
          listFromState: response.data,
          loading: false
        })
      })
  }

  //Looking only stream
  refresh = (id) => {
    show({ id: id })
      .then(response => {
        return this.setState({
          listFromState: response.data
        })
      })
      .then(response => {
        this.setState({
          refresh: true,
        })


      })

  }


  //Dropdown menu for every stream
  fieldsDropdowns() {
    return ([
      { id: 0, name: 'Information', path: `/dashboard/live/parking_lots` },
      { id: 1, name: 'Settings', path: `/dashboard/live/parking_lots` },
      { id: 2, name: 'Expand', path: '/#' },
      { id: 3, name: 'Edit', path: `/dashboard/live/parking_lots/30/new` },
    ])
  }


  renderRecord() {
    const { list } = this.props;
    const { refresh, search, listFromState } = this.state
    let stateList = listFromState
    let listToShow = refresh || search ? stateList : list
    return (
      <Row >
        <React.Fragment>
          {!this.state.loading ? listToShow.map((rec, idx) => {
            return (
              <Col md={6} className={`${styles.cardAdjust}`} >
                <div className="card">
                  <p className={`${styles.cameraName}`}>{rec.name}
                    <Dropdown className={`${styles.dropdown}`} direction="left" isOpen={this.state.showDropdown[rec.name]} toggle={(e) => this.toggleDropdown(e, rec.name)}>
                      <DropdownToggle color="none">
                        <FontAwesomeIcon color="grey" icon={faEllipsisH} />
                      </DropdownToggle>
                      <DropdownMenu >
                        {this.fieldsDropdowns().map(fieldsDropdown => {
                          return (
                            <DropdownItem >
                              {fieldsDropdown.name === 'Expand' ? (<p onClick={() => this.toggle(rec.name)}>{fieldsDropdown.name}</p>) : <Link className={`${styles.dropdownmenu}`} to={`${fieldsDropdown.path}`}>{fieldsDropdown.name}</Link>}
                              <Modal size="lg" style={{ maxWidth: 'none' }} isOpen={this.state.modal[rec.name]} toggle={() => this.toggle(rec.name)}>
                                <ModalHeader toggle={() => this.toggle(rec.name)} >{rec.name}</ModalHeader>
                                <ModalBody className={`${styles.modalBody}`}>
                                  {this.renderStream(idx)}
                                </ModalBody>
                              </Modal>
                            </DropdownItem>)
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </p>
                  {this.renderStream(idx)}
                </div>
              </Col>
            )

          })

            : <Col md={12}><Loader /></Col>}
        </React.Fragment>
      </Row >
    );
  }

  renderStream(idx) {
    const { list } = this.props
    const { listFromState } = this.state
    let listState = listFromState
    let listSource = this.state.refresh ? listState : list


    const canPlay = ReactPlayer.canPlay(listSource[idx].stream)
    return (
      ReactPlayer.canPlay(listSource[idx].stream) ? <div><ReactPlayer className={`${styles.stream}`} url={listSource[idx].stream} playing={true} width={'80 %'} /><p className={`${styles.live}`}>Live</p></div> : <NotAllowedConnect canPlay={canPlay} />
    )
  }



  render() {
    return this.isFetching() ? <Loader /> : (
      <React.Fragment >
        {this.renderHeader()}
        {this.renderRecord()}
      </React.Fragment>
    );
  }


}



Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};



function mapDispatch(dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}


export default connectList('camera', SET_LIST, resourceFetcher(show, 'parking_lot_camera'), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
