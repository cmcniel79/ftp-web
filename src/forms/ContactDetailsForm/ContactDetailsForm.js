import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { ensureCurrentUser } from '../../util/data';
import {
  isChangeEmailTakenError,
  isChangeEmailWrongPassword,
  isTooManyEmailVerificationRequestsError,
} from '../../util/errors';
import getCountryCodes from '../../translations/countryCodes';
import { Form, PrimaryButton, FieldTextInput, FieldSelect } from '../../components';
import config from '../../config';

import css from './ContactDetailsForm.css';

const SHOW_EMAIL_SENT_TIMEOUT = 2000;

class ContactDetailsFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { showVerificationEmailSentMessage: false, showResetPasswordMessage: false };
    this.emailSentTimeoutId = null;
    this.handleResendVerificationEmail = this.handleResendVerificationEmail.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.submittedValues = {};
  }

  componentWillUnmount() {
    window.clearTimeout(this.emailSentTimeoutId);
  }

  handleResendVerificationEmail() {
    this.setState({ showVerificationEmailSentMessage: true });

    this.props.onResendVerificationEmail().then(() => {
      // show "verification email sent" text for a bit longer.
      this.emailSentTimeoutId = window.setTimeout(() => {
        this.setState({ showVerificationEmailSentMessage: false });
      }, SHOW_EMAIL_SENT_TIMEOUT);
    });
  }

  handleResetPassword() {
    this.setState({ showResetPasswordMessage: true });
    const email = this.props.currentUser.attributes.email;
    this.props.onResetPassword(email);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={fieldRenderProps => {
          const {
            rootClassName,
            className,
            saveEmailError,
            savePhoneNumberError,
            currentUser,
            formId,
            handleSubmit,
            inProgress,
            intl,
            invalid,
            sendVerificationEmailError,
            sendVerificationEmailInProgress,
            resetPasswordInProgress,
            values,
          } = fieldRenderProps;
          const { email, shippingAddress } = values;

          const user = ensureCurrentUser(currentUser);

          if (!user.id) {
            return null;
          }

          const { email: currentEmail, emailVerified, pendingEmail, profile } = user.attributes;

          // email

          // has the email changed
          const emailChanged = currentEmail !== email;

          const emailLabel = intl.formatMessage({
            id: 'ContactDetailsForm.emailLabel',
          });

          const emailPlaceholder = currentEmail || '';

          const emailRequiredMessage = intl.formatMessage({
            id: 'ContactDetailsForm.emailRequired',
          });
          const emailRequired = validators.required(emailRequiredMessage);
          const emailInvalidMessage = intl.formatMessage({
            id: 'ContactDetailsForm.emailInvalid',
          });
          const emailValid = validators.emailFormatValid(emailInvalidMessage);

          const tooManyVerificationRequests = isTooManyEmailVerificationRequestsError(
            sendVerificationEmailError
          );

          const emailTouched = this.submittedValues.email !== values.email;
          const emailTakenErrorText = isChangeEmailTakenError(saveEmailError)
            ? intl.formatMessage({ id: 'ContactDetailsForm.emailTakenError' })
            : null;

          let resendEmailMessage = null;
          if (tooManyVerificationRequests) {
            resendEmailMessage = (
              <span className={css.tooMany}>
                <FormattedMessage id="ContactDetailsForm.tooManyVerificationRequests" />
              </span>
            );
          } else if (
            sendVerificationEmailInProgress ||
            this.state.showVerificationEmailSentMessage
          ) {
            resendEmailMessage = (
              <span className={css.emailSent}>
                <FormattedMessage id="ContactDetailsForm.emailSent" />
              </span>
            );
          } else {
            /* eslint-disable jsx-a11y/no-static-element-interactions */
            resendEmailMessage = (
              <span
                className={css.helperLink}
                onClick={this.handleResendVerificationEmail}
                role="button"
              >
                <FormattedMessage id="ContactDetailsForm.resendEmailVerificationText" />
              </span>
            );
            /* eslint-enable jsx-a11y/no-static-element-interactions */
          }

          // Email status info: unverified, verified and pending email (aka changed unverified email)
          let emailVerifiedInfo = null;

          if (emailVerified && !pendingEmail && !emailChanged) {
            // Current email is verified and there's no pending unverified email
            emailVerifiedInfo = (
              <span className={css.emailVerified}>
                <FormattedMessage id="ContactDetailsForm.emailVerified" />
              </span>
            );
          } else if (!emailVerified && !pendingEmail) {
            // Current email is unverified. This is the email given in sign up form

            emailVerifiedInfo = (
              <span className={css.emailUnverified}>
                <FormattedMessage
                  id="ContactDetailsForm.emailUnverified"
                  values={{ resendEmailMessage }}
                />
              </span>
            );
          } else if (pendingEmail) {
            // Current email has been tried to change, but the new address is not yet verified

            const pendingEmailStyled = <span className={css.emailStyle}>{pendingEmail}</span>;
            const pendingEmailCheckInbox = (
              <span className={css.checkInbox}>
                <FormattedMessage
                  id="ContactDetailsForm.pendingEmailCheckInbox"
                  values={{ pendingEmail: pendingEmailStyled }}
                />
              </span>
            );

            emailVerifiedInfo = (
              <span className={css.pendingEmailUnverified}>
                <FormattedMessage
                  id="ContactDetailsForm.pendingEmailUnverified"
                  values={{ pendingEmailCheckInbox, resendEmailMessage }}
                />
              </span>
            );
          }

          // password
          const passwordLabel = intl.formatMessage({
            id: 'ContactDetailsForm.passwordLabel',
          });
          const passwordPlaceholder = intl.formatMessage({
            id: 'ContactDetailsForm.passwordPlaceholder',
          });
          const passwordRequiredMessage = intl.formatMessage({
            id: 'ContactDetailsForm.passwordRequired',
          });

          const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);

          const passwordMinLengthMessage = intl.formatMessage(
            {
              id: 'ContactDetailsForm.passwordTooShort',
            },
            {
              minLength: validators.PASSWORD_MIN_LENGTH,
            }
          );

          const passwordMinLength = validators.minLength(
            passwordMinLengthMessage,
            validators.PASSWORD_MIN_LENGTH
          );

          const passwordValidators = emailChanged
            ? validators.composeValidators(passwordRequired, passwordMinLength)
            : null;

          const passwordFailedMessage = intl.formatMessage({
            id: 'ContactDetailsForm.passwordFailed',
          });
          const passwordTouched = this.submittedValues.currentPassword !== values.currentPassword;
          const passwordErrorText = isChangeEmailWrongPassword(saveEmailError)
            ? passwordFailedMessage
            : null;

          const confirmClasses = classNames(css.confirmChangesSection, {
            [css.confirmChangesSectionVisible]: emailChanged,
          });

          //shipping address, get from protected data
          const protectedData = profile.protectedData || {};
          const currentShippingAddress = protectedData.shippingAddress;

          const shippingAddressChanged = currentShippingAddress !== shippingAddress;

          const addressLine1Label = intl.formatMessage({
            id: 'ContactDetailsForm.addressLine1Label',
          });
          const addressLine1Placeholder = intl.formatMessage({
            id: 'ContactDetailsForm.addressLine1Placeholder',
          });

          const addressLine2Label = intl.formatMessage(
            { id: 'ContactDetailsForm.addressLine2Label' },
          );

          const addressLine2Placeholder = intl.formatMessage({
            id: 'ContactDetailsForm.addressLine2Placeholder',
          });

          const postalCodeLabel = intl.formatMessage({ id: 'ContactDetailsForm.postalCodeLabel' });
          const postalCodePlaceholder = intl.formatMessage({
            id: 'ContactDetailsForm.postalCodePlaceholder',
          });

          const cityLabel = intl.formatMessage({ id: 'ContactDetailsForm.cityLabel' });
          const cityPlaceholder = intl.formatMessage({ id: 'ContactDetailsForm.cityPlaceholder' });

          const stateLabel = intl.formatMessage({ id: 'ContactDetailsForm.stateLabel' },);
          const statePlaceholder = intl.formatMessage({ id: 'ContactDetailsForm.statePlaceholder' });

          const countryLabel = intl.formatMessage({ id: 'ContactDetailsForm.countryLabel' });
          const countryPlaceholder = intl.formatMessage({ id: 'ContactDetailsForm.countryPlaceholder' });

          // Use tha language set in config.locale to get the correct translations of the country names
          const countryCodes = getCountryCodes(config.locale);

          // generic error
          const isGenericEmailError = saveEmailError && !(emailTakenErrorText || passwordErrorText);

          let genericError = null;

          if (isGenericEmailError && savePhoneNumberError) {
            genericError = (
              <span className={css.error}>
                <FormattedMessage id="ContactDetailsForm.genericFailure" />
              </span>
            );
          } else if (isGenericEmailError) {
            genericError = (
              <span className={css.error}>
                <FormattedMessage id="ContactDetailsForm.genericEmailFailure" />
              </span>
            );
          } else if (savePhoneNumberError) {
            genericError = (
              <span className={css.error}>
                <FormattedMessage id="ContactDetailsForm.genericPhoneNumberFailure" />
              </span>
            );
          }

          const isCompleteShippingAddress = shippingAddress && shippingAddress.addressLine1 &&
            shippingAddress.city && shippingAddress.state && shippingAddress.country ? true : false;
          const sendPasswordLink = (
            <span className={css.helperLink} onClick={this.handleResetPassword} role="button">
              <FormattedMessage id="ContactDetailsForm.resetPasswordLinkText" />
            </span>
          );

          const resendPasswordLink = (
            <span className={css.helperLink} onClick={this.handleResetPassword} role="button">
              <FormattedMessage id="ContactDetailsForm.resendPasswordLinkText" />
            </span>
          );

          const resetPasswordLink =
            this.state.showResetPasswordMessage || resetPasswordInProgress ? (
              <>
                <FormattedMessage
                  id="ContactDetailsForm.resetPasswordLinkSent"
                  values={{
                    email: <span className={css.emailStyle}>{currentUser.attributes.email}</span>,
                  }}
                />{' '}
                {resendPasswordLink}
              </>
            ) : (
              sendPasswordLink
            );

          const classes = classNames(rootClassName || css.root, className);
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled =
            invalid ||
            pristineSinceLastSubmit ||
            inProgress ||
            !((emailChanged || shippingAddressChanged) && isCompleteShippingAddress);
          
            console.log(emailChanged);
            console.log(isCompleteShippingAddress);
            console.log(submitDisabled);

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              <div className={css.contactDetailsSection}>
                <div className={className ? className : css.address}>
                  <h3>Default Shipping Address </h3>
                  <div className={css.formRow}>
                    <FieldTextInput
                      id={`${formId}.addressLine1`}
                      name="shippingAddress.addressLine1"
                      className={css.field}
                      type="text"
                      autoComplete="billing address-line1"
                      label={addressLine1Label}
                      placeholder={addressLine1Placeholder}
                      // validate={addressLine1Required}
                    />
                    <FieldTextInput
                      id={`${formId}.addressLine2`}
                      name="shippingAddress.addressLine2"
                      className={css.field}
                      type="text"
                      autoComplete="billing address-line2"
                      label={addressLine2Label}
                      placeholder={addressLine2Placeholder}
                    />
                  </div>
                  <div className={css.formRow}>
                    <FieldTextInput
                      id={`${formId}.postalCode`}
                      name="shippingAddress.postal"
                      className={css.field}
                      type="text"
                      autoComplete="billing postal-code"
                      label={postalCodeLabel}
                      placeholder={postalCodePlaceholder}
                      // validate={postalCodeRequired}
                    />

                    <FieldTextInput
                      id={`${formId}.city`}
                      name="shippingAddress.city"
                      className={css.field}
                      type="text"
                      autoComplete="billing address-level2"
                      label={cityLabel}
                      placeholder={cityPlaceholder}
                      // validate={cityRequired}
                    />
                  </div>
                  <div className={css.formRow}>
                    <FieldTextInput
                      id={`${formId}.state`}
                      name="shippingAddress.state"
                      className={css.field}
                      type="text"
                      autoComplete="billing address-level1"
                      label={stateLabel}
                      placeholder={statePlaceholder}
                      // validate={stateRequired}
                    />

                    <FieldSelect
                      id={`${formId}.country`}
                      name="shippingAddress.country"
                      className={css.field}
                      label={countryLabel}
                      // validate={countryRequired}
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
                  </div>
                </div>
                <FieldTextInput
                  type="email"
                  name="email"
                  id={formId ? `${formId}.email` : 'email'}
                  label={emailLabel}
                  placeholder={emailPlaceholder}
                  validate={validators.composeValidators(emailRequired, emailValid)}
                  customErrorText={emailTouched ? null : emailTakenErrorText}
                />
                {emailVerifiedInfo}
              </div>

              <div className={confirmClasses}>
                <h3 className={css.confirmChangesTitle}>
                  <FormattedMessage id="ContactDetailsForm.confirmChangesTitle" />
                </h3>
                <p className={css.confirmChangesInfo}>
                  <FormattedMessage id="ContactDetailsForm.confirmChangesInfo" />
                  <br />
                  <FormattedMessage
                    id="ContactDetailsForm.resetPasswordInfo"
                    values={{ resetPasswordLink }}
                  />
                </p>

                <FieldTextInput
                  className={css.password}
                  type="password"
                  name="currentPassword"
                  id={formId ? `${formId}.currentPassword` : 'currentPassword'}
                  autoComplete="current-password"
                  label={passwordLabel}
                  placeholder={passwordPlaceholder}
                  validate={passwordValidators}
                  customErrorText={passwordTouched ? null : passwordErrorText}
                />
              </div>

              <div className={css.bottomWrapper}>
                {genericError}
                <PrimaryButton
                  type="submit"
                  inProgress={inProgress}
                  ready={pristineSinceLastSubmit}
                  disabled={submitDisabled}
                  className={css.submitButton}
                >
                  <FormattedMessage id="ContactDetailsForm.saveChanges" />
                </PrimaryButton>
              </div>

            </Form>
          );
        }}
      />
    );
  }
}

ContactDetailsFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  formId: null,
  saveEmailError: null,
  savePhoneNumberError: null,
  inProgress: false,
  sendVerificationEmailError: null,
  sendVerificationEmailInProgress: false,
  email: null,
  phoneNumber: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func, string } = PropTypes;

ContactDetailsFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  formId: string,
  saveEmailError: propTypes.error,
  savePhoneNumberError: propTypes.error,
  inProgress: bool,
  intl: intlShape.isRequired,
  onResendVerificationEmail: func.isRequired,
  ready: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  sendVerificationEmailInProgress: bool,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,
};

const ContactDetailsForm = compose(injectIntl)(ContactDetailsFormComponent);

ContactDetailsForm.displayName = 'ContactDetailsForm';

export default ContactDetailsForm;
