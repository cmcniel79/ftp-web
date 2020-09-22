import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionCustomOrdersMaybe = props => {
  const { customOrders } = props;
  if (!customOrders || customOrders !== 'available') {
    return null;
  }
  return (
    <div className={css.sectionCustomOrders}>
      <h2 className={css.featuresTitle}>
      <FormattedMessage id="ListingPage.customOrdersTitle" />
      </h2>
      <p>
      <FormattedMessage id="ListingPage.customOrdersSubTitle" />
      </p>
    </div>
  );
};

export default SectionCustomOrdersMaybe;