import React from 'react';
import './css/Container.css';
import PropTypes from 'prop-types';
import ActionButton from './ActionButton';
import NumpadButton from './NumpadButton';

Container.propTypes = {
  type: PropTypes.string.isRequired,
  handleNew: PropTypes.func,
  handleShortcuts: PropTypes.func,
  isUsingButtonMultiselect: PropTypes.bool,
  handleMultiselect: PropTypes.func,
  isUsingButtonMarkup: PropTypes.bool,
  handleMarkup: PropTypes.func,
  handleNumpad: PropTypes.func,
  handleRestart: PropTypes.func,
  handleUndo: PropTypes.func,
  handleRedo: PropTypes.func,
  handleSubmit: PropTypes.func
};

function Container(props) {
  const {
    type,
    handleNew,
    handleShortcuts,
    isUsingButtonMultiselect,
    handleMultiselect,
    isUsingButtonMarkup,
    handleMarkup,
    handleNumpad,
    handleRestart,
    handleUndo,
    handleRedo,
    handleSubmit
  } = props;

  function renderLeft() {
    return (
      <div className='container'>
        <div className='left'>
          <ActionButton
            func={handleNew}
            text='New Puzzle'
          />
          <ActionButton
            func={handleShortcuts}
            text='Shortcuts'
          />
          <ActionButton
            active={isUsingButtonMultiselect}
            func={handleMultiselect}
            text='Multiselect'
          />
          <ActionButton
            active={isUsingButtonMarkup}
            func={handleMarkup}
            text='Markup'
          />
        </div>
      </div>
    );
  }

  function renderNumpad() {
    return (
      <div className='container'>
        <div className='center'>
          <NumpadButton
            handleNumpad={handleNumpad}
            number='7'
            icon='fa-7'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='8'
            icon='fa-8'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='9'
            icon='fa-9'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='4'
            icon='fa-4'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='5'
            icon='fa-5'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='6'
            icon='fa-6'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='1'
            icon='fa-1'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='2'
            icon='fa-2'
          />
          <NumpadButton
            handleNumpad={handleNumpad}
            number='3'
            icon='fa-3'
          />
        </div>
      </div>
    );
  }

  function renderRight() {
    return (
      <div className='container'>
        <div className='right'>
          <ActionButton
            func={handleRestart}
            text='Restart'
            icon='fa-arrows-rotate'
          />
          <ActionButton
            func={handleUndo}
            text='Undo'
            icon='fa-arrow-rotate-left'
          />
          <ActionButton
            func={handleRedo}
            text='Redo'
            icon='fa-arrow-rotate-right'
          />
          <ActionButton
            func={handleSubmit}
            text='Submit'
            icon='fa-circle-check'
          />
        </div>
      </div>
    );
  }

  if (type === 'left') {
    return renderLeft();
  } if (type === 'numpad') {
    return renderNumpad();
  } if (type === 'right') {
    return renderRight();
  }
}

export default Container;
