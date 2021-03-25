import React from 'react';
import { FieldSelect, ExternalLink } from '../../components';
import getNativeTribes from '../../translations/nativeTribes';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ProfileSettingsForm.module.css';

const TribeSelectFieldMaybe = props => {
  const { name, id, intl } = props;
  const nativeLandsHeader = intl.formatMessage({
    id: 'ProfileSettingsForm.nativeLandsHeader',
  });
  const nativeLandsLabel = intl.formatMessage({
    id: 'ProfileSettingsForm.nativeLandsLabel',
  });
  const nativeLandsPlaceholder = intl.formatMessage({
    id: 'ProfileSettingsForm.nativeLandsPlaceholder',
  });
  const nativeLandsInfoLine1 = intl.formatMessage({
    id: 'ProfileSettingsForm.nativeLandsInfoLine1',
  });
  // const nativeLandsRequired = required(
  //   intl.formatMessage({
  //     id: 'ProfileSettingsForm.nativeLandsRequired',
  //   })
  // );
  const faqLink = <ExternalLink href="https://www.fromthepeople.co/faq#nativeLands">
    FAQ
  </ExternalLink>;

  const nativeLandsLink = <ExternalLink href="https://native-land.ca/">
    Native Lands Map
  </ExternalLink>;

  const nativeLandsInfoLine2 =
    <FormattedMessage
      id='ProfileSettingsForm.nativeLandsInfoLine2'
      values={{ faqLink: faqLink, nativeLandsLink: nativeLandsLink }}
    />


  const nativeLandsTribes = getNativeTribes();

  return (
    <div className={css.tribeSelect}>
      <h3 className={css.sectionTitle}>
        {nativeLandsHeader}
      </h3>
      <FieldSelect
        name={name}
        id={id}
        label={nativeLandsLabel}
        // validate={nativeLandsRequired}
      >
        {<option disabled value="">
          {nativeLandsPlaceholder}
        </option>}
        {nativeLandsTribes.map(t => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </FieldSelect>
      <p className={css.nativeLandsInfo}>
        {nativeLandsInfoLine1}
        <br />
        <br />
        {nativeLandsInfoLine2}
      </p>
    </div>
  )
};

export default TribeSelectFieldMaybe;
