import React from 'react';
import './css/Tools.css';
import PropTypes from 'prop-types';
import Container from './Container';

Tools.propTypes = {
  isUsingButtonMultiselect: PropTypes.bool.isRequired,
  isUsingButtonMarkup: PropTypes.bool.isRequired,
  handleNew: PropTypes.func.isRequired,
  handleShortcuts: PropTypes.func.isRequired,
  handleMultiselect: PropTypes.func.isRequired,
  handleMarkup: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleNumpad: PropTypes.func.isRequired,
  handleUndo: PropTypes.func.isRequired,
  handleRedo: PropTypes.func.isRequired,
  handleRestart: PropTypes.func.isRequired
};

function Tools(props) {
  const {
    isUsingButtonMultiselect,
    isUsingButtonMarkup,
    handleNew,
    handleShortcuts,
    handleMultiselect,
    handleMarkup,
    handleNumpad,
    handleRestart,
    handleUndo,
    handleRedo,
    handleSubmit
  } = props;

  return (
    <div className='tools'>
      <Container
        type='left'
        handleNew={handleNew}
        handleShortcuts={handleShortcuts}
        isUsingButtonMultiselect={isUsingButtonMultiselect}
        handleMultiselect={handleMultiselect}
        isUsingButtonMarkup={isUsingButtonMarkup}
        handleMarkup={handleMarkup}
      />
      <Container
        type='numpad'
        handleNumpad={handleNumpad}
      />
      <Container
        type='right'
        handleRestart={handleRestart}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Tools;
