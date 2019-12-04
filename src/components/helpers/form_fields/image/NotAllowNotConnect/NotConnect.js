import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from './notAllowedConnect.sass'
const NotAllowed = () => {
    return (
        <div className="stream" > <FontAwesomeIcon className="exclamation" icon={faExclamationTriangle} /><p className="noconnection">Streaming Not Connected</p></div>
    )
}

export default NotAllowed