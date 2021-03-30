import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconWork.module.css';

const IconWork = props => {
  const { className, rootClassName, isFilled } = props;
  const classes = classNames(rootClassName, className, isFilled ? css.filled : css.unfilled);

  return isFilled ? (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect
        strokeWidth="0.55848944"
        id="rect821-2"
        width="438.74179"
        height="141.90076"
        x="35.666954"
        y="192.91505" />
      <rect
        strokeWidth="0.56185704"
        id="rect821-1"
        width="241.61478"
        height="260.79059"
        x="197.12698"
        y="108.54165" />
      <rect
        strokeWidth="0.46240219"
        id="rect821-5"
        width="149.57106"
        height="285.33557"
        x="62.896538"
        y="81.695557" />
      <rect
        strokeWidth="0.7233156"
        id="rect821"
        width="393.48694"
        height="265.39276"
        x="59.06139"
        y="173.73929" />
      <path
        d="M64,192V120a40,40,0,0,1,40-40h75.89a40,40,0,0,1,22.19,6.72l27.84,18.56A40,40,0,0,0,252.11,112H408a40,40,0,0,1,40,40v40"
        fill="none"
        id="path4" />
      <path
        d="M479.9,226.55,463.68,392a40,40,0,0,1-39.93,40H88.25a40,40,0,0,1-39.93-40L32.1,226.55A32,32,0,0,1,64,192h384.1A32,32,0,0,1,479.9,226.55Z"
        fill="none"
        id="path6" />
    </svg>
  ) : (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64,192V120a40,40,0,0,1,40-40h75.89a40,40,0,0,1,22.19,6.72l27.84,18.56A40,40,0,0,0,252.11,112H408a40,40,0,0,1,40,40v40"
        id="path4"
      />
      <path
        d="M479.9,226.55,463.68,392a40,40,0,0,1-39.93,40H88.25a40,40,0,0,1-39.93-40L32.1,226.55A32,32,0,0,1,64,192h384.1A32,32,0,0,1,479.9,226.55Z"
        id="path6"
      />
    </svg>
  );
};

const { string } = PropTypes;

IconWork.defaultProps = {
  className: null,
  rootClassName: null,
};

IconWork.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconWork;
