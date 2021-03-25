import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.module.css';

const SectionSizesMaybe = props => {
  const { sizes } = props;
  return sizes ? (
      <div className={css.sectionSizes}>
      <h2 className={css.featuresHeading}>
        <FormattedMessage id="ListingPage.styleHeading" />
      </h2>
      <p className={css.sizesText}>{sizes}</p>
      </div>
  ) : null;
};

SectionSizesMaybe.defaultProps = { sizes: null, };

SectionSizesMaybe.propTypes = {
  Sizes: string
};

export default SectionSizesMaybe;
