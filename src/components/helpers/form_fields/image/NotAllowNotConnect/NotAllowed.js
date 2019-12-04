
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './notAllowedConnect.sass'
const NotAllowed = () => {
    return (
        <div className="stream" > <FontAwesomeIcon className="lock" icon={faLock} /><p className="notallowed">Not Allowed</p></div>
    )
}

export default NotAllowed