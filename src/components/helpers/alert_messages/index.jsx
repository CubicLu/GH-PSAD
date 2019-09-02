import React from 'react';
import Toast from 'components/base/toast';

import './alert_messages.sass'

const alreadySet = []

export const AlertMessagesContext = React.createContext();

export class AlertMessages extends React.Component {
  state = {
    alertMessages: []
  }

  addAlertMessages = (newMessages) => {
    this.setState({
      alertMessages: this.state.alertMessages.concat(newMessages)
    })
  }

  render() {
    return (
      <AlertMessagesContext.Provider value={{
        addAlertMessages: this.addAlertMessages
      }}>
        {
          this.props.children
        }
        <div className="toast-container">
        {
          this.state.alertMessages.map((alertMessage, i) => {
            const transitionTimeMs = 3000 + (i * 1000)
            if (alreadySet.indexOf(i) === -1) {
              alreadySet.push(i)
              setTimeout(() => {
                this.setState((prevState) => ({
                  alertMessages: prevState.alertMessages.splice(0, prevState.alertMessages.length - 1)
                }))
              }, transitionTimeMs)
            }
            return <Toast key={i} {...alertMessage}/>
          })
        }
        </div>
      </AlertMessagesContext.Provider>
    )
  }
}
