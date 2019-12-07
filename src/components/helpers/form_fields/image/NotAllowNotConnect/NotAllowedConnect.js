import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLock } from '@fortawesome/free-solid-svg-icons';
import './notAllowedConnect.sass'

const NotAllowedConnect = (canPlay) => {
    return (
        <div className="stream" >
            <FontAwesomeIcon className={canPlay ? "exclamation" : 'lock'} icon={canPlay ? faExclamationTriangle : faLock} />
            <p className={canPlay ? "noconnection" : 'notallowed'}>{canPlay ? "Streaming Not Connected" : "Not Allowed"}</p>
        </div>
    )
}

export default NotAllowedConnect