import React from 'react';
import './css/Box.css';
import Cell from './Cell';

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(cellNumber) {
        this.props.handleClick(this.props.boxNumber, cellNumber);
    }

    renderAllCells() {
        return this.props.cells.map(c => {
            return <Cell
                key={c.key}
                cellNumber={c.cellNumber}
                value={c.value}
                isStartingValue={c.isStartingValue}
                isSelected={c.isSelected}
                isIncorrect={c.isIncorrect}
                onClick={this.onClick}
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
