import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconChevronDown.module.css';

const IconChevronDown = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <polyline 
      points='112 184 256 328 400 184' 
      />
    </svg>
  );
};

const { string } = PropTypes;

IconChevronDown.defaultProps = {
  className: null,
  rootClassName: null,
};

IconChevronDown.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconChevronDown;
