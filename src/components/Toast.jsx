import React, { useEffect, useRef } from 'react';
import ReactPortal from './ReactPortal';

const Toast = ({ message, setToastMsg }) => {
  let timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 1500);
  }, [setToastMsg]);

  return <ReactPortal wrapperId="toast-msg">{message}</ReactPortal>;
};

export default Toast;
