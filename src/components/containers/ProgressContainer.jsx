import React from 'react';
import '../../css/containers/ProgressContainer.css';
import PropTypes from 'prop-types';
import ActionButton from '../buttons/ActionButton';

ProgressContainer.propTypes = {
  handleRestart: PropTypes.func,
  handleUndo: PropTypes.func,
  handleRedo: PropTypes.func,
  handleSubmit: PropTypes.func,
  windowSize: PropTypes.string.isRequired
};

function ProgressContainer(props) {
  const {
    handleRestart,
    handleUndo,
    handleRedo,
    handleSubmit,
    windowSize
  } = props;

  return (
    <div className='container'>
      <div className='progress-container'>
        <ActionButton
          func={handleRestart}
          text='Restart'
          icon='fa-arrows-rotate'
          windowSize={windowSize}
        />
        <ActionButton
          func={handleUndo}
          text='Undo'
          icon='fa-arrow-rotate-left'
          windowSize={windowSize}
        />
        <ActionButton
          func={handleRedo}
          text='Redo'
          icon='fa-arrow-rotate-right'
          windowSize={windowSize}
        />
        <ActionButton
          func={handleSubmit}
          text='Submit'
          icon='fa-circle-check'
          windowSize={windowSize}
        />
      </div>
    </div>
  );
}

export default ProgressContainer;
