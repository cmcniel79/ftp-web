import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Field, Form as FinalForm } from 'react-final-form';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';
import { autocompletePlaceSelected, required } from '../../util/validators';
import {
  Form,
  Button,
  FieldTextInput,
  FieldSelect,
  ExternalLink,
  FieldDateRangeInput,
  FieldDateInput,
  LocationAutocompleteInputField
} from '../../components';

import css from './EventHostForm.css';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset
const identity = v => v;

class EventHostFormComponent extends Component {
  constructor(props) {
    super(props);

    this.uploadDelayTimeoutId = null;
    this.state = { uploadDelay: false };
    this.submittedValues = {};
  }

  componentDidUpdate(prevProps) {
    // Upload delay is additional time window where Avatar is added to the DOM,
    // but not yet visible (time to load image URL from srcset)
    if (prevProps.uploadInProgress && !this.props.uploadInProgress) {
      this.setState({ uploadDelay: true });
      this.uploadDelayTimeoutId = window.setTimeout(() => {
        this.setState({ uploadDelay: false });
      }, UPLOAD_CHANGE_DELAY);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.uploadDelayTimeoutId);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={fieldRenderProps => {
          const {
            className,
            currentUser,
            handleSubmit,
            intl,
            invalid,
            onImageUpload,
            pristine,
            rootClassName,
            updateInProgress,
            updateProfileError,
            uploadInProgress,
            values,
            accountType,
            companyWebsite
          } = fieldRenderProps;

          const user = ensureCurrentUser(currentUser);

          // Event Name
          const eventNameLabel = intl.formatMessage({ id: 'EventHostForm.eventNameLabel' });
          const eventNamePlaceholder = intl.formatMessage({ id: 'EventHostForm.eventNamePlaceholder' });
          const eventNameRequiredMessage = intl.formatMessage({ id: 'EventHostForm.eventNameRequired' });

          // Event Type
          const eventTypeLabel = intl.formatMessage({ id: 'EventHostForm.eventTypeLabel' });
          const eventTypePlaceholder = intl.formatMessage({ id: 'EventHostForm.eventTypePlaceholder' });
          const eventTypeRequiredMessage = intl.formatMessage({ id: 'EventHostForm.eventTypeRequired' });

          // Event Description
          const eventDescriptionMessage = intl.formatMessage({ id: 'EventHostForm.eventDescriptionMessage' });
          const eventDescriptionPlaceholder = intl.formatMessage({ id: 'EventHostForm.eventDescriptionPlaceholder' });
          const descriptionRequiredMessage = intl.formatMessage({ id: 'EventHostForm.eventDescriptionRequired' });

          // Event Duration
          const eventDurationLabel = intl.formatMessage({ id: 'EventHostForm.eventDurationMessage' });
          const eventDurationPlaceholder = intl.formatMessage({ id: 'EventHostForm.eventDurationPlaceholder' });
          const eventDurationRequiredMessage = intl.formatMessage({ id: 'EventHostForm.eventDurationRequired' });

          // MC, Arena Director and Host Drum labels
          const mcLabel = intl.formatMessage({ id: 'EventHostForm.mcLabel' });
          const arenaLabel = intl.formatMessage({ id: 'EventHostForm.arenaLabel' });
          const hostDrumLabel = intl.formatMessage({ id: 'EventHostForm.hostDrumLabel' });

          //Date and time fields
          const eventTimeLabel = intl.formatMessage({ id: 'EventHostForm.eventTimeLabel' });
          const eventTimePlaceholder = intl.formatMessage({ id: 'EventHostForm.eventTimePlaceholder' });
          const eventTimeRequiredMessage = intl.formatMessage({ id: 'EventHostForm.eventTimeRequired' });
          const eventMeridiemLabel = intl.formatMessage({ id: 'EventHostForm.eventMeridiemLabel' });

          //Location Fields
          const addressLabel = intl.formatMessage({ id: 'EventHostForm.address' });
          const addressPlaceholderMessage = intl.formatMessage({ id: 'EventHostForm.addressPlaceholder' });
          const addressNotRecognizedMessage = intl.formatMessage({ id: 'EventHostForm.addressNotRecognized' });
          const lotLabel = intl.formatMessage({ id: 'EventHostForm.lotLabel' });
          const lotPlaceholderMessage = intl.formatMessage({ id: 'EventHostForm.lotPlaceholder' });

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

          const eventOptions = [
            { key: 'powwow', label: "Powwow" },
            { key: 'virtual', label: "Virtual Event" },
          ];

          const durationOptions = [
            { key: 'single', label: "Single day" },
            { key: 'multi', label: "Multi day" },
          ];

          const timeOptions = [
            { key: '1:00', label: "1:00" },
            { key: '2:00', label: "2:00" },
            { key: '3:00', label: "3:00" },
            { key: '4:00', label: "4:00" },
            { key: '5:00', label: "5:00" },
            { key: '6:00', label: "6:00" },
            { key: '7:00', label: "7:00" },
            { key: '8:00', label: "8:00" },
            { key: '9:00', label: "9:00" },
            { key: '10:00', label: "10:00" },
            { key: '11:00', label: "11:00" },
            { key: '12:00', label: "12:00" },
          ];

          const meridiemOptions = [
            { key: 'am', label: "AM" },
            { key: 'pm', label: "PM" },
          ]

          const durationSelection = document.getElementById('eventDuration');
          const typeSelection = document.getElementById('eventType');

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="EventHostForm.eventInfo" />
                </h3>
                <div className={css.eventContainer}>
                  <p className={css.websiteTitle}>
                    <FormattedMessage id="EventHostForm.yourWebsite" />
                  </p>
                  <p className={css.websiteValue}>
                    {companyWebsite ? companyWebsite : <FormattedMessage id="EventHostForm.noWebsite" />}
                  </p>
                  <p className={css.websiteSubtitle}>
                    <FormattedMessage id="EventHostForm.changeSettings" values={{ emailLink }} />
                  </p>
                  <FieldTextInput
                    className={css.eventField}
                    type="text"
                    id="eventName"
                    name="eventName"
                    label={eventNameLabel}
                    placeholder={eventNamePlaceholder}
                    maxLength={30}
                    validate={required(eventNameRequiredMessage)}
                  />
                  <FieldSelect
                    className={css.eventField}
                    name="eventType"
                    id="eventType"
                    label={eventTypeLabel}
                    validate={required(eventTypeRequiredMessage)}
                  >
                    {<option disabled value="">
                      {eventTypePlaceholder}
                    </option>}
                    {eventOptions.map(i => (
                      <option key={i.key} value={i.key}>
                        {i.label}
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldTextInput
                    id="description"
                    name="description"
                    className={css.eventField}
                    type="textarea"
                    label={eventDescriptionMessage}
                    placeholder={eventDescriptionPlaceholder}
                    validate={required(descriptionRequiredMessage)}
                  />
                  <FieldSelect
                    className={css.eventField}
                    name="eventDuration"
                    id="eventDuration"
                    label={eventDurationLabel}
                    validate={required(eventDurationRequiredMessage)}
                  >
                    {<option disabled value="">
                      {eventDurationPlaceholder}
                    </option>}
                    {durationOptions.map(i => (
                      <option key={i.key} value={i.key}>
                        {i.label}
                      </option>
                    ))}
                  </FieldSelect>
                  {durationSelection && durationSelection.value && durationSelection.value === 'multi' ?
                    <div>
                      <div className={css.dateContainer}>
                        <FieldDateRangeInput
                          name="eventDates"
                          unitType="units"
                          startDateLabel='Start date'
                          startDateId='EmptyDateRange.bookingStartDate'
                          endDateLabel='End date'
                          endDateId='EmptyDateRangeInputForm.bookingEndDate'
                        />
                      </div>
                    </div>
                    :
                    <div className={css.dateAndTimeContainer}>
                      <FieldDateInput
                        className={css.dateInput}
                        name='eventDate'
                        useMobileMargins={false}
                        id={`EmptyDateInputForm.bookingDate`}
                        label='Date'
                        placeholderText={moment().format('ddd, MMMM D')}
                      />
                      <div className={css.timeContainer}>
                        <FieldSelect
                          className={css.eventTime}
                          name="eventTime"
                          id="eventTime"
                          label={eventTimeLabel}
                          validate={required(eventTimeRequiredMessage)}
                        >
                          {<option disabled value="">
                            {eventTimePlaceholder}
                          </option>}
                          {timeOptions.map(i => (
                            <option key={i.key} value={i.key}>
                              {i.label}
                            </option>
                          ))}
                        </FieldSelect>
                        <FieldSelect
                          className={css.eventMeridiem}
                          name="eventMeridiem"
                          id="eventMeridiem"
                          label={eventMeridiemLabel}
                        >
                          {meridiemOptions.map(i => (
                            <option key={i.key} value={i.key}>
                              {i.label}
                            </option>
                          ))}
                        </FieldSelect>
                      </div>
                    </div>}
                </div>
                {typeSelection && typeSelection.value && typeSelection.value === 'powwow' ?
                  <div className={css.optionalContainer}>
                    <h3 className={css.sectionTitle}>
                      <FormattedMessage id="EventHostForm.additionalInfo" />
                    </h3>
                    <div className={css.eventContainer}>
                      <FieldTextInput
                        className={css.eventField}
                        type="text"
                        id="mc"
                        name="mc"
                        label={mcLabel}
                        maxLength={30}
                      />
                      <FieldTextInput
                        className={css.eventField}
                        type="text"
                        id="arenaDirector"
                        name="arenaDirector"
                        label={arenaLabel}
                        maxLength={30}
                      />
                      <FieldTextInput
                        className={css.eventField}
                        type="text"
                        id="hostDrum"
                        name="hostDrum"
                        label={hostDrumLabel}
                        maxLength={30}
                      />
                      <LocationAutocompleteInputField
                        className={css.eventField}
                        validClassName={css.validLocation}
                        invalidClassName={css.invalidLocation}
                        name="location"
                        label={addressLabel}
                        placeholder={addressPlaceholderMessage}
                        useDefaultPredictions={false}
                        format={identity}
                        validate={autocompletePlaceSelected(addressNotRecognizedMessage)}
                        showImage={false}
                      />
                      <FieldTextInput
                        className={css.eventField}
                        type="text"
                        name="lot"
                        id="lot"
                        label={lotLabel}
                        placeholder={lotPlaceholderMessage}
                        maxLength={30}
                      />
                    </div>
                  </div> : null}
              </div>
              {submitError}
              <Button
                className={typeSelection && typeSelection.value && typeSelection.value === 'powwow' ? css.submitButton : css.submitButtonExtraMargin}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={pristineSinceLastSubmit}
              >
                <FormattedMessage id="ProfileSettingsForm.saveChanges" />
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

EventHostFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
  accountType: null
};

EventHostFormComponent.propTypes = {
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

const EventHostForm = compose(injectIntl)(EventHostFormComponent);

EventHostForm.displayName = 'EventHostForm';

export default EventHostForm;
