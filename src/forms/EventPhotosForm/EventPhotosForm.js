import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Field, Form as FinalForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { isUploadImageOverLimitError } from '../../util/errors';
import {
  Form,
  Button,
  IconSpinner,
  NamedLink
} from '../../components';

import css from './EventPhotosForm.module.css';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

class EventPhotosFormComponent extends Component {
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
            handleSubmit,
            invalid,
            hostUUID,
            onImageUpload,
            eventImage,
            rootClassName,
            uploadImageError,
            uploadInProgress,
            isNewImage,
            form,
            values,
          } = fieldRenderProps;

          const eventsPageLink = (
            <NamedLink name="EventsPage">
              <FormattedMessage id="EventPhotosForm.eventsPageLink" />
            </NamedLink> );

          // // Ensure that image exists
          const fileExists = eventImage && eventImage.id && eventImage.src ? true : false;
          const imageComponent =
            fileExists ? (
              <img className={css.eventImage} src={eventImage.src} alt="Your Event" />
            ) : null;
          
          const chooseImageLabel =
            !uploadInProgress && eventImage && eventImage.src ? (
              <div className={css.imageContainer}>
                {imageComponent}
                <div className={css.changeImage}>
                  <FormattedMessage id="EventPhotosForm.changePicture" />
                </div>
              </div>
            ) : uploadInProgress ? (
              <div className={css.uploadingImageOverlay}>
                <IconSpinner />
              </div>
            ) : (
                  <div className={css.imagePlaceholder}>
                    <div className={css.imagePlaceholderText}>
                      <FormattedMessage id="EventPhotosForm.addYourEventPicture" />
                    </div>
                    <div className={css.imagePlaceholderTextMobile}>
                      <FormattedMessage id="EventPhotosForm.addYourEventPictureMobile" />
                    </div>
                  </div>
                );

          const submitError = uploadImageError ? (
            <div className={css.error}>
              <FormattedMessage id="EventPhotosForm.updateProfileFailed" />
            </div>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled =
            invalid || !isNewImage || !fileExists || pristineSinceLastSubmit || uploadInProgress;
          
          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = eventImage.id;
                handleSubmit(e);
              }}
            >
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="EventPhotosForm.yourEventPicture" />
                </h3>
                {hostUUID ?
                  <Field
                    accept={ACCEPT_IMAGES}
                    id="eventImage"
                    name="eventImage"
                    label={chooseImageLabel}
                    type="file"
                    form={null}
                    uploadImageError={uploadImageError}
                    disabled={uploadInProgress}
                  >
                    {fieldProps => {
                      const { accept, id, input, label, disabled, uploadImageError } = fieldProps;
                      const { name, type } = input;
                      const onChange = e => {
                        const file = e.target.files[0];
                        form.change(`eventImage`, file);
                        form.blur(`eventImage`);
                        if (file != null) {
                          const tempId = `${hostUUID}`;
                          onImageUpload({ id: tempId, file });
                        }
                      };

                      let error = null;

                      if (isUploadImageOverLimitError(uploadImageError)) {
                        error = (
                          <div className={css.error}>
                            <FormattedMessage id="EventPhotosForm.imageUploadFailedFileTooLarge" />
                          </div>
                        );
                      } else if (uploadImageError) {
                        error = (
                          <div className={css.error}>
                            <FormattedMessage id="EventPhotosForm.imageUploadFailed" />
                          </div>
                        );
                      }
                      return (
                        <div className={css.uploadWrapper}>
                          <label className={css.label} htmlFor={id}>
                            {label}
                          </label>
                          <input
                            accept={accept}
                            id={id}
                            name={name}
                            className={css.uploadInput}
                            disabled={disabled}
                            onChange={onChange}
                            type={type}
                          />
                          {error}
                        </div>
                      );
                    }}
                  </Field>
                  :
                  <div className={css.uploadWrapper}>
                    ...Loading information
                    </div>}
                <div className={css.tip}>
                  <FormattedMessage id="EventPhotosForm.tip" values={{ link: eventsPageLink }}/>
                </div>
                <div className={css.fileInfo}>
                  <FormattedMessage id="EventPhotosForm.fileInfo" />
                </div>
              </div>
              {submitError}
              <Button
                className={css.submitButton}
                type="submit"
                inProgress={uploadInProgress}
                disabled={submitDisabled}
                // ready={fileExists}
              >
                <FormattedMessage id="EventPhotosForm.saveChanges" />
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

EventPhotosFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
  accountType: null
};

EventPhotosFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  // updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  updateProfileReady: bool,
  accountType: string,

  // from injectIntl
  intl: intlShape.isRequired,
};

const EventPhotosForm = compose(injectIntl)(EventPhotosFormComponent);

EventPhotosForm.displayName = 'EventPhotosForm';

export default EventPhotosForm;
