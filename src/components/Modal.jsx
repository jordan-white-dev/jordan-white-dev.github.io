import React from 'react';
import '../css/Modal.css';
import PropTypes from 'prop-types';
import ModalButton from './buttons/ModalButton';

Modal.propTypes = {
  handleOK: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  currentDialog: PropTypes.string.isRequired
};

function Modal(props) {
  const { handleOK, handleCancel, showModal, currentDialog } = props;

  function renderNew() {
    return (
      <div className='content'>
        <p>🤔 Generate a new puzzle? 🤔</p>
        <div className='double'>
          <ModalButton
            className='double-button'
            func={handleOK}
            text='OK'
            icon='fa-circle-check'
          />
          <ModalButton
            className='double-button'
            func={handleCancel}
            text='Cancel'
            icon='fa-circle-xmark'
          />
        </div>
      </div>
    );
  }

  function renderShortcuts() {
    return (
      <div className='content'>
        <p>• Multiselect: Ctrl+click</p>
        <p>• Markup: Shift+input</p>
        <p>• Double click to highlight matching values</p>
        <p>• Navigate the selection using arrow keys</p>
        <ModalButton
          className='single-button'
          func={handleOK}
          text='OK'
          icon='fa-circle-check'
        />
      </div>
    );
  }

  function renderRestart() {
    return (
      <div className='content'>
        <p>🤔 Restart the current puzzle? 🤔</p>
        <div className='double'>
          <ModalButton
            className='double-button'
            func={handleOK}
            text='OK'
            icon='fa-circle-check'
          />
          <ModalButton
            className='double-button'
            func={handleCancel}
            text='Cancel'
            icon='fa-circle-xmark'
          />
        </div>
      </div>
    );
  }

  function renderSolved() {
    return (
      <div className='content'>
        <p>🎉 Looks good to me! 🎉</p>
        <ModalButton
          className='single-button'
          func={handleOK}
          text='OK'
          icon='fa-circle-check'
        />
      </div>
    );
  }

  function renderNotSolved() {
    return (
      <div className='content'>
        <p>😬 Something doesn&#39;t look quite right 😬</p>
        <ModalButton
          className='single-button'
          func={handleOK}
          text='OK'
          icon='fa-circle-check'
        />
      </div>
    );
  }

  function renderError() {
    return (
      <div className='content'>
        <p>Whoops, something&#39;s broken</p>
        <ModalButton
          className='single-button'
          func={handleOK}
          text='OK'
          icon='fa-circle-check'
        />
      </div>
    );
  }

  const classNames = showModal ? 'modal display-block' : 'modal display-none';
  let content;
  switch (currentDialog) {
    case ('new'):
      content = renderNew();
      break;
    case ('shortcuts'):
      content = renderShortcuts();
      break;
    case ('restart'):
      content = renderRestart();
      break;
    case ('solved'):
      content = renderSolved();
      break;
    case ('notSolved'):
      content = renderNotSolved();
      break;
    default:
      content = renderError();
      break;
  }

  return (
    <div className={classNames}>
      {content}
    </div>
  );
}

export default Modal;
