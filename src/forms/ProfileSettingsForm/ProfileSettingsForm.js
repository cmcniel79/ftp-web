import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Field, Form as FinalForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';
import { required, validSocialMediaURL } from '../../util/validators';
import { isUploadImageOverLimitError } from '../../util/errors';
import {
  Form,
  Avatar,
  Button,
  ImageFromFile,
  IconSpinner,
  FieldTextInput,
  FieldSelect,
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  IconSocialMediaTikTok,
  ExternalLink,
} from '../../components';
import TribeSelectFieldMaybe from './TribeSelectFieldMaybe';
import CompanyAddressMaybe from './CompanyAddressMaybe';

import css from './ProfileSettingsForm.module.css';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

class ProfileSettingsFormComponent extends Component {
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
            profileImage,
            rootClassName,
            updateInProgress,
            updateProfileError,
            uploadImageError,
            uploadInProgress,
            form,
            values,
            accountType,
            companyWebsite
          } = fieldRenderProps;

          const user = ensureCurrentUser(currentUser);

          // Company Name
          const companyNameLabel = intl.formatMessage({ id: 'ProfileSettingsForm.companyNameLabel' });
          const companyNamePlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.companyNamePlaceholder' });

          // Company Industry
          const companyIndustryLabel = intl.formatMessage({ id: 'ProfileSettingsForm.companyIndustryLabel' });
          const companyIndustryPlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.companyIndustryPlaceholder' });

          // First name
          const firstNameLabel = intl.formatMessage({ id: 'ProfileSettingsForm.firstNameLabel' });
          const firstNamePlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.firstNamePlaceholder' });
          const firstNameRequiredMessage = intl.formatMessage({ id: 'ProfileSettingsForm.firstNameRequired' });
          const firstNameRequired = required(firstNameRequiredMessage);

          // Last name
          const lastNameLabel = intl.formatMessage({ id: 'ProfileSettingsForm.lastNameLabel' });
          const lastNamePlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.lastNamePlaceholder' });
          const lastNameRequiredMessage = intl.formatMessage({ id: 'ProfileSettingsForm.lastNameRequired' });
          const lastNameRequired = required(lastNameRequiredMessage);

          // Bio
          const bioLabel = intl.formatMessage({ id: 'ProfileSettingsForm.bioLabel' });
          const bioPlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.bioPlaceholder' });

          // Facebook
          const facebookLabel = intl.formatMessage({ id: 'ProfileSettingsForm.facebookLabel' });
          const facebookPlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.facebookPlaceholder' });
          const facebookMessage = intl.formatMessage({ id: 'ProfileSettingsForm.facebookRequiredMessage' });

          // Twitter
          const twitterLabel = intl.formatMessage({ id: 'ProfileSettingsForm.twitterLabel' });
          const twitterPlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.twitterPlaceholder' });
          const twitterMessage = intl.formatMessage({ id: 'ProfileSettingsForm.twitterRequiredMessage' });

          // Insta
          const instaLabel = intl.formatMessage({ id: 'ProfileSettingsForm.instaLabel' });
          const instaPlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.instaPlaceholder' });
          const instaMessage = intl.formatMessage({ id: 'ProfileSettingsForm.instaRequiredMessage' });

          // TikTok
          const tikTokLabel = intl.formatMessage({ id: 'ProfileSettingsForm.tikTokLabel' });
          const tikTokPlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.tikTokPlaceholder' });
          const tikTokMessage = intl.formatMessage({ id: 'ProfileSettingsForm.tikTokRequiredMessage' });

          // Tribe
          const tribeLabel = intl.formatMessage({ id: 'ProfileSettingsForm.tribeLabel' });
          const tribePlaceholder = intl.formatMessage({ id: 'ProfileSettingsForm.tribePlaceholder' });

          const uploadingOverlay =
            uploadInProgress || this.state.uploadDelay ? (
              <div className={css.uploadingImageOverlay}>
                <IconSpinner />
              </div>
            ) : null;

          const hasUploadError = !!uploadImageError && !uploadInProgress;
          const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });
          const transientUserProfileImage = profileImage.uploadedImage || user.profileImage;
          const transientUser = { ...user, profileImage: transientUserProfileImage };
          const showTribeSelection = accountType === "e" || accountType === "p" || accountType === "a" || accountType === "n" ?
            true : false;
          const showCompanyInfo = accountType === "p" || accountType === "a" || accountType === "n" ?
            true : false;
          const showSocialMediaFields = accountType === "e" || accountType === "p" || accountType === "n" ?
            true : false;
          // Whenever industry filter in marketplace-custom-config is changed then this needs to be updated
          const industryOptions = [
            { key: 'retail', label: "Retail" },
            { key: 'dining', label: "Dining" },
            { key: 'art', label: "Art and Photography" },
            { key: 'professional', label: "Professional Services" },
            { key: 'hospitality', label: "Hospitality and Tourism" },
            { key: 'nonprofit', label: "Nonprofit" },
            { key: 'beauty', label: "Beauty and Personal Services" },
            { key: 'other', label: "Other" },
          ];

          // Ensure that file exists if imageFromFile is used
          const fileExists = !!profileImage.file;
          const fileUploadInProgress = uploadInProgress && fileExists;
          const delayAfterUpload = profileImage.imageId && this.state.uploadDelay;
          const imageFromFile =
            fileExists && (fileUploadInProgress || delayAfterUpload) ? (
              <ImageFromFile
                id={profileImage.id}
                className={errorClasses}
                rootClassName={css.uploadingImage}
                aspectRatioClassName={css.squareAspectRatio}
                file={profileImage.file}
              >
                {uploadingOverlay}
              </ImageFromFile>
            ) : null;

          // Avatar is rendered in hidden during the upload delay
          // Upload delay smoothes image change process:
          // responsive img has time to load srcset stuff before it is shown to user.
          const avatarClasses = classNames(errorClasses, css.avatar, {
            [css.avatarInvisible]: this.state.uploadDelay,
          });
          const avatarComponent =
            !fileUploadInProgress && profileImage.imageId ? (
              <Avatar
                className={avatarClasses}
                renderSizes="(max-width: 767px) 96px, 240px"
                user={transientUser}
                disableProfileLink
              />
            ) : null;

          const chooseAvatarLabel =
            profileImage.imageId || fileUploadInProgress ? (
              <div className={css.avatarContainer}>
                {imageFromFile}
                {avatarComponent}
                <div className={css.changeAvatar}>
                  <FormattedMessage id="ProfileSettingsForm.changeAvatar" />
                </div>
              </div>
            ) : (
                <div className={css.avatarPlaceholder}>
                  <div className={css.avatarPlaceholderText}>
                    <FormattedMessage id="ProfileSettingsForm.addYourProfilePicture" />
                  </div>
                  <div className={css.avatarPlaceholderTextMobile}>
                    <FormattedMessage id="ProfileSettingsForm.addYourProfilePictureMobile" />
                  </div>
                </div>
              );

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
                  <FormattedMessage id="ProfileSettingsForm.yourProfilePicture" />
                </h3>
                <Field
                  accept={ACCEPT_IMAGES}
                  id="profileImage"
                  name="profileImage"
                  label={chooseAvatarLabel}
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
                      form.change(`profileImage`, file);
                      form.blur(`profileImage`);
                      if (file != null) {
                        const tempId = `${file.name}_${Date.now()}`;
                        onImageUpload({ id: tempId, file });
                      }
                    };

                    let error = null;

                    if (isUploadImageOverLimitError(uploadImageError)) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailedFileTooLarge" />
                        </div>
                      );
                    } else if (uploadImageError) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailed" />
                        </div>
                      );
                    }

                    return (
                      <div className={css.uploadAvatarWrapper}>
                        <label className={css.label} htmlFor={id}>
                          {label}
                        </label>
                        <input
                          accept={accept}
                          id={id}
                          name={name}
                          className={css.uploadAvatarInput}
                          disabled={disabled}
                          onChange={onChange}
                          type={type}
                        />
                        {error}
                      </div>
                    );
                  }}
                </Field>
                <div className={css.tip}>
                  {accountType === "p" || accountType === "a" || accountType === "n" ?
                    <FormattedMessage id="ProfileSettingsForm.tipLogo" />
                    : <FormattedMessage id="ProfileSettingsForm.tip" />}
                </div>
                <div className={css.fileInfo}>
                  <FormattedMessage id="ProfileSettingsForm.fileInfo" />
                </div>
              </div>
              {showCompanyInfo &&
                <div className={css.sectionContainer}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.companyInfo" />
                  </h3>
                  <div className={css.companyContainer}>
                    <p className={css.websiteTitle}>
                      <FormattedMessage id="ProfileSettingsForm.yourHomepage" />
                    </p>
                    <p className={css.websiteValue}>
                      {companyWebsite ? companyWebsite :
                        <FormattedMessage id="ProfileSettingsForm.noHomepage" />}
                    </p>
                    <p className={css.websiteSubtitle}>
                      <FormattedMessage id="ProfileSettingsForm.changeSettings" values={{ emailLink }} />
                    </p>
                    <FieldTextInput
                      className={css.companyField}
                      type="text"
                      id="companyName"
                      name="companyName"
                      label={companyNameLabel}
                      placeholder={companyNamePlaceholder}
                      maxLength={30}
                    />
                    <FieldSelect
                      className={css.companyField}
                      name="companyIndustry"
                      id="companyIndustry"
                      label={companyIndustryLabel}
                    >
                      {<option disabled value="">
                        {companyIndustryPlaceholder}
                      </option>}
                      {industryOptions.map(i => (
                        <option key={i.key} value={i.key}>
                          {i.label}
                        </option>
                      ))}
                    </FieldSelect>
                    <CompanyAddressMaybe
                      className={css.companyAddress}
                      initialValue={this.props.initialValues.location}
                    />
                  </div>
                </div>}
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  {accountType === "p" || accountType === "a" || accountType === "n" ?
                    <FormattedMessage id="ProfileSettingsForm.yourRepresentative" />
                    : <FormattedMessage id="ProfileSettingsForm.yourName" />}
                </h3>
                <div className={css.nameContainer}>
                  <FieldTextInput
                    className={css.firstName}
                    type="text"
                    id="firstName"
                    name="firstName"
                    label={firstNameLabel}
                    placeholder={firstNamePlaceholder}
                    validate={firstNameRequired}
                    maxLength={30}
                  />
                  <FieldTextInput
                    className={css.lastName}
                    type="text"
                    id="lastName"
                    name="lastName"
                    label={lastNameLabel}
                    placeholder={lastNamePlaceholder}
                    validate={lastNameRequired}
                    maxLength={30}
                  />
                </div>
              </div>
              <div className={classNames(css.sectionContainer)}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.bioHeading" />
                </h3>
                <FieldTextInput
                  type="textarea"
                  id="bio"
                  name="bio"
                  label={bioLabel}
                  placeholder={bioPlaceholder}
                  maxLength={450}
                />
                <p className={css.bioInfo}>
                  {accountType === "p" || accountType === "a" || accountType === "n" ?
                    null : <FormattedMessage id="ProfileSettingsForm.bioInfo" />}
                </p>
              </div>
              {accountType === 'e' ?
                <div className={css.sectionContainer}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.enrolledLocation" />
                  </h3>
                  <CompanyAddressMaybe
                    className={css.companyAddress}
                    initialValue={this.props.initialValues.location}
                    accountType={accountType}
                  />
                </div> : null}
              {showSocialMediaFields &&
                <div className={css.sectionContainer}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.socialMedia" />
                  </h3>
                  <div className={css.socialMediaContainer}>
                    <div className={css.socialMediaField}>
                      <IconSocialMediaFacebook />
                      <FieldTextInput
                        className={css.socialMediaInput}
                        type="text"
                        id="facebook"
                        name="facebook"
                        label={facebookLabel}
                        placeholder={facebookPlaceholder}
                        validate={validSocialMediaURL(facebookMessage, "www.facebook.com")}
                      />
                    </div>
                    <div className={css.socialMediaField}>
                      <IconSocialMediaTwitter />
                      <FieldTextInput
                        className={css.socialMediaInput}
                        type="text"
                        id="twitter"
                        name="twitter"
                        label={twitterLabel}
                        placeholder={twitterPlaceholder}
                        validate={validSocialMediaURL(twitterMessage, "www.twitter.com")}
                      />
                    </div>
                    <div className={css.socialMediaField}>
                      <IconSocialMediaInstagram />
                      <FieldTextInput
                        className={css.socialMediaInput}
                        type="text"
                        id="insta"
                        name="insta"
                        label={instaLabel}
                        placeholder={instaPlaceholder}
                        validate={validSocialMediaURL(instaMessage, "www.instagram.com")}
                      />
                    </div>
                    <div className={css.socialMediaField}>
                      <IconSocialMediaTikTok />
                      <FieldTextInput
                        className={css.socialMediaInput}
                        type="text"
                        id="tiktok"
                        name="tiktok"
                        label={tikTokLabel}
                        placeholder={tikTokPlaceholder}
                        validate={validSocialMediaURL(tikTokMessage, "www.tiktok.com")}
                      />
                    </div>
                  </div>
                </div>
              }
              {showTribeSelection &&
                <div className={classNames(css.sectionContainer, css.lastSection)}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.tribeHeading" />
                  </h3>
                  <FieldTextInput
                    type="textarea"
                    id="tribe"
                    name="tribe"
                    label={tribeLabel}
                    placeholder={tribePlaceholder}
                    maxLength={60}
                  />
                  <p className={css.bioInfo}>
                    <FormattedMessage id="ProfileSettingsForm.tribeInfo" />
                  </p>
                  <TribeSelectFieldMaybe
                    id="nativeLands"
                    name="nativeLands"
                    intl={intl}
                  />
                </div>
              }
              {submitError}
              <Button
                className={css.submitButton}
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

ProfileSettingsFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
  accountType: null
};

ProfileSettingsFormComponent.propTypes = {
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

const ProfileSettingsForm = compose(injectIntl)(ProfileSettingsFormComponent);

ProfileSettingsForm.displayName = 'ProfileSettingsForm';

export default ProfileSettingsForm;
