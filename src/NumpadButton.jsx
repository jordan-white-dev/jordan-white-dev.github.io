import React from 'react';
import './css/NumpadButton.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

NumpadButton.propTypes = {
  handleNumpad: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

function NumpadButton(props) {
  const { handleNumpad, number, icon } = props;
  return (
    <button
      type='button'
      className='numpad'
      onClick={() => handleNumpad(number)}
    >
      <FontAwesomeIcon icon={icon} className='numpad-icon' />
    </button>
  );
}

export default NumpadButton;
