import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.module.css';

const SectionCustomOrdersMaybe = props => {
  const { customOrders } = props;
  if (!customOrders || customOrders !== 'available') {
    return null;
  }
  return (
    <div className={css.sectionCustomOrders}>
      <h2 className={css.featuresHeading}>
      <FormattedMessage id="ListingPage.customOrdersHeading" />
      </h2>
      <p>
      <FormattedMessage id="ListingPage.customOrdersSubTitle" />
      </p>
    </div>
  );
};

export default SectionCustomOrdersMaybe;
