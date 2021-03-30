import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconOther.module.css';

const IconOther = props => {
  const { className, rootClassName, isFilled } = props;
  const classes = classNames(rootClassName, className, isFilled ? css.filled : css.unfilled);

  return isFilled ? (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
        fill="none"
        id="path845"
      />
      <circle
        cx="256"
        cy="192"
        r="48"
        fill="none"
        id="circle847"
      />
    </svg>
  ) : (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
        fill="none"
        id="path845"
      />
      <circle
        cx="256"
        cy="192"
        r="48"
        fill="none"
        id="circle847"
      />
    </svg>
  );
};

const { string } = PropTypes;

IconOther.defaultProps = {
  className: null,
  rootClassName: null,
};

IconOther.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconOther;
