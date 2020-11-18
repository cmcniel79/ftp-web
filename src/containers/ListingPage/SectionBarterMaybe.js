import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';

import css from './ListingPage.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION = 20;

const SectionBarterMaybe = props => {
  const { barter } = props;
  return barter ? (
    <div className={css.sectionDescription}>
      <h2 className={css.featuresHeading}>
        <FormattedMessage id="ListingPage.barterHeading" />
      </h2>
      <p className={css.description}>
        {richText(barter, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
          longWordClass: css.longWord,
        })}
      </p>
    </div>
  ) : null;
};

export default SectionBarterMaybe;
