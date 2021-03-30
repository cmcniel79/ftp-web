import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconChevronBack.module.css';

const IconChevronBack = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d='M328 112L184 256l144 144'
      />
    </svg>
  );
};

const { string } = PropTypes;

IconChevronBack.defaultProps = {
  className: null,
  rootClassName: null,
};

IconChevronBack.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconChevronBack;
