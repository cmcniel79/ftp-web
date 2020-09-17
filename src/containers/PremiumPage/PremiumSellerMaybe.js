import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PremiumUserCard } from '../../components';

import css from './PremiumPage.css';

const PremiumSellerMaybe = props => {
  const {
    listing,
    currentUser,
  } = props;

  if (!listing.author) {
    return null;
  }

  return (
    <div id="seller" className={css.sectionSeller}>
      <h2 className={css.premiumSellerHeading}>
        <FormattedMessage id="PremiumPage.premiumPartnerHeading" />
      </h2>
      <PremiumUserCard user={listing.author} currentUser={currentUser} />
    </div>
  );
};

export default PremiumSellerMaybe;
