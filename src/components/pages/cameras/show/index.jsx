import React from 'react';
import PropTypes from 'prop-types';
import { ActionCableConsumer } from 'react-actioncable-provider';
import Holder from 'holderjs';
import { Card, CardHeader, CardBody } from 'reactstrap';
/* Actions */
import { SET_RECORD } from 'actions/cameras';
/* API */
import { show } from 'api/cameras';
/* Base */
import { ShowForm } from 'components/base/forms';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { showFields } from 'components/helpers/fields/cameras';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withCurrentUser from 'components/modules/with_current_user';

class Show extends React.Component {
  state = {
    currentWatchers: []
  }

  isFetching = () => {
    const { isResourceFetching } = this.props
    return isResourceFetching
  }

  values = () => {
    const { record } = this.props;
    return Object.assign({}, record, {
      created_at: displayUnixTimestamp(record.created_at),
      updated_at: displayUnixTimestamp(record.updated_at)
    });
  };

  handleReceived = (currentWatchers) => {
    this.setState({
      currentWatchers
    })
  }

  onConnected = () => {
    this.refs.watcherRoom.cable.perform('watchers');
  }

  renderWatchers = () => {
    const { currentWatchers } = this.state

    return (
      <React.Fragment>
        <p>
          Who is watching now ({currentWatchers.length}):
        </p>
        <ul>
          {
            currentWatchers.map(watcher => {
              return (
                <li>
                   <img
                    alt="avatar"
                    width="64"
                    height="64"
                    data-src={watcher.avatar || 'holder.js/64x64?auto=yes'}
                    src={watcher.avatar}
                    className="img-thumbnail mr-2"
                    ref={ref => Holder.run({ images: ref })}/>
                    ID: {watcher.id} Name { watcher.name }
                </li>
              )
            })
          }
      </ul>
    </React.Fragment>
    )
  }

  renderRecord () {
    const { currentUser, record, backPath, match } = this.props;
    return (<Card>
      <CardHeader>{record.name}</CardHeader>
      <CardBody>
        <ActionCableConsumer
          ref='watcherRoom'
          channel={{
            channel: "FootageWatchersChannel",
            camera_id: record.id,
            current_user_id: currentUser.id
          }}
          onConnected={this.onConnected}
          onReceived={this.handleReceived}
        />
        <ShowForm
          fields={showFields()}
          values={this.values()}
          backPath={backPath}
          editURL={match.url}
        />
        <hr/>
        {this.renderWatchers()}
      </CardBody>
    </Card>);
  }

  render () {
    return this.isFetching() ? <Loader/> : this.renderRecord();
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};

export default connectRecord(
  'camera',
  SET_RECORD,
  resourceFetcher(show),
  withCurrentUser(Show)
);
