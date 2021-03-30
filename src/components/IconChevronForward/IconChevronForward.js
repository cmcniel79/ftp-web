import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconChevronForward.module.css';

const IconChevronForward = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={classes} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d='M184 112l144 144-144 144'
      />
    </svg>
  );
};

const { string } = PropTypes;

IconChevronForward.defaultProps = {
  className: null,
  rootClassName: null,
};

IconChevronForward.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconChevronForward;
