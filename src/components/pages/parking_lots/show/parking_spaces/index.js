import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MultiSelect from 'react-select';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Row,
  Nav,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown

} from 'reactstrap';
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactFileReader from 'react-file-reader';
import {SketchField, Tools} from 'react-sketch';
import { isEmpty } from 'underscore';
import {ReactComponent as UploadSVG } from 'assets/upload.svg';
import {ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import {ReactComponent as TimesSVG } from 'assets/times.svg';
/* Actions */
import { SET_RECORD } from 'actions/parking_lots';
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { index } from 'api/parking_slots';
import { show, updateMap } from 'api/parking_lots';
/* Base */
 import IndexTable from 'components/base/table';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import Collapse from 'components/helpers/collapse';
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import TooltipInfo from 'components/helpers/tooltip_info';
/* Modules */
import withFetching from 'components/modules/with_fetching';
import resourceFetcher from 'components/modules/resource_fetcher';
import connectRecord from 'components/modules/connect_record';
import withCurrentUser from 'components/modules/with_current_user';

import styles from './parking_spaces.module.sass'
const circleSize = {
  width: '30px',
  height: '30px'
}

const offsetMouse = 15

const Circle = (props) => {
  return (
    <div
      className={`${props.backgroundColor} position-absolute d-flex justify-content-center align-items-center rounded-circle`}
      style={{
        top: props.y,
        left: props.x,
        width: circleSize.width,
        height: circleSize.height
      }}
    >
      {props.children}
    </div>
  )
}

class ParkingSpaces extends Component {
  state = {
    isSaving: false,
    isSavingMap: false,
    inputChanged: false,
    list: [],
    map: null,
    errors: {},
    editing: false,
    insideEditingZone: false,
    showCircleInfo: null,
    newCircleInfo: {},
    circlesDrawSlot: []
  }
  static contextType = AlertMessagesContext

  mapRef = React.createRef();
  circleRef = React.createRef();
  multiSelectRef = React.createRef();

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  fieldProps = () => ({
    lSize: 6
  })

  save = () => {
    const { record } = this.props
  };

  saveMapFile = (file) => {
    const { record } = this.props
    this.setState({ isSavingMap: true })
    updateMap({
      id: record.id,
      mapBase64: file.base64
    })
      .then(response => {
        this.setState({
          map: response.data.map
        })
      })
      .catch((err) => {
        debugger
      })
      .finally(() => this.setState({ isSavingMap: false }))
  }

  renderHeader () {
    const { backPath, parentPath, history, match, record } = this.props;

    return (<Row>
      <Col sm={12} className="px-4 pt-4 row">
        <Col md={7} className="d-flex align-items-center ">
          <Link to={backPath} className="mr-2" >
            <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
          </Link>
          {record.name}
          <span className="ml-4 general-text-3 text-nowrap">
            <h6 className="m-0">
              ID: {record.id}
            </h6>
          </span>
        </Col>
        <Col md={5}>
          <Nav pills className="align-items-center float-right mx-auto">
              <Button className="mr-1" onClick={() => history.push(parentPath)} color="disabled-lg">
                Information
              </Button>
              <Button className="mr-1" onClick={() => history.push(`${parentPath}/rules`)} color="disabled-lg">
                Parking rules
              </Button>
              <Button className="mr-1" onClick={() => history.push(match.url)} color="primary-lg">
                Parking spaces
              </Button>
          </Nav>
        </Col>
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button color="success" className="px-5 py-2 mb-4 float-right" onClick={this.save}>
          {isSaving ? btnSpinner() : 'Save'}
        </Button>
      </Col>
    );
  }
  // Executed every time the user moves the mouse inside the map
  updateCirclePointer = (e) => {
    const { insideEditingZone, editing, newCircleInfo } = this.state;

    if(insideEditingZone && editing && isEmpty(newCircleInfo))  {
      const target = this.circleRef.current;
      target.style.left = e.clientX - offsetMouse + "px";
      target.style.top = e.clientY - offsetMouse + "px";
    }
  }

  // Executed every time the user moves the mouse
  isUserInsideEditingZone = (e) => {
    const { insideEditingZone, editing, newCircleInfo } = this.state;

    if(isEmpty(newCircleInfo) && editing) {

      const mapPosition = this.mapRef.current.getBoundingClientRect()
      const mousePositionX = e.clientX
      const mousePositionY = e.clientY

      this.setState({
        insideEditingZone:  (
          mapPosition.left <= mousePositionX && mapPosition.right > mousePositionX &&
          mapPosition.top <= mousePositionY && mapPosition.bottom > mousePositionY
        )
      })

    }
  }

  // Executed every time user clicks on the map when is in editing mode
  markSlotOnMap = (e) => {
    const { insideEditingZone, editing, newCircleInfo } = this.state;

    if(insideEditingZone && editing && isEmpty(newCircleInfo))  {
        const x = e.clientX, y = e.clientY,
        elementMouseIsOver = document.elementFromPoint(x, y);

        const offsetX = x - this.mapRef.current.getBoundingClientRect().left - offsetMouse;
        const offsetY = y - this.mapRef.current.getBoundingClientRect().top - offsetMouse;
        this.multiSelectRef.current.style.left = offsetX + 40 + "px"
        this.multiSelectRef.current.style.top = offsetY  + "px"

        this.multiSelectRef.current.focus()
        this.setState({
          newCircleInfo:  {
            x: offsetX,
            y: offsetY,
            id: null
          }
        })
    }
  }

  // Cancel when user selection on the map in editing mode
  cancelMarkingSlotOnMap = () => {
    this.setState({
      newCircleInfo: null
    })
  }

  // Add new point on the map
  applyMarkingSlotOnMap = (selectedOptions) => {
    const newCircleInfo = this.state.newCircleInfo;
    newCircleInfo.id = selectedOptions.value
    this.setState({
      newCircleInfo: null,
      circlesDrawSlot: [
        ...this.state.circlesDrawSlot,
        newCircleInfo
      ]
    })

  }

  showCircleDrawSlowInfo = (id) => {
    this.setState({
      showCircleInfo: id
    })
  }

  renderSlot = (slot) => {
    return (
      <React.Fragment key={slot.id}>

        <Col xs={12} className={`${styles.rowParkingSlot} position-relative px-0 d-flex justify-content-between align-items-center`}>
          <div className={`border-right border-dark ${styles.availabilitySpace} ${slot.status === "free" ? 'bg-green' : 'bg-red' }`}>
          </div>
          <div className={`general-text-1 ml-3 ${styles.slotName}`}>
            {slot.name}
          </div>
          <div className="p-3 mr-5">
          <UncontrolledDropdown>
            <DropdownToggle tag="span" className="pointer">
              <FontAwesomeIcon color="grey" icon={faEllipsisV}/>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem className="p-3 text-grey">
                  LOCATE
              </DropdownItem>
              <DropdownItem className="p-3 text-primary">
                  READ MORE >
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          </div>
        </Col>
      </React.Fragment>
    )
  }

  emptyMap = () => {
    const { list, isSavingMap, map } = this.state

    return (
      <React.Fragment>
        <div className={`${styles.mapContainer} card border-dark d-flex justify-content-center align-items-center p-5`}>
          <p className="general-text-1">
            This parking lot account doesn't have any parking spaces.
          </p>
          <p className="general-text-1">
            For creating it, please upload parking lot plan here (*PNG or *JPEG)
          </p>
          <ReactFileReader
            base64={true}
            handleFiles={this.saveMapFile}
          >
            <Button className="bg-grey-dark">
              <UploadSVG className="mr-2"/>
              Upload Layout
            </Button>
          </ReactFileReader>
        </div>
      </React.Fragment>
    )
  }

  renderMap = () => {
    const { list, isSavingMap, map, editing, insideEditingZone, newCircleInfo } = this.state

    if (!map) {
      return this.emptyMap()
    }

    return (
      <React.Fragment>
        <div className="position-relative">
          <ReactFileReader
            base64={true}
            handleFiles={this.saveMapFile}
          >
            <React.Fragment>
              <hr className="w-100 position-absolute"/>
              <Button className="mb-3  bg-grey-dark  ml-4 ">
                <UploadSVG className="mr-2"/>
                Upload Layout
              </Button>
            </React.Fragment>
          </ReactFileReader>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Col className="justify-content-end d-flex">
            <Button onClick={() => this.setState({editing: !editing})}>
              {editing ? 'View Mode' : 'Edit Mode'}
            </Button>
            <TimesSVG onClick={this.saveMapFile} className="mb-1 pointer"/>
          </Col>
          <div
            ref={this.mapRef}
            className={`position-relative ${styles.imageMap} ${editing ? 'crosshair' : ''}`}
            onMouseMove={this.updateCirclePointer}
            onClick={this.markSlotOnMap}
          >
            {
              (editing && insideEditingZone) && (
                <div
                  ref={this.circleRef}
                  className={`position-fixed rounded-circle ${styles.followCircle}`}
                />
              )
            }
            <div ref={this.multiSelectRef} className={`${styles.mutliselect} position-absolute`}>
              {
                !isEmpty(newCircleInfo) && (
                    <div className="card p-3">
                      <MultiSelect
                        options={list.filter(slot => (
                          !this.state.circlesDrawSlot.some(drawedSlot => drawedSlot.id == slot.id)
                        )).map( slot => ({ value: slot.id, label: slot.name}))
                        }
                        placeholder="Parking Slot to add"
                        onChange={this.applyMarkingSlotOnMap}
                      />
                      <Row className="justify-content-center">
                        <Button color="danger" onClick={this.cancelMarkingSlotOnMap} className="px-3 mt-2 py-2  float-left">
                          Cancel
                        </Button>
                      </Row>
                    </div>
                )
              }
            </div>
            <img src={map}/>
            {
              this.state.circlesDrawSlot.map(element => {
                const slot = this.state.list.find(slot => slot.id == element.id)
                const colorRectangle = slot ? slot.status === "free" ? 'bg-green' : 'bg-red' : 'bg-grey-dark'
                return (
                  <React.Fragment>
                    {
                      !this.state.editing && this.state.showCircleInfo == slot.id &&  (
                        <div
                          className={`${styles.infoCircle} position-absolute card`}
                          style={{
                            top: element.y + "px",
                            left: element.x + 40 + "px"
                          }}
                        >
                          <FontAwesomeIcon color="red" icon={faTrash}/>
                        </div>
                      )
                    }
                    <span onClick={() => this.showCircleDrawSlowInfo(slot.id)}>
                      <Circle
                        backgroundColor={colorRectangle}
                        x={element.x}
                        y={element.y}
                      >
                        <p className="text-white m-0">{slot ? slot.name : 'Error: Missing' }</p>
                      </Circle>
                    </span>
                  </React.Fragment>
                )
              })
            }
          </div>
        </div>
        <div className="mt-4">
          {this.renderSaveButton()}
        </div>
      </React.Fragment>
    )
  }

  renderForm () {
    const { list, isSavingMap, map } = this.state

    return (
      <Row onMouseMove={this.isUserInsideEditingZone}>
        <Col xs={12} md={3} className="p-0">
          <Collapse
            initialState={true}
            toggler={(toggleCollapsable) => (
               <Col onClick={toggleCollapsable} className="row d-flex justify-content-between text-white bg-primary p-3 m-0" xs={12}>
                <span className="ml-4">Parking Spaces</span>
                <ChevronDown/>
              </Col>
            )}
          >
              {isEmpty(list) ?
                (
                  <Col className="p-3 row d-flex justify-content-center">
                    <p className="general-text-1">
                      You don't have any parking spaces for now.
                    </p>
                  </Col>
                ) : (
                  <Col className={`overflow-auto ${styles.slotContainer} p-0 mb-4`}>
                    {list.map(slot => this.renderSlot(slot))}
                  </Col>
                )
              }
          </Collapse>
        </Col>
        <Col xs={12} md={9} className="p-0 overflow-auto">
          {
            isSavingMap ? <Loader/> : this.renderMap()
          }
        </Col>
      </Row>
    )
  }

  renderRecord () {
    const { showModalRecipient, currentRule } = this.state
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
      </Row>
    );
  }

  fetchData = (record) => {
    const { startFetching, currentUser } = this.props;

    if (record) {
      startFetching(index({
        query: {
          parking_lot_id: record.id
        }
      }))
        .then(response => {
          this.setState({
            list: response.data
          })
        })

      this.setState({
        map: record.map
      })
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.record && !this.props.record) {
      this.fetchData(nextProps.record);
    }
  }

  componentDidMount () {
    const { record } = this.props;
    this.fetchData(record);
  }

  render() {
    return this.isFetching() ?  <Loader/> : this.renderRecord()
  }
}

ParkingSpaces.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  withFetching(
    withCurrentUser(ParkingSpaces)
  )
);
