import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './PremiumPage.css';

const PremiumStyleMaybe = props => {
  const { style, region } = props;
  const classes= region ? css.styleContainer : css.largeStyleContainer;
  return style ? (
      <div className={classes}>
      <h2 className={css.regionTitle}>
        <FormattedMessage id="ListingPage.styleTitle" />
      </h2>
      <p className={css.regionText}>{style}</p>
      </div>
  ) : null;
};

PremiumStyleMaybe.defaultProps = { className: null, rootClassName: null };

PremiumStyleMaybe.propTypes = {
  className: string,
  rootClassName: string,
  style: string,
};

export default PremiumStyleMaybe;
