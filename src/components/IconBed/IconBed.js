import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconBed.module.css';

const IconBed = props => {
  const { className, rootClassName, isFilled } = props;
  const classes = classNames(rootClassName, className, isFilled ? css.filled : css.unfilled);

  return isFilled ? (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect
        strokeWidth="1.19186091"
        id="rect827-4"
        width="297.76273"
        height="150.77966"
        x="106.03389"
        y="105.76273"
      />
      <rect
        strokeWidth="1.34164083"
        id="rect827"
        width="385.62711"
        height="147.52542"
        x="64.000008"
        y="245.15254"
      />
      <path
        d="M384,240H96V136a40.12,40.12,0,0,1,40-40H376a40.12,40.12,0,0,1,40,40V240Z"
        fill="none"
        stroke="#ffffff"
        id="path4"
      />
      <path
        d="M48,416V304a64.19,64.19,0,0,1,64-64H400a64.19,64.19,0,0,1,64,64V416"
        fill="none"
        stroke="#ffffff"
        id="path6"
      />
      <path
        d="M48,416v-8a24.07,24.07,0,0,1,24-24H440a24.07,24.07,0,0,1,24,24v8"
        fill="none"
        stroke="#ffffff"
        id="path8"
      />
      <path
        d="M112,240V224a32.09,32.09,0,0,1,32-32h80a32.09,32.09,0,0,1,32,32v16"
        fill="none"
        stroke="#ffffff"
        id="path10"
      />
      <path
        d="M256,240V224a32.09,32.09,0,0,1,32-32h80a32.09,32.09,0,0,1,32,32v16"
        fill="none"
        stroke="#ffffff"
        id="path12"
      />
    </svg>
  ) : (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M384,240H96V136a40.12,40.12,0,0,1,40-40H376a40.12,40.12,0,0,1,40,40V240Z"
        id="path4"
      />
      <path
        d="M48,416V304a64.19,64.19,0,0,1,64-64H400a64.19,64.19,0,0,1,64,64V416"
        fill="none"
        id="path6"
      />
      <path
        d="M48,416v-8a24.07,24.07,0,0,1,24-24H440a24.07,24.07,0,0,1,24,24v8"
        fill="none"
        id="path8"
      />
      <path
        d="M112,240V224a32.09,32.09,0,0,1,32-32h80a32.09,32.09,0,0,1,32,32v16"
        fill="none"
        id="path10"
      />
      <path
        d="M256,240V224a32.09,32.09,0,0,1,32-32h80a32.09,32.09,0,0,1,32,32v16"
        fill="none"
        id="path12"
      />
    </svg>
  );
};

const { string } = PropTypes;

IconBed.defaultProps = {
  className: null,
  rootClassName: null,
};

IconBed.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconBed;
