import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';
import getNativeTribes from '../../translations/nativeTribes';

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

 const nativeLandsTribes = getNativeTribes();
 console.log(nativeLandsTribes);
  

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
          <option key={t.name} value={t.name}>
            {t.name}
          </option>
        ))}
      </FieldSelect>
    </div>
  )
};

export default TribeSelectFieldMaybe;
