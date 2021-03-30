import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconVerified.module.css';

const IconVerified = props => {
  const { className, rootClassName, isFilled } = props;
  const classes = classNames(rootClassName, className, isFilled ? css.filled : css.unfilled);

  return isFilled ? (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle
        strokeWidth="10.13333416"
        strokeMiterlimit="4"
        strokeDasharray="none"
        id="path820"
        cx="256"
        cy="256"
        r="237.5" />
      <ellipse
        strokeWidth="1.15314329"
        id="path816"
        cx="261.42371"
        cy="256"
        rx="160.54237"
        ry="141.01695"
      />
      <path
        d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48ZM364.25,186.29l-134.4,160a16,16,0,0,1-12,5.71h-.27a16,16,0,0,1-11.89-5.3l-57.6-64a16,16,0,1,1,23.78-21.4l45.29,50.32L339.75,165.71a16,16,0,0,1,24.5,20.58Z"
        id="path4"
        fill="#d40000"
      />
    </svg>
  ) : (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle
        id="path820"
        cx="256"
        cy="256"
        r="217.49998"
        fill="none"
        strokeWidth="40"
        strokeMiterlimit="4"
        strokeDasharray="none"
      />
      <path
        d="m 213.44029,350.79547 c -1.70478,-0.51087 -4.10275,-1.81129 -5.32881,-2.88981 -5.46233,-4.80499 -61.82489,-68.20225 -62.71443,-70.5419 -4.91711,-12.93298 9.44654,-25.66475 21.44913,-19.01227 1.88374,1.04407 13.71878,13.3695 26.30009,27.38983 12.58132,14.02034 23.26411,25.62298 23.73955,25.78365 0.47544,0.16066 28.24888,-32.30035 61.71876,-72.13559 33.46989,-39.83525 62.10366,-73.59615 63.63061,-75.02423 3.67829,-3.44011 11.94485,-4.3301 16.81711,-1.81056 1.91501,0.99029 4.4347,3.36328 5.59931,5.27329 2.40559,3.94531 2.78145,11.94309 0.7312,15.5592 -1.46813,2.58942 -127.64155,153.08271 -135.14003,161.18822 -2.92303,3.15966 -6.26867,5.55973 -8.68617,6.23123 -4.43719,1.23253 -3.96438,1.23317 -8.11632,-0.0111 z"
        id="path830"
      />
    </svg>
  );
};

const { string } = PropTypes;

IconVerified.defaultProps = {
  className: null,
  rootClassName: null,
};

IconVerified.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconVerified;
