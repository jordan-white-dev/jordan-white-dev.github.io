import React, { useCallback } from 'react';
import './css/Cell.css';
import PropTypes from 'prop-types';

Cell.propTypes = {
  number: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isMarkup: PropTypes.bool.isRequired,
  isStarting: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isIncorrect: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired
};

function Cell(props) {
  const {
    number,
    value,
    isMarkup,
    isStarting,
    isSelected,
    isIncorrect,
    onClick,
    onDoubleClick
  } = props;
  const onSingle = useCallback(() => {
    onClick(number);
  });
  const onDouble = useCallback(() => {
    if (value !== '0' && !isMarkup) {
      onDoubleClick(value);
    }
  });

  function getClassName() {
    let className = 'cell';
    if (isStarting) {
      className += ' starting';
    }
    if (isSelected) {
      className += ' selected';
    }
    if (isIncorrect) {
      className += ' incorrect';
    }
    if (isMarkup) {
      className += ' markup';
    }
    return className;
  }

  return (
    <div className={getClassName()}>
      <div
        onClick={onSingle}
        onDoubleClick={onDouble}
      >
        {value === '0' ? '' : value}
      </div>
    </div>
  );
}

export default Cell;
