import React, { useState, useEffect } from 'react';
import { makepuzzle, solvepuzzle, ratepuzzle } from 'sudoku';
import '../css/App.css';
import Box from './Box';
import Tools from './Tools';
import Modal from './Modal';

function App() {
  const newPuzzle = generateNewPuzzle();
  const [puzzle, setPuzzle] = useState(newPuzzle);
  const [history, setHistory] = useState([{ moveNumber: 0, puzzle: newPuzzle }]);
  const [lastMove, setLastMove] = useState(0);
  const [isUsingCtrlMultiselect, setIsUsingCtrlMultiselect] = useState(false);
  const [isUsingButtonMultiselect, setIsUsingButtonMultiselect] = useState(false);
  const [isUsingShiftMarkup, setIsUsingShiftMarkup] = useState(false);
  const [isUsingButtonMarkup, setIsUsingButtonMarkup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentDialog, setCurrentDialog] = useState('');
  const [windowSize, setWindowSize] = useState('');

  useEffect(() => {
    function handleResize() {
      let size;
      if (window.innerWidth >= 818 && window.innerHeight >= 1100) {
        size = 'large';
      } else if (window.innerWidth >= 545 && window.innerHeight >= 750) {
        size = 'medium';
      } else {
        size = 'small';
      }
      setWindowSize(size);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && !isUsingCtrlMultiselect) {
        setIsUsingCtrlMultiselect(true);
      } else if (event.shiftKey && !isUsingShiftMarkup) {
        setIsUsingShiftMarkup(true);
      } else if (event.key > 0 && event.key < 10) {
        handleInput(event.key);
      } else if (event.key === 'Escape' || event.key === 'Delete' || event.key === 'Backspace') {
        handleInput(0);
      } else if (!hasMultipleSelections() && event.key.includes('Arrow')) {
        handleArrowKey(event.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === 'Control' && isUsingCtrlMultiselect) {
        setIsUsingCtrlMultiselect(false);
      } else if (event.key === 'Shift' && isUsingShiftMarkup) {
        setIsUsingShiftMarkup(false);
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  const handleClick = (boxNumber, cellNumber) => {
    const updated = JSON.parse(JSON.stringify(puzzle));
    updated.boxes = updated.boxes.map((box) => {
      if (!isUsingCtrlMultiselect && !isUsingButtonMultiselect) {
        if (box.number === boxNumber) {
          box.cells = box.cells.map((cell) => {
            if (hasMultipleSelections()) {
              if (cell.number === cellNumber) {
                cell.isSelected = true;
              } else {
                cell.isSelected = false;
              }
            } else if (cell.number === cellNumber) {
              cell.isSelected = !cell.isSelected;
            } else {
              cell.isSelected = false;
            }
            cell.isIncorrect = false;
            return cell;
          });
        } else {
          box.cells = box.cells.map((cell) => {
            cell.isSelected = false;
            cell.isIncorrect = false;
            return cell;
          });
        }
      } else if (box.number === boxNumber) {
        box.cells = box.cells.map((cell) => {
          if (cell.number === cellNumber) {
            cell.isSelected = !cell.isSelected;
          }
          cell.isIncorrect = false;
          return cell;
        });
      } else {
        box.cells = box.cells.map((cell) => {
          cell.isIncorrect = false;
          return cell;
        });
      }
      return box;
    });
    setPuzzle(updated);
  };
  const handleDoubleClick = (value) => {
    const updated = JSON.parse(JSON.stringify(puzzle));
    updated.boxes = updated.boxes.map((box) => {
      box.cells = box.cells.map((cell) => {
        if (cell.value === value) {
          cell.isSelected = true;
        } else {
          cell.isSelected = false;
        }
        return cell;
      });
      return box;
    });
    setPuzzle(updated);
  };
  const handleNew = () => {
    setShowModal(true);
    setCurrentDialog('new');
  };
  const handleShortcuts = () => {
    setShowModal(true);
    setCurrentDialog('shortcuts');
  };
  const handleMultiselect = () => { setIsUsingButtonMultiselect(!isUsingButtonMultiselect); };
  const handleMarkup = () => { setIsUsingButtonMarkup(!isUsingButtonMarkup); };
  const handleSubmit = () => {
    const updated = JSON.parse(JSON.stringify(puzzle));
    let isSolved = true;
    updated.boxes = updated.boxes.map((box) => {
      box.cells = box.cells.map((cell) => {
        if (cell.isStarting) {
          return cell;
        }
        if (cell.value === '0' || cell.isMarkup || cell.value !== cell.solutionValue) {
          cell.isSelected = false;
          cell.isIncorrect = true;
          isSolved = false;
        }
        return cell;
      });
      return box;
    });
    setPuzzle(updated);
    if (isSolved) {
      setCurrentDialog('solved');
    } else {
      setCurrentDialog('notSolved');
    }
    setShowModal(true);
  };
  const handleNumpad = (input) => { handleInput(input); };
  const handleUndo = () => {
    if (lastMove > 0) {
      const previousPuzzleState = JSON.parse(JSON.stringify(history[lastMove - 1].puzzle));
      previousPuzzleState.boxes = previousPuzzleState.boxes.map((box) => {
        box.cells = box.cells.map((cell) => {
          if (cell.isSelected) {
            cell.isSelected = false;
          }
          return cell;
        });
        return box;
      });
      setLastMove(lastMove - 1);
      setPuzzle(previousPuzzleState);
    }
  };
  const handleRedo = () => {
    if (lastMove < history.length - 1) {
      const nextPuzzleState = JSON.parse(JSON.stringify(history[lastMove + 1].puzzle));
      nextPuzzleState.boxes = nextPuzzleState.boxes.map((box) => {
        box.cells = box.cells.map((cell) => {
          if (cell.isSelected) {
            cell.isSelected = false;
          }
          return cell;
        });
        return box;
      });
      setLastMove(lastMove + 1);
      setPuzzle(nextPuzzleState);
    }
  };
  const handleRestart = () => {
    setShowModal(true);
    setCurrentDialog('restart');
  };
  const handleOK = () => {
    setShowModal(false);
    if (currentDialog === 'new' || currentDialog === 'restart') {
      resetPuzzle(currentDialog);
    }
  };
  const handleCancel = () => { setShowModal(false); };

  function generateNewPuzzle() {
    const generated = {
      boxes: [],
      rows: [[], [], [], [], [], [], [], [], []],
      columns: [[], [], [], [], [], [], [], [], []]
    };
    for (let i = 1; i < 10; i++) {
      const cells = [];
      for (let j = 1; j < 10; j++) {
        cells[j - 1] = {
          key: `box${i}-cell${j}`,
          number: `${j}`,
          value: '0',
          solutionValue: '0',
          row: '0',
          column: '0',
          isStarting: false,
          isSelected: false,
          isMarkup: false,
          isIncorrect: false
        };
      }
      generated.boxes[i - 1] = {
        key: `box${i}`,
        number: `${i}`,
        cells
      };
    }
    let output = makepuzzle();
    while (!isDifficultyCorrect(output)) {
      output = makepuzzle();
    }
    const digits = output.map((digit) => (
      digit === null ? '0' : `${digit + 1}`
    ));
    const solvedDigits = solvepuzzle(output).map((digit) => (
      digit === null ? '0' : `${digit + 1}`
    ));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        generated.rows[i].push(digits[(i * 9) + j]);
        generated.columns[j].push(digits[(i * 9) + j]);
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          let digitsIndex = (i * 3) + (j * 9) + k;
          let rowNumber = j + 1;
          const cellsIndex = (j * 3) + k;
          const columnNumber = (digitsIndex % 9) + 1;
          if (i > 2 && i < 6) {
            digitsIndex += 18;
            rowNumber += 3;
          } else if (i >= 6) {
            digitsIndex += 36;
            rowNumber += 6;
          }
          generated.boxes[i].cells[cellsIndex].value = digits[digitsIndex];
          generated.boxes[i].cells[cellsIndex].solutionValue = solvedDigits[digitsIndex];
          generated.boxes[i].cells[cellsIndex].row = `${rowNumber}`;
          generated.boxes[i].cells[cellsIndex].column = `${columnNumber}`;
          if (digits[digitsIndex] !== '0') {
            generated.boxes[i].cells[cellsIndex].isStarting = true;
          }
        }
      }
    }
    return generated;
  }

  function isDifficultyCorrect(puzzleToCheck) {
    let isCorrect = true;
    for (let i = 0; i < 10; i++) {
      const currentRating = ratepuzzle(puzzleToCheck, 15);
      if (currentRating > 0) {
        isCorrect = false;
        break;
      }
    }
    return isCorrect;
  }

  function hasMultipleSelections() {
    const boxesCopy = JSON.parse(JSON.stringify(puzzle.boxes));
    let count = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (boxesCopy[i].cells[j].isSelected) {
          count++;
        }
      }
    }
    return count > 1;
  }

  function handleInput(input) {
    if (hasAnySelections()) {
      let wasChanged = false;
      const puzzleUpdated = JSON.parse(JSON.stringify(puzzle));
      puzzleUpdated.boxes = puzzleUpdated.boxes.map((box) => {
        box.cells = box.cells.map((cell) => {
          if (cell.isSelected && !cell.isStarting) {
            if (!isUsingShiftMarkup && !isUsingButtonMarkup) {
              cell.value = input;
              cell.isMarkup = false;
              puzzleUpdated.rows[cell.row - 1][cell.column - 1] = input;
              puzzleUpdated.columns[cell.column - 1][cell.row - 1] = input;
            } else {
              let value;
              if (input === '0') {
                value = '';
              } else if (cell.value === '0') {
                value = input;
              } else if (cell.value.includes(input)) {
                value = cell.value.replace(input, '');
              } else {
                value = cell.value + input.toString();
              }
              let markupValues = Array.from(value.split(''));
              markupValues = markupValues.sort().join('');
              cell.value = markupValues === '' ? '0' : markupValues;
              cell.isMarkup = true;
              puzzleUpdated.rows[cell.row - 1][cell.column - 1] = 0;
              puzzleUpdated.columns[cell.column - 1][cell.row - 1] = 0;
            }
            wasChanged = true;
          }
          cell.isIncorrect = false;
          return cell;
        });
        return box;
      });
      if (wasChanged) {
        const historyUpdated = JSON.parse(JSON.stringify(history));
        if (lastMove < history.length - 1) {
          historyUpdated.slice(0, historyUpdated.length - lastMove);
        }
        const newMove = {
          moveNumber: historyUpdated.length,
          puzzle: puzzleUpdated
        };
        historyUpdated.push(newMove);
        setHistory(historyUpdated);
        setLastMove(historyUpdated.length - 1);
        setPuzzle(puzzleUpdated);
      }
    }
  }

  function resetPuzzle(type) {
    if (type === 'new') {
      const generated = generateNewPuzzle();
      setPuzzle(generated);
      const newHistory = [{
        moveNumber: 0,
        puzzle: generated
      }];
      setHistory(newHistory);
    } else if (type === 'restart') {
      const historyUpdated = [];
      historyUpdated.push(JSON.parse(JSON.stringify(history)).shift());
      const startingPuzzle = historyUpdated[0].puzzle;
      setHistory(historyUpdated);
      setLastMove(0);
      setPuzzle(startingPuzzle);
    }
  }

  function hasAnySelections() {
    const boxesCopy = JSON.parse(JSON.stringify(puzzle.boxes));
    let count = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (boxesCopy[i].cells[j].isSelected) {
          count++;
        }
      }
    }
    return count > 0;
  }

  function handleArrowKey(key) {
    const updated = JSON.parse(JSON.stringify(puzzle));
    let newRow;
    let newColumn;
    updated.boxes.map((box) => {
      box.cells.map((cell) => {
        if (cell.isSelected) {
          if (key === 'ArrowUp') {
            if (cell.row > 1) {
              newRow = `${parseInt(cell.row) - 1}`;
              newColumn = cell.column;
            }
          } else if (key === 'ArrowDown') {
            if (cell.row < 9) {
              newRow = `${parseInt(cell.row) + 1}`;
              newColumn = cell.column;
            }
          } else if (key === 'ArrowLeft') {
            if (cell.column > 1) {
              newRow = cell.row;
              newColumn = `${parseInt(cell.column) - 1}`;
            }
          } else if (key === 'ArrowRight') {
            if (cell.column < 9) {
              newRow = cell.row;
              newColumn = `${parseInt(cell.column) + 1}`;
            }
          }
        }
      });
    });

    if (newRow && newColumn) {
      updated.boxes = updated.boxes.map((box) => {
        box.cells = box.cells.map((cell) => {
          if (cell.row === newRow && cell.column === newColumn) {
            cell.isSelected = true;
          } else {
            cell.isSelected = false;
          }
          return cell;
        });
        return box;
      });
      setPuzzle(updated);
    }
  }

  function renderAllBoxes() {
    return puzzle.boxes.map((b) => (
      <Box
        key={b.key}
        number={b.number}
        cells={b.cells}
        windowSize={windowSize}
        handleClick={handleClick}
        handleDoubleClick={handleDoubleClick}
      />
    ));
  }

  return (
    <div className='page'>
      <div className={`puzzle puzzle-${windowSize}`}>
        {renderAllBoxes()}
      </div>
      <Tools
        isUsingButtonMultiselect={isUsingButtonMultiselect}
        isUsingButtonMarkup={isUsingButtonMarkup}
        windowSize={windowSize}
        handleNew={handleNew}
        handleShortcuts={handleShortcuts}
        handleMultiselect={handleMultiselect}
        handleMarkup={handleMarkup}
        handleSubmit={handleSubmit}
        handleNumpad={handleNumpad}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleRestart={handleRestart}
      />
      <Modal
        showModal={showModal}
        currentDialog={currentDialog}
        handleOK={handleOK}
        handleCancel={handleCancel}
      />
    </div>
  );
}

export default App;
