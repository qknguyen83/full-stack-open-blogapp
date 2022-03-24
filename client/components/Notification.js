import React from 'react';

const Notification = ({ message }) => {
  if (message !== null) {
    if (message.includes('successfully')) {
      return <div className='success'>{message}</div>;
    }

    return <div className='error'>{message}</div>;
  }

  return null;
};

export default Notification;
