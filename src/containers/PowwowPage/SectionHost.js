import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from './PowwowPage.css';

const SectionHost = props => {
  const {
      host
  } = props;


  return (
    <div id="seller" className={css.sectionSeller}>
        {host && host.attributes.profile.displayName}
    </div>
  );
};

export default SectionHost;
