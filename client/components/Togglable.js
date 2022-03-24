import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Togglable = (props) => {
  const [visibility, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  return (
    <div>
      {visibility === true ? (
        <div>
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      ) : (
        <div>
          <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        </div>
      )}
    </div>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
