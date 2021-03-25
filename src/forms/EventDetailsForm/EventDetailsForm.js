import React, { Component } from 'react';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import { autocompletePlaceSelected, required } from '../../util/validators';
import { createSlug } from '../../util/urlHelpers';
import getStateCodes from '../../translations/stateCodes';
import arrow from '../../assets/arrow-forward-outline.svg';
import {
  Form,
  Button,
  FieldTextInput,
  FieldSelect,
  ExternalLink,
  FieldDateRangeInput,
  FieldDateInput,
  LocationAutocompleteInputField,
  NamedLink
} from '../../components';

import css from './EventDetailsForm.module.css';


const identity = v => v;

class EventDetailsFormComponent extends Component {
  constructor(props) {
    super(props);
    this.submittedValues = {};
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
            values,
            hostUUID,
            initialValues,
            eventDetailsUpdate,
            eventDetailsInProgress,
            eventDetailsError
          } = fieldRenderProps;

          const eventPageLink = !eventDetailsInProgress && initialValues && initialValues.eventName && initialValues.eventType ? (
            <NamedLink
              name="SingleEventPage"
              params={{ eventType: initialValues.eventType, slug: createSlug(initialValues.eventName), id: hostUUID }}
            >
              <FormattedMessage id="EventDetailsForm.eventPageLink" />
              <img className={css.arrow} src={arrow} alt="arrow" />
            </NamedLink>) : null;

          // From The People Admins will set the event website
          const website = initialValues && initialValues.eventWebsite;

          // Event Name
          const eventNameLabel = intl.formatMessage({ id: 'EventDetailsForm.eventNameLabel' });
          const eventNamePlaceholder = intl.formatMessage({ id: 'EventDetailsForm.eventNamePlaceholder' });
          const eventNameRequiredMessage = intl.formatMessage({ id: 'EventDetailsForm.eventNameRequired' });

          // Event Type
          const eventTypeLabel = intl.formatMessage({ id: 'EventDetailsForm.eventTypeLabel' });
          const eventTypePlaceholder = intl.formatMessage({ id: 'EventDetailsForm.eventTypePlaceholder' });
          const eventTypeRequiredMessage = intl.formatMessage({ id: 'EventDetailsForm.eventTypeRequired' });

          // Event Description
          const eventDescriptionMessage = intl.formatMessage({ id: 'EventDetailsForm.eventDescriptionMessage' });
          const eventDescriptionPlaceholder = intl.formatMessage({ id: 'EventDetailsForm.eventDescriptionPlaceholder' });
          const descriptionRequiredMessage = intl.formatMessage({ id: 'EventDetailsForm.eventDescriptionRequired' });

          // Event Duration
          const eventDurationLabel = intl.formatMessage({ id: 'EventDetailsForm.eventDurationMessage' });
          const eventDurationPlaceholder = intl.formatMessage({ id: 'EventDetailsForm.eventDurationPlaceholder' });
          const eventDurationRequiredMessage = intl.formatMessage({ id: 'EventDetailsForm.eventDurationRequired' });

          // MC, Arena Director and Host Drum labels
          const mcLabel = intl.formatMessage({ id: 'EventDetailsForm.mcLabel' });
          const arenaLabel = intl.formatMessage({ id: 'EventDetailsForm.arenaLabel' });
          const hostDrumLabel = intl.formatMessage({ id: 'EventDetailsForm.hostDrumLabel' });

          //Location Fields
          const addressLabel = intl.formatMessage({ id: 'EventDetailsForm.address' });
          const addressPlaceholderMessage = intl.formatMessage({ id: 'EventDetailsForm.addressPlaceholder' });
          const addressNotRecognizedMessage = intl.formatMessage({ id: 'EventDetailsForm.addressNotRecognized' });
          const stateLabel = intl.formatMessage({ id: 'EventDetailsForm.state' });
          const stateRequiredMessage = intl.formatMessage({ id: 'EventDetailsForm.stateRequired' });
          const stateOptions = getStateCodes();

          const updateMessage = eventDetailsUpdate ? (
            <div className={css.success}>
              <FormattedMessage id='EventDetailsForm.updateSuccessful' />
            </div>
          ) : null;

          const submitError = eventDetailsError ? (
            <div className={css.error}>
              <FormattedMessage id="EventDetailsForm.submitFailed" />
            </div>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled =
            invalid || pristine || pristineSinceLastSubmit || eventDetailsInProgress;
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

          const durationSelection = document.getElementById('eventDuration');
          const typeSelection = document.getElementById('eventType');

          const showDateRangeInput = durationSelection && durationSelection.value && durationSelection.value === 'multi' ? true : false;
          const showOptionalInfo = typeSelection && typeSelection.value && typeSelection.value === 'powwow' ? true : false;

          const requiredInfo = !eventDetailsInProgress ? (
              <div className={css.eventContainer}>
                <p className={css.websiteTitle}>
                  <FormattedMessage id="EventDetailsForm.yourWebsite" />
                </p>
                <p className={css.websiteValue}>
                  {website ? website : <FormattedMessage id="EventDetailsForm.noWebsite" />}
                </p>
                <p className={css.websiteSubtitle}>
                  <FormattedMessage id="EventDetailsForm.changeSettings" values={{ emailLink }} />
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
                  id="eventDescription"
                  name="eventDescription"
                  className={css.eventField}
                  type="textarea"
                  label={eventDescriptionMessage}
                  placeholder={eventDescriptionPlaceholder}
                  validate={required(descriptionRequiredMessage)}
                  maxLength={400}
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
                {showDateRangeInput ?
                  <div>
                    <div className={css.dateContainer}>
                      <FieldDateRangeInput
                        name="datesRange"
                        unitType="line-item/day"
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
                      name='startDate'
                      useMobileMargins={false}
                      id='EmptyDateInputForm.bookingDate'
                      label='Date'
                      placeholderText={moment().format('ddd, MMMM D')}
                    />
                  </div>}
              </div> ) : null;
              const optionalInfo = !eventDetailsInProgress && showOptionalInfo ? (
                <div className={css.optionalContainer}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="EventDetailsForm.additionalInfo" />
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
                      id="hostDrums"
                      name="hostDrums"
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
                    <FieldSelect
                      id="state"
                      name="state"
                      className={css.field}
                      label={stateLabel}
                      validate={required(stateRequiredMessage)}
                    >
                      {stateOptions.map(s => {
                        return (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        );
                      })}
                    </FieldSelect>
                  </div>
                </div> ) : null;

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              <h3 className={css.sectionTitle}>
                <FormattedMessage id="EventDetailsForm.eventDetails" />
              </h3>
              {updateMessage}
              {submitError}
              {eventPageLink}
              {requiredInfo}
              {optionalInfo}
              {eventDetailsInProgress ? (
                <FormattedMessage id="EventDetailsForm.eventDetailsInProgress" />
              ) : null}
              <Button
                className={typeSelection && typeSelection.value && typeSelection.value === 'powwow' ? css.submitButton : css.submitButtonExtraMargin}
                type="submit"
                inProgress={eventDetailsInProgress}
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

const EventDetailsForm = compose(injectIntl)(EventDetailsFormComponent);

EventDetailsForm.displayName = 'EventDetailsForm';

export default EventDetailsForm;
