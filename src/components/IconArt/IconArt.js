import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconArt.module.css';

const IconArt = props => {
  const { className, rootClassName, isFilled } = props;
  const classes = classNames(rootClassName, className, isFilled ? css.filled : css.unfilled);

  return isFilled ? (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <ellipse
        opacity="1"
        fillOpacity="1"
        strokeWidth="1.28869987"
        id="path1440-2-2"
        cx="211.31705"
        cy="313.72247"
        rx="146.88644"
        ry="96.64592" 
        />
      <ellipse
        opacity="1"
        fillOpacity="1"
        strokeWidth="1.39317822"
        id="path1440-2"
        cx="242.38184"
        cy="232.80067"
        rx="184.08746"
        ry="90.126152" 
        />
      <ellipse
        opacity="1"
        fillOpacity="1"
        strokeWidth="1.35790217"
        id="path1440"
        cx="282.26746"
        cy="164.15141"
        rx="174.88309"
        ry="90.126152" 
        />
      <rect
        opacity="1"
        fillOpacity="1"
        strokeWidth="0.48420307"
        id="rect1408-4-5"
        width="229.73997"
        height="92.494812"
        x="157.74727"
        y="313.69666"
        transform="matrix(0.9999575,0.0092194,-0.01258061,0.99992086,0,0)" 
        />
      <rect
        opacity="1"
        fillOpacity="1"
        strokeWidth="0.39980006"
        id="rect1408"
        width="248.51807"
        height="58.294357"
        x="182.55341"
        y="347.85535" />
      <rect
        opacity="1"
        fillOpacity="1"
        strokeWidth="0.46113306"
        id="rect1408-4"
        width="208.37234"
        height="92.493515"
        x="172.15508"
        y="340.62802"
        transform="matrix(0.99994834,0.01016481,-0.01141056,0.9999349,0,0)" 
        />
      <path
        d="M430.11 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 11.99-36.6.1-47.7z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
        id="path4"
        stroke="#ffffff" 
        />
      <circle
        cx="144"
        cy="208"
        r="32"
        id="circle6"
        fill="#ffffff" 
        />
      <circle
        cx="152"
        cy="311"
        r="32"
        id="circle8"
        fill="#ffffff" 
        />
      <circle
        cx="224"
        cy="144"
        r="32"
        id="circle10"
        fill="#ffffff" 
        />
      <circle
        cx="256"
        cy="367"
        r="48"
        id="circle12"
        fill="#ffffff" 
        />
      <circle
        cx="328"
        cy="144"
        r="32"
        id="circle14"
        fill="#ffffff" 
        />
    </svg>
  ) : (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M430.11 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 11.99-36.6.1-47.7z"
        fill="none"
        strokeMiterlimit="10"
        strokeWidth="32"
        id="path4"
      />
      <circle
        cx="144"
        cy="208"
        r="32"
        id="circle6"
      />
      <circle
        cx="152"
        cy="311"
        r="32"
        id="circle8"
      />
      <circle
        cx="224"
        cy="144"
        r="32"
        id="circle10"
      />
      <circle
        cx="256"
        cy="367"
        r="48"
        id="circle12"
      />
      <circle
        cx="328"
        cy="144"
        r="32"
        id="circle14"
      />
    </svg>
  );
};

const { string } = PropTypes;

IconArt.defaultProps = {
  className: null,
  rootClassName: null,
};

IconArt.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconArt;
