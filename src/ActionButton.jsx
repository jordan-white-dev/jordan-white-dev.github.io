import React from 'react';
import './css/ActionButton.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

ActionButton.propTypes = {
  active: PropTypes.bool,
  func: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string
};

function ActionButton(props) {
  const { text, func, active, icon } = props;
  const className = active ? 'action active' : 'action';
  return (
    <button
      type='button'
      className={className}
      onClick={func}
    >
      {text} {icon ? <FontAwesomeIcon icon={icon} /> : null}
    </button>
  );
}

export default ActionButton;
