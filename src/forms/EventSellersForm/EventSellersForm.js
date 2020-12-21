import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';
import { composeValidators, emailFormatValid } from '../../util/validators';
import {
  Form,
  Button,
  FieldTextInput,
  ExternalLink,
} from '../../components';

import css from './EventSellersForm.css';

const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

class EventSellersFormComponent extends Component {
  constructor(props) {
    super(props);

    this.uploadDelayTimeoutId = null;
    this.state = { email: '' };
    this.submittedValues = {};
    this.addAnother = this.addAnother.bind(this);
  }

  addAnother(){
    console.log("Hello There");
    this.setState({
      email: '',
    });
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={fieldRenderProps => {
          const {
            className,
            handleSubmit,
            intl,
            invalid,
            pristine,
            rootClassName,
            updateInProgress,
            updateProfileError,
            uploadInProgress,
            values,
            value
          } = fieldRenderProps;

          // Event Name
          const sellerInputLabel = intl.formatMessage({ id: 'EventSellersForm.sellerInputLabel' });
          const sellerInputPlaceholder = intl.formatMessage({ id: 'EventSellersForm.sellerInputPlaceholder' });
          const emailInvalidMessage = intl.formatMessage({ id: 'SignupForm.emailInvalid' });
          const emailValid = emailFormatValid(emailInvalidMessage);

          const submitError = updateProfileError ? (
            <div className={css.error}>
              <FormattedMessage id="ProfileSettingsForm.updateProfileFailed" />
            </div>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitInProgress = updateInProgress;
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled =
            invalid || pristine || pristineSinceLastSubmit || uploadInProgress || submitInProgress;
          const emailLink = (
            <ExternalLink href="mailto:customersupport@fromthepeople.co">
              <FormattedMessage id="ProfileSettingsForm.contactEmail" />
            </ExternalLink>);
  console.log(value);
          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
                // this.addAnother();
              }}
            >
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="EventSellersForm.eventSellersInfo" />
                </h3>
                <FieldTextInput
                  className={css.eventField}
                  type="textarea"
                  id="sellerInput"
                  name="sellerInput"
                  label={sellerInputLabel}
                  placeholder={sellerInputPlaceholder}
                  maxLength={30}
                  validate={composeValidators(emailValid)}
                  value={value}
                />
              </div>
              {submitError}
              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={pristineSinceLastSubmit}
              >
                <FormattedMessage id="EventSellersForm.addSeller" />
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

EventSellersFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
  accountType: null
};

EventSellersFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  updateProfileReady: bool,
  accountType: string,

  // from injectIntl
  intl: intlShape.isRequired,
};

const EventSellersForm = compose(injectIntl)(EventSellersFormComponent);

EventSellersForm.displayName = 'EventSellersForm';

export default EventSellersForm;
