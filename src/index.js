import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './Puzzle.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowRotateLeft,
    faArrowRotateRight,
    faArrowsRotate,
    faCircleCheck,
    faCircleXmark,
    fa1,
    fa2,
    fa3,
    fa4,
    fa5,
    fa6,
    fa7,
    fa8,
    fa9
} from '@fortawesome/free-solid-svg-icons';

library.add(faArrowRotateLeft, faArrowRotateRight, faArrowsRotate, faCircleCheck, faCircleXmark, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9);

ReactDOM.render(
    <React.StrictMode>
        <Puzzle />
    </React.StrictMode>,
    document.getElementById('root')
);
