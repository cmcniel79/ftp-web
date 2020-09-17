import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.css';

const SectionFeaturesMaybe = props => {
  const { options, material } = props;
  if (!material) {
    return null;
  }
  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.featuresTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.material"
        options={options}
        selectedOptions={material}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionFeaturesMaybe;
