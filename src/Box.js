import React from 'react';
import './css/Box.css';
import Cell from './Cell';

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    onClick(cellNumber) {
        this.props.handleClick(this.props.boxNumber, cellNumber);
    }
    onDoubleClick(highlightValue) {
        this.props.handleDoubleClick(highlightValue);
    }

    renderAllCells() {
        return this.props.cells.map(c => {
            return <Cell
                key={c.key}
                cellNumber={c.cellNumber}
                value={c.value}
                isStarting={c.isStarting}
                isSelected={c.isSelected}
                isMarkup={c.isMarkup}
                isIncorrect={c.isIncorrect}
                onClick={this.onClick}
                onDoubleClick={this.onDoubleClick}
            />;
        });
    }

    render() {
        return <div className='box'>
            {this.renderAllCells()}
        </div>;
    }
}

export default Box;
