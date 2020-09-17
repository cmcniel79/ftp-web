import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';

import css from './PremiumPage.css';

const PremiumRegionMaybe = props => {
  const { region } = props;
  return region ? (
      <div className={css.regionContainer}>
      <h2 className={css.regionTitle}>
        <FormattedMessage id="ListingPage.regionTitle" />
      </h2>
      <p className={css.regionText}>{region}</p>
      </div>
  ) : null;
};

PremiumRegionMaybe.defaultProps = { className: null, rootClassName: null };

PremiumRegionMaybe.propTypes = {
  className: string,
  rootClassName: string,
  region: string,
};

export default PremiumRegionMaybe;
