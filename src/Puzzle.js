import React from 'react';
import './css/Puzzle.css';
import Box from './Box';
import Tools from './Tools';
import Modal from './Modal';

class Puzzle extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleShortcuts = this.handleShortcuts.bind(this);
        this.handleMultiselect = this.handleMultiselect.bind(this);
        this.handleMarkup = this.handleMarkup.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleRedo = this.handleRedo.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Open source sudoku generator courtesy of Blagovest Dachev
        // https://github.com/dachev
        this.sudoku = require('sudoku');

        const newPuzzle = this.generateNewPuzzle();
        this.state = {
            puzzle: newPuzzle,
            history: [{
                moveNumber: 0,
                puzzle: newPuzzle
            }],
            lastMove: 0,
            isUsingCtrlMultiselect: false,
            isUsingButtonMultiselect: false,
            isUsingShiftMarkup: false,
            isUsingButtonMarkup: false,
            showModal: false,
            currentDialog: undefined
        };
    }

    handleClick(boxNumber, cellNumber) {
        let puzzle = JSON.parse(JSON.stringify(this.state.puzzle));
        puzzle.boxes = puzzle.boxes.map(box => {
            if (!this.state.isUsingCtrlMultiselect && !this.state.isUsingButtonMultiselect) {
                if (box.boxNumber === boxNumber) {
                    box.cells = box.cells.map(cell => {
                        if (this.hasExistingSelections()) {
                            if (cell.cellNumber === cellNumber) {
                                cell.isSelected = true;
                            } else {
                                cell.isSelected = false;
                            }
                        } else {
                            if (cell.cellNumber === cellNumber) {
                                cell.isSelected = !cell.isSelected;
                            } else {
                                cell.isSelected = false;
                            }
                        }
                        cell.isIncorrect = false;
                        return cell;
                    });
                } else {
                    box.cells = box.cells.map(cell => {
                        cell.isSelected = false;
                        cell.isIncorrect = false;
                        return cell;
                    });
                }
            } else {
                if (box.boxNumber === boxNumber) {
                    box.cells = box.cells.map(cell => {
                        if (cell.cellNumber === cellNumber) {
                            cell.isSelected = !cell.isSelected;
                        }
                        cell.isIncorrect = false;
                        return cell;
                    });
                } else {
                    box.cells = box.cells.map(cell => {
                        cell.isIncorrect = false;
                        return cell;
                    });
                }
            }
            return box;
        });
        this.setState({ puzzle: puzzle });
    }

    handleDoubleClick(highlightValue) {
        let puzzle = JSON.parse(JSON.stringify(this.state.puzzle));
        puzzle.boxes = puzzle.boxes.map(box => {
            box.cells = box.cells.map(cell => {
                if (cell.value === highlightValue) {
                    cell.isSelected = true;
                } else {
                    cell.isSelected = false;
                }
                return cell;
            });
            return box;
        });
        this.setState({ puzzle: puzzle });
    }

    handleArrowKey(key) {
        let puzzle = JSON.parse(JSON.stringify(this.state.puzzle));
        let newRow;
        let newColumn;
        puzzle.boxes.map(box => {
            box.cells.map(cell => {
                if (cell.isSelected) {
                    if (key === 'ArrowUp') {
                        if (cell.row > 1) {
                            newRow = cell.row - 1;
                            newColumn = cell.column;
                        }
                    } else if (key === 'ArrowDown') {
                        if (cell.row < 9) {
                            newRow = cell.row + 1;
                            newColumn = cell.column;
                        }
                    } else if (key === 'ArrowLeft') {
                        if (cell.column > 1) {
                            newRow = cell.row;
                            newColumn = cell.column - 1;
                        }
                    } else if (key === 'ArrowRight') {
                        if (cell.column < 9) {
                            newRow = cell.row;
                            newColumn = cell.column + 1;
                        }
                    }
                }
            });
        });

        if (newRow && newColumn) {
            puzzle.boxes = puzzle.boxes.map(box => {
                box.cells = box.cells.map(cell => {
                    if (cell.row === newRow && cell.column === newColumn) {
                        cell.isSelected = true;
                    } else {
                        cell.isSelected = false;
                    }
                    return cell;
                });
                return box;
            });
            this.setState({ puzzle: puzzle });
        }
    }

    handleNew() {
        this.setState({ showModal: true });
        this.setState({ currentDialog: 'new' });
    }

    handleShortcuts() {
        this.setState({ showModal: true });
        this.setState({ currentDialog: 'shortcuts' });
    }

    handleMultiselect() {
        const newMultiselectState = !this.state.isUsingButtonMultiselect;
        this.setState({ isUsingButtonMultiselect: newMultiselectState });
    }

    handleMarkup() {
        const newMarkupState = !this.state.isUsingButtonMarkup;
        this.setState({ isUsingButtonMarkup: newMarkupState });
    }

    handleSubmit() {
        let puzzleUpdated = JSON.parse(JSON.stringify(this.state.puzzle));
        let isPuzzleSolved = true;
        puzzleUpdated.boxes = puzzleUpdated.boxes.map(box => {
            box.cells = box.cells.map(cell => {
                if (cell.isStarting) {
                    return cell;
                }
                if (cell.value === 0 || cell.isMarkup || cell.value !== cell.solutionValue) {
                    cell.isSelected = false;
                    cell.isIncorrect = true;
                    isPuzzleSolved = false;
                }
                return cell;
            });
            return box;
        });
        this.setState({ puzzle: puzzleUpdated });
        if (isPuzzleSolved) {
            this.setState({ currentDialog: 'solved' });
        } else {
            this.setState({ currentDialog: 'wrong' });
        }
        this.setState({ showModal: true });
    }

    handleInput(input) {
        let puzzle = JSON.parse(JSON.stringify(this.state.puzzle));
        puzzle.boxes = puzzle.boxes.map(box => {
            box.cells = box.cells.map(cell => {
                if (cell.isSelected && !cell.isStarting) {
                    if (!this.state.isUsingShiftMarkup && !this.state.isUsingButtonMarkup) {
                        cell.value = parseInt(input);
                        puzzle.rows[cell.row - 1][cell.column - 1] = input;
                        puzzle.columns[cell.column - 1][cell.row - 1] = input;
                    } else {
                        let value;
                        if (input === 0) {
                            value = '';
                        } else if (cell.value === 0) {
                            value = input.toString();
                        } else if (cell.value.toString().includes(input)) {
                            value = cell.value.replace(input, '');
                        } else {
                            value = cell.value.toString() + input.toString();
                        }
                        let markupValues = Array.from(value.split(''));
                        markupValues = markupValues.sort().join('');
                        cell.value = markupValues === '' ? 0 : markupValues;
                        cell.isMarkup = true;
                        puzzle.rows[cell.row - 1][cell.column - 1] = 0;
                        puzzle.columns[cell.column - 1][cell.row - 1] = 0;
                    }
                }
                cell.isIncorrect = false;
                return cell;
            });
            return box;
        });
        let historyUpdated = JSON.parse(JSON.stringify(this.state.history));
        if (this.state.lastMove < this.state.history.length - 1) {
            historyUpdated.slice(0, historyUpdated.length - this.state.lastMove);
        }
        const newMove = {
            moveNumber: historyUpdated.length,
            puzzle: puzzle
        };
        historyUpdated.push(newMove);
        const lastMoveupdated = historyUpdated.length - 1;
        this.setState({ history: historyUpdated });
        this.setState({ lastMove: lastMoveupdated });
        this.setState({ puzzle: puzzle });
    }

    handleUndo() {
        if (this.state.lastMove > 0) {
            let previousPuzzleState = JSON.parse(JSON.stringify(this.state.history[this.state.lastMove - 1].puzzle));
            previousPuzzleState.boxes = previousPuzzleState.boxes.map(box => {
                box.cells = box.cells.map(cell => {
                    if (cell.isSelected) {
                        cell.isSelected = false;
                    }
                    return cell;
                });
                return box;
            });
            const lastMoveUpdated = this.state.lastMove - 1;
            this.setState({ lastMove: lastMoveUpdated });
            this.setState({ puzzle: previousPuzzleState });
        }
    }

    handleRedo() {
        if (this.state.lastMove < this.state.history.length - 1) {
            let nextPuzzleState = JSON.parse(JSON.stringify(this.state.history[this.state.lastMove + 1].puzzle));
            nextPuzzleState.boxes = nextPuzzleState.boxes.map(box => {
                box.cells = box.cells.map(cell => {
                    if (cell.isSelected) {
                        cell.isSelected = false;
                    }
                    return cell;
                });
                return box;
            });
            const lastMoveUpdated = this.state.lastMove + 1;
            this.setState({ lastMove: lastMoveUpdated });
            this.setState({ puzzle: nextPuzzleState });
        }
    }

    handleRestart() {
        this.setState({ showModal: true });
        this.setState({ currentDialog: 'restart' });
    }

    handleOK() {
        this.setState({ showModal: false });
        if (this.state.currentDialog === 'new' || this.state.currentDialog === 'restart') {
            this.resetPuzzle(this.state.currentDialog);
        }
    }

    handleCancel() {
        this.setState({ showModal: false });
    }

    handleKeyDown(event) {
        if (event.ctrlKey && !this.state.isUsingCtrlMultiselect) {
            this.setState({ isUsingCtrlMultiselect: true });
        } else if (event.shiftKey && !this.state.isUsingShiftMarkup) {
            this.setState({ isUsingShiftMarkup: true });
        } else if (event.key > 0 && event.key < 10) {
            this.handleInput(event.key);
        } else if (event.key === 'Escape' || event.key === 'Delete' || event.key === 'Backspace') {
            this.handleInput(0);
        } else if (!this.hasExistingSelections() && event.key.includes('Arrow')) {
            this.handleArrowKey(event.key);
        }
    }

    handleKeyUp(event) {
        if (event.key === 'Control' && this.state.isUsingCtrlMultiselect) {
            this.setState({ isUsingCtrlMultiselect: false });
        } else if (event.key === 'Shift' && this.state.isUsingShiftMarkup) {
            this.setState({ isUsingShiftMarkup: false });
        }
    }

    hasExistingSelections() {
        const boxesCopy = JSON.parse(JSON.stringify(this.state.puzzle.boxes));
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

    generateNewPuzzle() {
        let puzzle = {
            boxes: [],
            rows: [[], [], [], [], [], [], [], [], []],
            columns: [[], [], [], [], [], [], [], [], []]
        };
        for (let i = 1; i < 10; i++) {
            let cells = [];
            for (let j = 1; j < 10; j++) {
                cells[j - 1] = {
                    key: 'box' + i + '-cell' + j,
                    cellNumber: j,
                    value: 0,
                    solutionValue: 0,
                    row: 0,
                    column: 0,
                    isStarting: false,
                    isSelected: false,
                    isMarkup: false,
                    isIncorrect: false
                }
            }
            puzzle.boxes[i - 1] = {
                key: 'box' + i,
                boxNumber: i,
                cells: cells
            }
        }
        let generated = this.sudoku.makepuzzle();
        while (!this.isDifficultyCorrect(generated)) {
            generated = this.sudoku.makepuzzle();
        }
        let digits = generated.map(digit => {
            return digit === null ? 0 : digit + 1;
        });
        let solvedDigits = this.sudoku.solvepuzzle(generated).map(digit => {
            return digit === null ? 0 : digit + 1;
        });
        console.log('Solution:\n');
        for (let i = 0; i < 9; i++) {
            let solutionRow = '';
            for (let j = 0; j < 9; j++) {
                solutionRow += '   ';
                solutionRow += solvedDigits[(i * 9) + j];
            }
            console.log(solutionRow + '\n');
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                puzzle.rows[i].push(digits[(i * 9) + j]);
                puzzle.columns[j].push(digits[(i * 9) + j]);
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
                    puzzle.boxes[i].cells[cellsIndex].value = digits[digitsIndex];
                    puzzle.boxes[i].cells[cellsIndex].solutionValue = solvedDigits[digitsIndex];
                    puzzle.boxes[i].cells[cellsIndex].row = rowNumber;
                    puzzle.boxes[i].cells[cellsIndex].column = columnNumber;
                    if (digits[digitsIndex] !== 0) {
                        puzzle.boxes[i].cells[cellsIndex].isStarting = true;
                    }
                }
            }
        }
        return puzzle;
    }

    isDifficultyCorrect(puzzle) {
        let isCorrect = true;
        for (let i = 0; i < 10; i++) {
            let currentRating = this.sudoku.ratepuzzle(puzzle, 15);
            if (currentRating > 0) {
                isCorrect = false;
                break;
            }
        }
        return isCorrect;
    }

    resetPuzzle(type) {
        if (type === 'new') {
            const newPuzzle = this.generateNewPuzzle();
            this.setState({ puzzle: newPuzzle });
            const newHistory = [{
                moveNumber: 0,
                puzzle: newPuzzle
            }];
            this.setState({ history: newHistory });
        } else if (type === 'restart') {
            let historyUpdated = [];
            historyUpdated.push(JSON.parse(JSON.stringify(this.state.history)).shift());
            const startingPuzzle = historyUpdated[0].puzzle;
            this.setState({ history: historyUpdated });
            this.setState({ lastMove: 0 });
            this.setState({ puzzle: startingPuzzle });
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    renderAllBoxes() {
        return this.state.puzzle.boxes.map(b => {
            return <Box
                key={b.key}
                boxNumber={b.boxNumber}
                cells={b.cells}
                handleClick={this.handleClick}
                handleDoubleClick={this.handleDoubleClick}
            />;
        });
    }

    render() {
        return <div className='page'>
            <div className='puzzle'>
                {this.renderAllBoxes()}
            </div>
            <Tools
                isUsingButtonMultiselect={this.state.isUsingButtonMultiselect}
                isUsingButtonMarkup={this.state.isUsingButtonMarkup}
                handleNew={this.handleNew}
                handleShortcuts={this.handleShortcuts}
                handleMultiselect={this.handleMultiselect}
                handleMarkup={this.handleMarkup}
                handleSubmit={this.handleSubmit}
                handleInput={this.handleInput}
                handleUndo={this.handleUndo}
                handleRedo={this.handleRedo}
                handleRestart={this.handleRestart}
            />
            <Modal
                showModal={this.state.showModal}
                currentDialog={this.state.currentDialog}
                handleOK={this.handleOK}
                handleCancel={this.handleCancel}
            />
        </div>;
    }
}

export default Puzzle;
