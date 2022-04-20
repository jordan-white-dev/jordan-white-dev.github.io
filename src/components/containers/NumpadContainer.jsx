import React from 'react';
import '../../css/containers/NumpadContainer.css';
import PropTypes from 'prop-types';
import NumpadButton from '../buttons/NumpadButton';

NumpadContainer.propTypes = {
  handleNumpad: PropTypes.func,
  windowSize: PropTypes.string.isRequired
};

function NumpadContainer(props) {
  const {
    handleNumpad,
    windowSize
  } = props;

  return (
    <div className='container'>
      <div className='numpad-container'>
        <NumpadButton
          handleNumpad={handleNumpad}
          number='7'
          icon='fa-7'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='8'
          icon='fa-8'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='9'
          icon='fa-9'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='4'
          icon='fa-4'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='5'
          icon='fa-5'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='6'
          icon='fa-6'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='1'
          icon='fa-1'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='2'
          icon='fa-2'
          windowSize={windowSize}
        />
        <NumpadButton
          handleNumpad={handleNumpad}
          number='3'
          icon='fa-3'
          windowSize={windowSize}
        />
      </div>
    </div>
  );
}

export default NumpadContainer;
