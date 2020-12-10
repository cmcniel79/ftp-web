import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import * as validators from '../../util/validators';
import { Form, PrimaryButton, FieldTextInput, FieldSelect, FieldCheckbox } from '../../components';
import getCountryCodes from '../../translations/countryCodes';
import config from '../../config';

import css from './SignupForm.css';

const KEY_CODE_ENTER = 13;

const SignupFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress,
        invalid,
        intl,
        onOpenTermsOfService,
      } = fieldRenderProps;

      // email
      const emailLabel = intl.formatMessage({
        id: 'SignupForm.emailLabel',
      });
      const emailPlaceholder = intl.formatMessage({
        id: 'SignupForm.emailPlaceholder',
      });
      const emailRequiredMessage = intl.formatMessage({
        id: 'SignupForm.emailRequired',
      });
      const emailRequired = validators.required(emailRequiredMessage);
      const emailInvalidMessage = intl.formatMessage({
        id: 'SignupForm.emailInvalid',
      });
      const emailValid = validators.emailFormatValid(emailInvalidMessage);

      // password
      const passwordLabel = intl.formatMessage({
        id: 'SignupForm.passwordLabel',
      });
      const passwordPlaceholder = intl.formatMessage({
        id: 'SignupForm.passwordPlaceholder',
      });
      const passwordRequiredMessage = intl.formatMessage({
        id: 'SignupForm.passwordRequired',
      });
      const passwordMinLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooShort',
        },
        {
          minLength: validators.PASSWORD_MIN_LENGTH,
        }
      );
      const passwordMaxLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooLong',
        },
        {
          maxLength: validators.PASSWORD_MAX_LENGTH,
        }
      );
      const passwordMinLength = validators.minLength(
        passwordMinLengthMessage,
        validators.PASSWORD_MIN_LENGTH
      );
      const passwordMaxLength = validators.maxLength(
        passwordMaxLengthMessage,
        validators.PASSWORD_MAX_LENGTH
      );
      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
      const passwordValidators = validators.composeValidators(
        passwordRequired,
        passwordMinLength,
        passwordMaxLength
      );

      // firstName
      const firstNameLabel = intl.formatMessage({
        id: 'SignupForm.firstNameLabel',
      });
      const firstNamePlaceholder = intl.formatMessage({
        id: 'SignupForm.firstNamePlaceholder',
      });
      const firstNameRequiredMessage = intl.formatMessage({
        id: 'SignupForm.firstNameRequired',
      });
      const firstNameRequired = validators.required(firstNameRequiredMessage);

      // lastName
      const lastNameLabel = intl.formatMessage({
        id: 'SignupForm.lastNameLabel',
      });
      const lastNamePlaceholder = intl.formatMessage({
        id: 'SignupForm.lastNamePlaceholder',
      });
      const lastNameRequiredMessage = intl.formatMessage({
        id: 'SignupForm.lastNameRequired',
      });

      const newsletterLabel = intl.formatMessage({ id: 'SignupForm.newsletterLabel' });

      // const isAdultLabel = intl.formatMessage({ id: 'SignupForm.isAdultLabel' });
      // const isAdultPlaceholder = intl.formatMessage({ id: 'SignupForm.isAdultPlaceholder' });
      // const isAdultRequired = validators.required(
      //   intl.formatMessage({
      //     id: 'SignupForm.isAdultRequired',
      //   })
      // );

      const countryLabel = intl.formatMessage({ id: 'SignupForm.countryLabel' });
      const countryPlaceholder = intl.formatMessage({ id: 'SignupForm.countryPlaceholder' });
      const countryRequired = validators.required(
        intl.formatMessage({
          id: 'SignupForm.countryRequired',
        })
      );
      const lastNameRequired = validators.required(lastNameRequiredMessage);

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;
      const countryCodes = getCountryCodes(config.locale);

      // const adultBool = document.getElementById("isAdult");
      // const minorsInfo = adultBool != null && adultBool.value === 'false' ?
      //   <div>
      //     <p className={css.minorsInfo}>
      //       From The People's Terms of Use require all account owners to be at least 18 years of age. Individuals under 
      //       the age of 18 are considered minors on From The People. Minors under age 13 are not allowed on From The People.
      //       <br/>
      //       <br/>
      //       Minors under 18 and at least 13 years of age are permitted to use From The People's services only if 
      //       they have the appropriate permission and direct supervision of their parent or legal guardian 
      //       who is the owner of the account.
      //       <br/>
      //       <br/>
      //       You are responsible for any and all account activity conducted by a minor on your account.
      //     </p>
      //   </div> : null;

      const handleTermsKeyUp = e => {
        // Allow click action with keyboard like with normal links
        if (e.keyCode === KEY_CODE_ENTER) {
          onOpenTermsOfService();
        }
      };
      const termsLink = (
        <span
          className={css.termsLink}
          onClick={onOpenTermsOfService}
          role="button"
          tabIndex="0"
          onKeyUp={handleTermsKeyUp}
        >
          <FormattedMessage id="SignupForm.termsAndConditionsLinkText" />
        </span>
      );
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <div>
            <FieldTextInput
              type="email"
              id={formId ? `${formId}.email` : 'email'}
              name="email"
              autoComplete="email"
              label={emailLabel}
              placeholder={emailPlaceholder}
              validate={validators.composeValidators(emailRequired, emailValid)}
            />
            <div className={css.name}>
              <FieldTextInput
                className={css.firstNameRoot}
                type="text"
                id={formId ? `${formId}.fname` : 'fname'}
                name="fname"
                autoComplete="given-name"
                label={firstNameLabel}
                placeholder={firstNamePlaceholder}
                validate={firstNameRequired}
              />
              <FieldTextInput
                className={css.lastNameRoot}
                type="text"
                id={formId ? `${formId}.lname` : 'lname'}
                name="lname"
                autoComplete="family-name"
                label={lastNameLabel}
                placeholder={lastNamePlaceholder}
                validate={lastNameRequired}
              />
            </div>

            {/* <FieldBoolean
              className={css.adultBool}
              id={formId ? `${formId}.isAdult` : 'isAdult'}
              name="isAdult"
              label={isAdultLabel}
              placeholder={isAdultPlaceholder}
              validate={isAdultRequired}
            // onChange={adultInputChange}
            />
            {minorsInfo} */}
            <FieldSelect
              className={css.country}
              id={formId ? `${formId}.country` : 'country'}
              name="country"
              label={countryLabel}
              validate={countryRequired}
            >
              <option disabled value="">
                {countryPlaceholder}
              </option>
              {countryCodes.map(country => {
                return (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                );
              })}
            </FieldSelect>
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.password` : 'password'}
              name="password"
              autoComplete="new-password"
              label={passwordLabel}
              placeholder={passwordPlaceholder}
              validate={passwordValidators}
            />
            <FieldCheckbox
              className={css.newsletterCheckbox}
              id="getNewsletter"
              name="getNewsletter"
              label={newsletterLabel}
              value="allowNewsletter"
            />
          </div>
          <div className={css.bottomWrapper}>
            <p className={css.bottomWrapperText}>
              <span className={css.termsText}>
                <FormattedMessage
                  id="SignupForm.termsAndConditionsAcceptText"
                  values={{ termsLink }}
                />
              </span>
            </p>
            <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
              <FormattedMessage id="SignupForm.signUp" />
            </PrimaryButton>
          </div>
        </Form>
      );
    }}
  />
);

SignupFormComponent.defaultProps = { inProgress: false };

const { bool, func } = PropTypes;

SignupFormComponent.propTypes = {
  inProgress: bool,

  onOpenTermsOfService: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SignupForm = compose(injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;
