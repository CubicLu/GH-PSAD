import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './notAllowedConnect.module.sass'

const NotAllowedConnect = (canPlay) => {
    return (
        <div className={`${styles.stream} `} >
            <FontAwesomeIcon className={canPlay ? `${styles.exclamation} ` : `${styles.lock} `} icon={canPlay ? faExclamationTriangle : faLock} />
            <p className={canPlay ? `${styles.noconnection} ` : `${styles.notallowed} `}>{canPlay ? "Streaming Not Connected" : "Not Allowed"}</p>
        </div>
    )
}

export default NotAllowedConnect