import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconSocialMediaTikTok.module.css';

const IconSocialMediaTikTok = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);
  return (
    <svg
      className={classes}
      width="26"
      height="24"
      viewBox="0 0 16 14"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.446 3.594C12.628 3.594 11.873 3.323 11.267 2.866 10.572 2.342 10.073 1.573 9.896.687 9.853.468 9.829.242 9.827.011H7.49V6.396L7.487 9.893C7.487 10.828 6.879 11.621 6.035 11.9 5.79 11.98 5.525 12.019 5.25 12.004 4.898 11.984 4.569 11.878 4.282 11.707 3.673 11.342 3.26 10.681 3.248 9.925 3.231 8.743 4.186 7.779 5.368 7.779 5.601 7.779 5.825 7.817 6.035 7.886V6.141 5.514C5.813 5.481 5.588 5.464 5.361 5.464 4.068 5.464 2.858 6.001 1.994 6.97 1.341 7.701.949 8.635.888 9.614.809 10.9 1.28 12.122 2.192 13.024 2.326 13.157 2.467 13.28 2.614 13.393 3.397 13.995 4.353 14.322 5.361 14.322 5.588 14.322 5.813 14.305 6.035 14.272 6.976 14.133 7.844 13.702 8.529 13.024 9.371 12.192 9.837 11.087 9.842 9.911L9.83 4.689C10.231 4.999 10.671 5.255 11.142 5.454 11.875 5.763 12.653 5.92 13.453 5.92V4.223 3.594C13.453 3.594 13.446 3.594 13.446 3.594Z"
        fillRule="evenodd"
      />
    </svg>
  );
};

IconSocialMediaTikTok.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

IconSocialMediaTikTok.propTypes = { rootClassName: string, className: string };

export default IconSocialMediaTikTok;
