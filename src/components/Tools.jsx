import React from 'react';
import '../css/Tools.css';
import PropTypes from 'prop-types';
import UtilityContainer from './containers/UtilityContainer';
import ProgressContainer from './containers/ProgressContainer';
import NumpadContainer from './containers/NumpadContainer';

Tools.propTypes = {
  isUsingButtonMultiselect: PropTypes.bool.isRequired,
  isUsingButtonMarkup: PropTypes.bool.isRequired,
  windowSize: PropTypes.string.isRequired,
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
    windowSize,
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
    <div className={`tools tools-${windowSize}`}>
      <UtilityContainer
        handleNew={handleNew}
        handleShortcuts={handleShortcuts}
        isUsingButtonMultiselect={isUsingButtonMultiselect}
        handleMultiselect={handleMultiselect}
        isUsingButtonMarkup={isUsingButtonMarkup}
        handleMarkup={handleMarkup}
        windowSize={windowSize}
      />
      <NumpadContainer
        handleNumpad={handleNumpad}
        windowSize={windowSize}
      />
      <ProgressContainer
        handleRestart={handleRestart}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleSubmit={handleSubmit}
        windowSize={windowSize}
      />
    </div>
  );
}

export default Tools;
