import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { Button, NamedLink } from '../../components';

import css from './SectionHowItWorks.module.css';

const SectionHowItWorks = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);
  const aboutPageLink =
    <NamedLink name="AboutPage">
      <FormattedMessage id="SectionHowItWorks.aboutPageLink" />
    </NamedLink>;
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionHowItWorks.titleLineOne" />
        <br />
      </div>

      <div className={css.partContainer}>
        <div className={css.part}>
          <h2 className={css.partTitle}>
            <FormattedMessage id="SectionHowItWorks.part1Title" />
          </h2>
          <p className={css.partText}>
            <FormattedMessage id="SectionHowItWorks.part1Text" />
          </p>
        </div>

        <div className={css.part}>
          <h2 className={css.partTitle}>
            <FormattedMessage id="SectionHowItWorks.part2Title" />
          </h2>
          <p className={css.partText}>
            <FormattedMessage id="SectionHowItWorks.part2Text" />
          </p>
        </div>

        <div className={css.part}>
          <h2 className={css.partTitle}>
            <FormattedMessage id="SectionHowItWorks.part3Title" />
          </h2>
          <p className={css.partText}>
            <FormattedMessage id="SectionHowItWorks.part3Text" />
          </p>
        </div>
      </div>
      <div className={css.signupSection}>
        <h2 className={css.signupText}>
          <FormattedMessage id="SectionHowItWorks.signUpQuestion" />
        </h2>
        <NamedLink name="SignupPage" className={css.signupButton}>
          <FormattedMessage id="SectionHowItWorks.signUpButton" />
        </NamedLink>
      </div>
    </div>
  );
};

SectionHowItWorks.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHowItWorks;
