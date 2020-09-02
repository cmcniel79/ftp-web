import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './ProfileSettingsForm.css';

const TribeSelectFieldMaybe = props => {
const { name, id, intl } = props;
  const nativeLandsTribeLabel = intl.formatMessage({
    id: 'ProfileSettingsForm.nativeLandsLabel',
  });
  const nativeLandsTribePlaceholder = intl.formatMessage({
    id: 'ProfileSettingsForm.nativeLandsPlaceholder',
  });
  const nativeLandsTribeRequired = required(
    intl.formatMessage({
      id: 'ProfileSettingsForm.nativeLandsRequired',
    })
  );

 const nativeLandsTribes = ['Acaxees',
 'Wailaki',
 'Yinhawangka',
 'Quinnipiac',
 'Guachichil',
 'Nahuatl (Mexico)',
 'Náayerite (Cora)',
 'Yiiji',
 'P’urhépecha',
 'Kiowa-Comanche-Apache (Oklahoma)',
 'Kuyani'
];
  

  return(
    <div>
      <FieldSelect
        className={css.category}
        name={name}
        id={id}
        label={nativeLandsTribeLabel}
        validate={nativeLandsTribeRequired}
      >
        {<option disabled value="">
          {nativeLandsTribePlaceholder}
        </option>}
        {nativeLandsTribes.map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </FieldSelect>
    </div>
  )
};

export default TribeSelectFieldMaybe;
