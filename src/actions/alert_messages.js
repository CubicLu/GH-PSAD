const SET_ALERT_MESSAGES = 'SET_ALERT_MESSAGES'
const POP_ALERT_MESSAGES = 'POP_ALERT_MESSAGES'
const CLEAR_ALERT_MESSAGES = 'CLEAR_ALERT_MESSAGES'

const setAlertMessages = (payload) => {
  return {
    type: SET_ALERT_MESSAGES,
    payload
  }
}

const popAlertMessages = () => {
  return {
    type: POP_ALERT_MESSAGES
  }
}

export {
  SET_ALERT_MESSAGES,
  CLEAR_ALERT_MESSAGES,
  POP_ALERT_MESSAGES,
  setAlertMessages,
  popAlertMessages
}