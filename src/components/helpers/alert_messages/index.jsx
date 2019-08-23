import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { popAlertMessages } from 'actions/alert_messages';
import Toast from 'components/base/toast';

import './alert_messages.sass'

const alreadySet = []

const AlertMessages = props => {
  const { alertMessages } = props
  return (
    <div className="toast-container">
      {
        alertMessages.map((alertMessage, i) => {
          const transitionTimeMs = 3000 + (i * 1000)
          if (alreadySet.indexOf(i) === -1) {
            alreadySet.push(i)
            setTimeout(() => {
              alreadySet.pop()
              props.popAlertMessages()
            }, transitionTimeMs)
          }
          return <Toast key={i} {...alertMessage}/>
        })
      }
    </div>
  )
}


const mapDispatch = (dispatch) => {
  return bindActionCreators({ popAlertMessages }, dispatch);
}

const mapState = state => {
  const { data } = state.alert_messages;
  return { alertMessages: data };
};

export default connect(mapState, mapDispatch)(AlertMessages);