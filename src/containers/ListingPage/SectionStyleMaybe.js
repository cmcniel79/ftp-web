import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './ListingPage.css';

const SectionStyleMaybe = props => {
  const { publicData } = props;
  return publicData && publicData.style ? (
      <div className={css.styleContainer}>
      <h2 className={css.regionTitle}>
        <FormattedMessage id="ListingPage.styleTitle" />
      </h2>
      <p className={css.regionText}>{publicData.style}</p>
      </div>
  ) : null;
};

SectionStyleMaybe.defaultProps = { className: null, rootClassName: null };

SectionStyleMaybe.propTypes = {
  className: string,
  rootClassName: string,
  publicData: shape({
    rules: string,
  }),
};

export default SectionStyleMaybe;
