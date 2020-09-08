import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './PremiumPage.css';

const SectionRegionMaybe = props => {
  const { publicData } = props;
  return publicData && publicData.region ? (
      <div className={css.regionContainer}>
      <h2 className={css.regionTitle}>
        <FormattedMessage id="ListingPage.regionTitle" />
      </h2>
      <p className={css.regionText}>{publicData.region}</p>
      </div>
  ) : null;
};

SectionRegionMaybe.defaultProps = { className: null, rootClassName: null };

SectionRegionMaybe.propTypes = {
  className: string,
  rootClassName: string,
  publicData: shape({
    rules: string,
  }),
};

export default SectionRegionMaybe;
