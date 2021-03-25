import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink } from '../../components';

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

      <div className={css.steps}>
        <div className={css.step}>
          <p>
            <FormattedMessage id="SectionHowItWorks.part1Text" values={{ aboutPageLink }}/>
          </p>
        </div>
      </div>

      <div className={css.signUpLink}>
        <NamedLink name="SignupPage">
          <FormattedMessage id="SectionHowItWorks.signUpLink" />
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
