import React from 'react';
import './css/Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
    }

    onOK(newDifficulty) { this.props.handleOK(newDifficulty); }
    onCancel() { this.props.handleCancel(); }

    renderNew() {
        return <div className='modal-content'>
            <p>New puzzle difficulty:</p>
            <div>
                <button
                    type='button'
                    className='triple-button'
                    onClick={() => this.onOK('easy')}
                >Easy</button>
                <button
                    type='button'
                    className='triple-button'
                    onClick={() => this.onOK('medium')}
                >Medium</button>
                <button
                    type='button'
                    className='triple-button'
                    onClick={() => this.onOK('hard')}
                >Hard</button>
            </div>
            <div>
                <button
                    type='button'
                    className='single-button'
                    onClick={this.onCancel}
                >Cancel <FontAwesomeIcon icon='fa-circle-xmark' /></button>
            </div>
        </div>;
    }

    renderRestart() {
        return <div className='modal-content'>
            <p>🤔 Restart the current puzzle? 🤔</p>
            <div className='double'>
                <button
                    type='button'
                    className='double-button'
                    onClick={() => this.onOK('none')}
                >OK <FontAwesomeIcon icon='fa-circle-check' /></button>
                <button
                    type='button'
                    className='double-button'
                    onClick={this.onCancel}
                >Cancel <FontAwesomeIcon icon='fa-circle-xmark' /></button>
            </div>
        </div>;
    }

    renderSolved() {
        return <div className='modal-content'>
            <p>🎉 Looks good to me! 🎉</p>
            <button
                type='button'
                className='single-button'
                onClick={() => this.onOK('none')}
            >OK <FontAwesomeIcon icon='fa-circle-check' /></button>
        </div>;
    }

    renderNotSolved() {
        return <div className='modal-content'>
            <p>😬 Something doesn't look quite right 😬</p>
            <button
                type='button'
                className='single-button'
                onClick={() => this.onOK('none')}
            >OK <FontAwesomeIcon icon='fa-circle-check' /></button>
        </div>;
    }

    renderError() {
        return <div className='modal-content'>
            <p>Whoops, something's broken</p>
            <button
                type='button'
                className='button'
                onClick={() => this.onOK('none')}
            >OK <FontAwesomeIcon icon='fa-circle-check' /></button>
        </div>;
    }

    render() {
        const classNames = this.props.showModal ? 'modal display-block' : 'modal display-none';
        let content;
        switch (this.props.currentDialog) {
            case ('new'):
                content = this.renderNew();
                break;
            case ('restart'):
                content = this.renderRestart();
                break;
            case ('solved'):
                content = this.renderSolved();
                break;
            case ('wrong'):
                content = this.renderNotSolved();
                break;
            default:
                content = this.renderError();
                break;
        }

        return (
            <div className={classNames}>
                {content}
            </div>
        );
    }
}

export default Modal;
