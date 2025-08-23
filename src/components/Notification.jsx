import React, { useState, useEffect } from 'react';
import { Info, CheckCircle, AlertTriangle, Loader } from 'react-feather';
import styles from './Notification.module.css';

const ICONS = {
  info: <Info />,
  success: <CheckCircle />,
  error: <AlertTriangle />,
  loading: <Loader className={styles.spin} />,
};

function Notification({ message, type, duration, onHide }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onHide, 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, type, duration, onHide]);

  return (
    <div className={styles.notificationContainer}>
      <div className={`${styles.notification} ${styles[type]} ${visible ? styles.show : ''}`}>
        {ICONS[type] || <Info />}
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Notification;