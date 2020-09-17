import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.css';

const SectionStyleMaybe = props => {
  const { style } = props;
  return style ? (
      <div className={css.styleContainer}>
      <h2 className={css.regionTitle}>
        <FormattedMessage id="ListingPage.styleTitle" />
      </h2>
      <p className={css.regionText}>{style}</p>
      </div>
  ) : null;
};

SectionStyleMaybe.defaultProps = { style: null, };

SectionStyleMaybe.propTypes = {
  style: string
};

export default SectionStyleMaybe;
