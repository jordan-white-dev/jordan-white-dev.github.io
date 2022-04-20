import React from 'react';
import '../../css/containers/UtilityContainer.css';
import PropTypes from 'prop-types';
import ActionButton from '../buttons/ActionButton';

UtilityContainer.propTypes = {
  handleNew: PropTypes.func,
  handleShortcuts: PropTypes.func,
  isUsingButtonMultiselect: PropTypes.bool,
  handleMultiselect: PropTypes.func,
  isUsingButtonMarkup: PropTypes.bool,
  handleMarkup: PropTypes.func,
  windowSize: PropTypes.string.isRequired
};

function UtilityContainer(props) {
  const {
    handleNew,
    handleShortcuts,
    isUsingButtonMultiselect,
    handleMultiselect,
    isUsingButtonMarkup,
    handleMarkup,
    windowSize
  } = props;

  return (
    <div className='container'>
      <div className='utility-container'>
        <ActionButton
          func={handleNew}
          text='New Puzzle'
          windowSize={windowSize}
        />
        <ActionButton
          func={handleShortcuts}
          text='Shortcuts'
          windowSize={windowSize}
        />
        <ActionButton
          active={isUsingButtonMultiselect}
          func={handleMultiselect}
          text='Multiselect'
          windowSize={windowSize}
        />
        <ActionButton
          active={isUsingButtonMarkup}
          func={handleMarkup}
          text='Markup'
          windowSize={windowSize}
        />
      </div>
    </div>
  );
}

export default UtilityContainer;
