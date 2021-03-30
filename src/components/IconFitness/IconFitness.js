import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconFitness.module.css';

const IconFitness = props => {
  const { className, rootClassName, isFilled } = props;
  const classes = classNames(rootClassName, className, isFilled ? css.filled : css.unfilled);

  return isFilled ? (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect
        strokeWidth="0.74276924"
        id="rect823-7"
        width="131.44888"
        height="116.10824"
        x="258.72971"
        y="218.46733" />
      <rect
        strokeWidth="0.53938985"
        id="rect823-0"
        width="69.319366"
        height="116.10824"
        x="217.39252"
        y="311.19562" />
      <rect
        strokeWidth="0.74276924"
        id="rect823-6"
        width="131.44888"
        height="116.10824"
        x="191.998"
        y="290.56827" />
      <rect
        strokeWidth="0.79720354"
        id="rect823-86"
        width="131.44888"
        height="133.74995"
        x="310.12079"
        y="127.19064" />
      <rect
        id="rect823-1"
        width="131.44888"
        height="210.45306"
        x="89.215843"
        y="96.125877" />
      <rect
        strokeWidth="0.81374806"
        id="rect823-8"
        width="94.631378"
        height="193.57838"
        x="120.66411"
        y="152.88615" />
      <rect
        id="rect825"
        width="209.39949"
        height="256.95541"
        x="151.10513"
        y="116.979" />
      <rect
        strokeWidth="0.74276924"
        id="rect823"
        width="131.44888"
        height="116.10824"
        x="63.362556"
        y="132.01857" />
      <rect
        id="rect821"
        width="132.24487"
        height="221.22049"
        x="286.71188"
        y="89.975136" />
      <path
        d="M352.92,80C288,80,256,144,256,144s-32-64-96.92-64C106.32,80,64.54,124.14,64,176.81c-1.1,109.33,86.73,187.08,183,252.42a16,16,0,0,0,18,0c96.26-65.34,184.09-143.09,183-252.42C447.46,124.14,405.68,80,352.92,80Z"
        id="path4" />
      <polyline
        points="48 256 160 256 208 160 256 320 304 224 336 288 464 288"
        id="polyline6" />
    </svg>
  ) : (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M352.92,80C288,80,256,144,256,144s-32-64-96.92-64C106.32,80,64.54,124.14,64,176.81c-1.1,109.33,86.73,187.08,183,252.42a16,16,0,0,0,18,0c96.26-65.34,184.09-143.09,183-252.42C447.46,124.14,405.68,80,352.92,80Z"
        id="path4" />
      <polyline
        points="48 256 160 256 208 160 256 320 304 224 336 288 464 288"
        id="polyline6" />
    </svg>
  );
};

const { string } = PropTypes;

IconFitness.defaultProps = {
  className: null,
  rootClassName: null,
};

IconFitness.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconFitness;
