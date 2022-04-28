import React from 'react';
import '../css/Cell.css';
import PropTypes from 'prop-types';

Cell.propTypes = {
  number: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isStarting: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isIncorrect: PropTypes.bool.isRequired,
  isMarkup: PropTypes.bool.isRequired,
  windowSize: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired
};

function Cell(props) {
  const {
    number,
    value,
    isStarting,
    isSelected,
    isIncorrect,
    isMarkup,
    windowSize,
    onClick,
    onDoubleClick
  } = props;
  const onSingle = () => {
    onClick(number);
  };
  const onDouble = () => {
    if (value !== '0' && !isMarkup) {
      onDoubleClick(value);
    }
  };

  function getClassName() {
    let className = `cell cell-${windowSize}`;
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
      className += ` markup-${windowSize}`;
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
