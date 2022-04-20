import React from 'react';
import '../css/Box.css';
import PropTypes from 'prop-types';
import Cell from './Cell';

Box.propTypes = {
  number: PropTypes.string.isRequired,
  cells: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  windowSize: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDoubleClick: PropTypes.func.isRequired
};

function Box(props) {
  const { number, cells, windowSize, handleClick, handleDoubleClick } = props;
  const onClick = (cellNumber) => {
    handleClick(number, cellNumber);
  };
  const onDoubleClick = (value) => {
    handleDoubleClick(value);
  };

  function renderAllCells() {
    return cells.map((c) => (
      <Cell
        key={c.key}
        number={c.number}
        value={c.value}
        isStarting={c.isStarting}
        isSelected={c.isSelected}
        isIncorrect={c.isIncorrect}
        isMarkup={c.isMarkup}
        windowSize={windowSize}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    ));
  }

  return (
    <div className={`box box-${windowSize}`}>
      {renderAllCells()}
    </div>
  );
}

export default Box;
