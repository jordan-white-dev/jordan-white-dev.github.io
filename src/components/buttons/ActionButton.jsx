import React from 'react';
import '../../css/buttons/ActionButton.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

ActionButton.propTypes = {
  active: PropTypes.bool,
  func: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  windowSize: PropTypes.string.isRequired
};

function ActionButton(props) {
  const { text, func, active, icon, windowSize } = props;
  function getClassName() {
    let className = `action action-${windowSize}`;
    if (active) {
      className += ' active';
    }
    return className;
  }

  return (
    <button
      type='button'
      className={getClassName()}
      onClick={func}
    >
      {text} {icon ? <FontAwesomeIcon icon={icon} /> : null}
    </button>
  );
}

export default ActionButton;
