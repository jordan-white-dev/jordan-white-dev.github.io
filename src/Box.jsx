import React, { useCallback } from 'react';
import './css/Box.css';
import PropTypes from 'prop-types';
import Cell from './Cell';

Box.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleDoubleClick: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  cells: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired
};

function Box(props) {
  const { handleClick, handleDoubleClick, number, cells } = props;
  const onClick = useCallback((cellNumber) => {
    handleClick(number, cellNumber);
  });
  const onDoubleClick = useCallback((value) => {
    handleDoubleClick(value);
  });

  function renderAllCells() {
    return cells.map((c) => (
      <Cell
        key={c.key}
        number={c.number}
        value={c.value}
        isStarting={c.isStarting}
        isSelected={c.isSelected}
        isMarkup={c.isMarkup}
        isIncorrect={c.isIncorrect}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    ));
  }

  return (
    <div className='box'>
      {renderAllCells()}
    </div>
  );
}

export default Box;
