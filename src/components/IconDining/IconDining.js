import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconDining.module.css';

const IconDining = props => {
  const { className, rootClassName, isFilled } = props;
  const classes = classNames(rootClassName, className, isFilled ? css.filled : css.unfilled);

  return isFilled ? (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">

      <rect
        stroke="#ffffff"
        strokeWidth="2.69456267"
        id="rect827"
        width="597.30548"
        height="597.30542"
        x="-42.65274"
        y="-42.65271" />
      <path
        d="M57.49,47.74,425.92,416.17a37.28,37.28,0,0,1,0,52.72h0a37.29,37.29,0,0,1-52.72,0l-90-91.55A32,32,0,0,1,274,354.91v-5.53a32,32,0,0,0-9.52-22.78l-11.62-10.73a32,32,0,0,0-29.8-7.44h0A48.53,48.53,0,0,1,176.5,295.8L91.07,210.36C40.39,159.68,21.74,83.15,57.49,47.74Z"
        fill="none"
        id="path4" />
      <path
        d="M400,32l-77.25,77.25A64,64,0,0,0,304,154.51v14.86a16,16,0,0,1-4.69,11.32L288,192"
        fill="none"
        id="path6" />
      <path
        d="M320,224l11.31-11.31A16,16,0,0,1,342.63,208h14.86a64,64,0,0,0,45.26-18.75L480,112"
        fill="none"
        id="path8" />
      <line
        x1="440"
        y1="72"
        x2="360"
        y2="152"
        fill="none"
        id="line10" />
      <path
        d="M200,368,100.28,468.28a40,40,0,0,1-56.56,0h0a40,40,0,0,1,0-56.56L128,328"
        fill="none"
        id="path12" />
    </svg>

  ) : (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M57.49,47.74,425.92,416.17a37.28,37.28,0,0,1,0,52.72h0a37.29,37.29,0,0,1-52.72,0l-90-91.55A32,32,0,0,1,274,354.91v-5.53a32,32,0,0,0-9.52-22.78l-11.62-10.73a32,32,0,0,0-29.8-7.44h0A48.53,48.53,0,0,1,176.5,295.8L91.07,210.36C40.39,159.68,21.74,83.15,57.49,47.74Z"
        id="path4" />
      <path
        d="M400,32l-77.25,77.25A64,64,0,0,0,304,154.51v14.86a16,16,0,0,1-4.69,11.32L288,192"
        id="path6" />
      <path
        d="M320,224l11.31-11.31A16,16,0,0,1,342.63,208h14.86a64,64,0,0,0,45.26-18.75L480,112"
        id="path8" />
      <line
        x1="440"
        y1="72"
        x2="360"
        y2="152"
        id="line10" />
      <path
        d="M200,368,100.28,468.28a40,40,0,0,1-56.56,0h0a40,40,0,0,1,0-56.56L128,328"
        id="path12" />
    </svg>
  );
};

const { string } = PropTypes;

IconDining.defaultProps = {
  className: null,
  rootClassName: null,
};

IconDining.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconDining;
