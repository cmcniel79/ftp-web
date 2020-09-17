import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.css';

const SectionRegionMaybe = props => {
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

SectionRegionMaybe.defaultProps = { region: null, };

SectionRegionMaybe.propTypes = {
  region: string
};

export default SectionRegionMaybe;
