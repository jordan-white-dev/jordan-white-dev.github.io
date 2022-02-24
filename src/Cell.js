import React from 'react';
import './css/Cell.css';

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() { this.props.onClick(this.props.cellNumber); }

    render() {
        const value = this.props.value === 0 ? '' : this.props.value;
        let cellClasses = 'cell';
        if (this.props.isStartingValue) {
            cellClasses += ' starting';
        }
        if (this.props.isSelected) {
            cellClasses += ' selected';
        }
        if (this.props.isIncorrect) {
            cellClasses += ' incorrect';
        }
        return (
            <div className={cellClasses} >
                <div
                    className='digit-container'
                    onClick={this.onClick}
                >{value}</div>
            </div>
        );
    }
}

export default Cell;
