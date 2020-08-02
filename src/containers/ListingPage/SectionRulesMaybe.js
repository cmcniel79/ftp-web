import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionRulesMaybe.css';

const SectionRulesMaybe = props => {
  const { publicData } = props;
  return publicData && publicData.style && publicData.region ? (
    <div className={css.root}>
      <div className={css.regionContainer}>
      <h2 className={css.title}>
        <FormattedMessage id="ListingPage.regionTitle" />
      </h2>
      <p className={css.text}>{publicData.region}</p>
      </div>

      <div className={css.styleContainer}>
      <h2 className={css.title}>
        <FormattedMessage id="ListingPage.styleTitle" />
      </h2>
      <p className={css.text}>{publicData.style}</p>
      </div>
    </div>
  ) : null;
};

SectionRulesMaybe.defaultProps = { className: null, rootClassName: null };

SectionRulesMaybe.propTypes = {
  className: string,
  rootClassName: string,
  publicData: shape({
    rules: string,
  }),
};

export default SectionRulesMaybe;
