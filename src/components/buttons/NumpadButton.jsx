import React from 'react';
import '../../css/buttons/NumpadButton.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

NumpadButton.propTypes = {
  handleNumpad: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  windowSize: PropTypes.string.isRequired
};

function NumpadButton(props) {
  const { handleNumpad, number, icon, windowSize } = props;
  return (
    <button
      type='button'
      className={`numpad numpad-${windowSize}`}
      onClick={() => handleNumpad(number)}
    >
      <FontAwesomeIcon icon={icon} className={`numpad-icon-${windowSize}`} />
    </button>
  );
}

export default NumpadButton;
