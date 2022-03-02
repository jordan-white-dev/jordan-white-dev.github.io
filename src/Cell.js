import React from 'react';
import './css/Cell.css';

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    onClick() { this.props.onClick(this.props.cellNumber); }
    onDoubleClick() {
        if (this.props.value !== 0 && !this.props.isMarkup) {
            this.props.onDoubleClick(this.props.value);
        }
    }

    render() {
        let value = this.props.value === 0 ? '' : this.props.value;
        let cellClasses = 'cell';
        let digitContainerClasses = 'digit-container';
        if (this.props.isStarting) {
            cellClasses += ' starting';
        }
        if (this.props.isSelected) {
            cellClasses += ' selected';
        }
        if (this.props.isIncorrect) {
            cellClasses += ' incorrect';
        }
        if (this.props.isMarkup) {
            digitContainerClasses += ' markup';
        }
        return (
            <div className={cellClasses} >
                <div
                    className={digitContainerClasses}
                    onClick={this.onClick}
                    onDoubleClick={this.onDoubleClick}
                >{value}</div>
            </div>
        );
    }
}

export default Cell;
