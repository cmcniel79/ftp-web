import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionMaterialsMaybe = props => {
  const { options, material } = props;
  if (!material || material.length === 0) {
    return null;
  }
  return (
    <div className={css.sectionMaterial}>
      <h2 className={css.featuresHeading}>
        <FormattedMessage id="ListingPage.materialsHeading" />
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

export default SectionMaterialsMaybe;
