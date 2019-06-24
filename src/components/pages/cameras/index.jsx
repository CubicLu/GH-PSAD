import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { setList } from 'actions/camera';
import { index } from 'api/camera';
import { displayUnixTimestamp } from 'components/helpers';
import { isEmpty } from 'underscore';
import withFetching from 'components/modules/with_fetching';
import { Button, ButtonGroup, ButtonToolbar, Col, Row } from 'reactstrap';

class Index extends React.Component {
  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td><Link to={`${match.path}/${record.id}`}>{record.name}</Link></td>
          <td>{record.stream}</td>
          <td>{displayUnixTimestamp(record.created_at)}</td>
          <td>{displayUnixTimestamp(record.updated_at)}</td>
          <td>{record.parking_lot ? record.parking_lot.id : null}</td>
          <td>
            <Button onClick={() => this.deleteRecord(record.id)} color="link">Delete</Button>
          </td>
        </tr>
      );
    });
  };

  deleteRecord = id => {
    alert('backend does not support this yet');
    // destroy(id).then(res => {
    //     if (res.ok) {
    //       const slicedList = reject(this.props.list, record => {
    //         return record.id === id;
    //       });
    //
    //       this.props.setList(slicedList);
    //     }
    //   }).catch(err => console.error(err));
  };

  newRecord = () => {
    const { match, history } = this.props;
    history.push(`${match.path}/new`);
  };

  renderTable() {
    return (<Row>
      <Col xs="12">
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.newRecord} color="primary">New Camera</Button>
          </ButtonGroup>
        </ButtonToolbar>
      </Col>
      <Col xs="12">
        <table className="table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Stream</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Parking Lot</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {this.renderRecords()}
          </tbody>
        </table>
      </Col>
    </Row>);
  }

  render() {
    return this.props.isFetching ? <div>Loading data...</div> : this.renderTable();
  }
}

function mapState(state) {
  const { list } = state.camera.index;
  return { list };
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setList }, dispatch);
}

function fetchData(wrapper) {
  if (!isEmpty(wrapper.props.list)) {
    wrapper.fetchFinished();
    return;
  }

  index()
    .then(res => res.json())
    .then(json => wrapper.props.setList(json))
    .catch(err => console.error(err))
    .finally(wrapper.fetchFinished)
}

export default connect(
  mapState,
  mapDispatch
)(withFetching(Index, fetchData));
