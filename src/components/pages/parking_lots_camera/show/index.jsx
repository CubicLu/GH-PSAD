import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/cameras';
import { SET_LIST_ELEMENT } from 'actions/parking_lots';
/* API */
import { show } from 'api/parking_lot_camera';
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


class Show extends React.Component {
  state = {
    currentWatchers: [],
    showDropdown: false,
    searchInput: '',
    modal: false,
    refresh: false,
    list: null

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

  renderHeader() {
    const { backPath, history } = this.props;
    let id = this.props.match.params.id
    return (<Row className="p-4" >
      <Col md={12} >
        <BasicListToolbar showFilters={false} widthSearch={10} goBackPath={backPath} title={!!history.location.name ? history.location.name.state.record.name : `Parking lot ${id - 1} `} {...this.props} label="+ Add Stream" badgesFilter={null} extraButtons={() => {
          return (
            this.renderSearchRefresh()
          )
        }} />
      </Col>
    </Row>);
  }

  //show additional button serach and refresh
  renderSearchRefresh() {
    return (
      <ButtonToolbar className="float-right">
        <ButtonGroup className={`mr-4 ${styles.search}`}>
          <input className="form-control" type="text" onChange={(e) => this.handleChange(e.target.value)} placeholder="Search by keyword" />
          <FontAwesomeIcon className={`${styles.magnifire}`} color="grey" icon={faSearch} />
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button color="primary-lg" className="btn-md px-4 text-uppercase " onClick={() => this.refresh(this.props.match.params.id)}>Refresh</Button>
        </ButtonGroup>
      </ButtonToolbar>
    )
  }

  //Search input
  handleChange = debounce(((searchInput) => {
    this.setState({
      searchInput
    })
  }), 1000);

  //Looking only stream 
  refresh = (id) => {
    show({ id: id })
      .then(response => {
        this.setState({
          refresh: true,
          list: response.data
        })
      })
  }


  //Dropdown menu for every stream
  fieldsDropdowns() {
    return ([
      { id: 0, name: 'Information', path: `/dashboard/live/parking_lots` },
      { id: 1, name: 'Settings', path: `/dashboard/live/parking_lots` },
      { id: 2, name: 'Expand', path: '/#' },
      { id: 3, name: 'Edit', path: `/dashboard/live/parking_lots` },
    ])
  }


  renderRecord() {
    const { list } = this.props;
    return (
      <Row >
        <React.Fragment>
          {list.map((rec, idx) => {
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
                              <Modal isOpen={this.state.modal[rec.name]} toggle={() => this.toggle(rec.name)}>
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
          }
        </React.Fragment>
      </Row >
    );
  }

  renderStream(idx) {
    const { list } = this.props
    let listSource = this.state.refresh ? this.state.list[idx] : list[idx]
    const canPlay = ReactPlayer.canPlay(listSource.stream)
    return (
      ReactPlayer.canPlay(listSource.stream) ? <div><ReactPlayer className={`${styles.stream}`} url={listSource.stream} playing={true} width={'80 %'} /><p className={`${styles.live}`}>Live</p></div> : <NotAllowedConnect canPlay={canPlay} />
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
