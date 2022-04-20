import React from 'react';
import '../../css/buttons/ModalButton.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

ModalButton.propTypes = {
  className: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

function ModalButton(props) {
  const { className, func, text, icon } = props;

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

export default ModalButton;
