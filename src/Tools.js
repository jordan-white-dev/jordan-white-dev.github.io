import React from 'react';
import './css/Tools.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Tools extends React.Component {
    constructor(props) {
        super(props);
        this.onNew = this.onNew.bind(this);
        this.onShortcuts = this.onShortcuts.bind(this);
        this.onMultiselect = this.onMultiselect.bind(this);
        this.onMarkup = this.onMarkup.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUndo = this.onUndo.bind(this);
        this.onRedo = this.onRedo.bind(this);
        this.onRestart = this.onRestart.bind(this);
    }

    onNew() { this.props.handleNew(); }
    onShortcuts() { this.props.handleShortcuts(); }
    onMultiselect() { this.props.handleMultiselect(); }
    onMarkup() { this.props.handleMarkup(); }
    onSubmit() { this.props.handleSubmit(); }
    onInput(input) { this.props.handleInput(input); }
    onUndo() { this.props.handleUndo(); }
    onRedo() { this.props.handleRedo(); }
    onRestart() { this.props.handleRestart(); }

    render() {
        const multiselectClassNames = this.props.isUsingButtonMultiselect ? 'other-button active' : 'other-button';
        const markupClassNames = this.props.isUsingButtonMarkup ? 'other-button active' : 'other-button';
        return <div className='tools'>
            <div className='tools-container'>
                <div className='tools-left'>
                    <button
                        type='button'
                        className='other-button'
                        onClick={this.onNew}
                    >New Puzzle</button>
                    <button
                        type='button'
                        className='other-button'
                        onClick={this.onShortcuts}
                    >Shortcuts</button>
                    <button
                        type='button'
                        className={multiselectClassNames}
                        onClick={this.onMultiselect}
                    >Multiselect</button>
                    <button
                        type='button'
                        className={markupClassNames}
                        onClick={this.onMarkup}
                    >Markup</button>
                </div>
            </div>
            <div className='tools-container'>
                <div className='tools-center-container-inner'>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(7)}
                    ><FontAwesomeIcon icon='fa-7' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(8)}
                    ><FontAwesomeIcon icon='fa-8' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(9)}
                    ><FontAwesomeIcon icon='fa-9' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(4)}
                    ><FontAwesomeIcon icon='fa-4' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(5)}
                    ><FontAwesomeIcon icon='fa-5' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(6)}
                    ><FontAwesomeIcon icon='fa-6' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(1)}
                    ><FontAwesomeIcon icon='fa-1' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(2)}
                    ><FontAwesomeIcon icon='fa-2' className='number-icon' /></button>
                    <button
                        type='button'
                        className='number-button'
                        onClick={() => this.onInput(3)}
                    ><FontAwesomeIcon icon='fa-3' className='number-icon' /></button>
                </div>
            </div>
            <div className='tools-container'>
                <div className='tools-right'>
                    <button
                        type='button'
                        className='other-button'
                        onClick={this.onRestart}
                    >Restart <FontAwesomeIcon icon='fa-arrows-rotate' /></button>
                    <button
                        type='button'
                        className='other-button'
                        onClick={this.onUndo}
                    >Undo <FontAwesomeIcon icon='fa-arrow-rotate-left' /></button>
                    <button
                        type='button'
                        className='other-button'
                        onClick={this.onRedo}
                    >Redo <FontAwesomeIcon icon='fa-arrow-rotate-right' /></button>
                    <button
                        type='button'
                        className='other-button'
                        onClick={this.onSubmit}
                    >Submit <FontAwesomeIcon icon='fa-circle-check' /></button>
                </div>
            </div>
        </div>
    }
}

export default Tools;
