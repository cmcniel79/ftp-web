import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  Page,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
} from '../../components';
import { ProfileSettingsForm } from '../../forms';
import { TopbarContainer } from '../../containers';

import { updateProfile, uploadImage } from './ProfileSettingsPage.duck';
import css from './ProfileSettingsPage.css';

const onImageUploadHandler = (values, fn) => {
  const { id, imageId, file } = values;
  if (file) {
    fn({ id, imageId, file });
  }
};

export class ProfileSettingsPageComponent extends Component {
  render() {
    const {
      currentUser,
      image,
      onImageUpload,
      onUpdateProfile,
      scrollingDisabled,
      updateInProgress,
      updateProfileError,
      uploadImageError,
      uploadInProgress,
      intl,
    } = this.props;

    const handleSubmit = values => {
      const { firstName, lastName, bio: rawBio, tribe, nativeLands, companyName, companyWebsite,
        facebook, twitter, insta } = values;

      // Ensure that the optional bio is a string
      const bio = rawBio || '';

      const profile = companyName && companyWebsite ? {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio,
        publicData: {
          tribe: tribe,
          nativeLands: nativeLands,
          companyName: companyName,
          companyWebsite: companyWebsite,
          socialMedia: { facebook: facebook, twitter: twitter, insta: insta }
        }
      } : {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          bio,
          publicData: {
            tribe: tribe,
            nativeLands: nativeLands,
            socialMedia: { facebook: facebook, twitter: twitter, insta: insta }
          },
        };
      const uploadedImage = this.props.image;

      // Update profileImage only if file system has been accessed
      const updatedValues =
        uploadedImage && uploadedImage.imageId && uploadedImage.file
          ? { ...profile, profileImageId: uploadedImage.imageId }
          : profile;
      onUpdateProfile(updatedValues);
    };

    const user = ensureCurrentUser(currentUser);
    const { firstName, lastName, bio } = user.attributes.profile;
    const profileImageId = user.profileImage ? user.profileImage.id : null;
    const profileImage = image || { imageId: profileImageId };
    const tribe = user.attributes.profile.publicData ? user.attributes.profile.publicData.tribe : null;
    const accountType = user.attributes.profile.publicData ? user.attributes.profile.publicData.account : null;
    const companyName = user.attributes.profile.publicData ? user.attributes.profile.publicData.companyName : null;
    const companyWebsite = user.attributes.profile.publicData ? user.attributes.profile.publicData.companyName : null;
    const socialMedia = user.attributes.profile.publicData ? user.attributes.profile.publicData.socialMedia : null;
    const facebook = socialMedia && socialMedia.facebook ? socialMedia.facebook : null;
    const twitter = socialMedia && socialMedia.twitter ? socialMedia.twitter : null;
    const insta = socialMedia && socialMedia.insta ? socialMedia.insta : null; 

    const faqLink = <NamedLink
      name="FAQPage"
    > FAQ Page
    </NamedLink>;

    let accountHeading;
    switch (accountType) {
      case null:
        accountHeading = null;
        break;
      case "":
        accountHeading =
          <FormattedMessage id="ProfileSettingsPage.accountHeadingStandard" />;
        break;
      case "e":
        accountHeading =
          <FormattedMessage id="ProfileSettingsPage.accountHeadingEnrolled" />;
        break;
      case "p":
        accountHeading =
          <FormattedMessage id="ProfileSettingsPage.accountHeadingPremium" />;
        break;
      case "a":
        accountHeading =
          <FormattedMessage id="ProfileSettingsPage.accountHeadingAd" />;
        break;
      case "n":
        accountHeading =
          <FormattedMessage id="ProfileSettingsPage.accountHeadingNonProfit" />;
        break;
    }

    const profileSettingsForm = user.id ? (
      <ProfileSettingsForm
        className={css.form}
        accountType={accountType}
        currentUser={currentUser}
        initialValues={{ firstName, lastName, bio, profileImage: user.profileImage, tribe, companyName, companyWebsite,
          facebook, twitter, insta }}
        profileImage={profileImage}
        onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
        uploadInProgress={uploadInProgress}
        updateInProgress={updateInProgress}
        uploadImageError={uploadImageError}
        updateProfileError={updateProfileError}
        onSubmit={handleSubmit}
      />
    ) : null;

    const title = intl.formatMessage({ id: 'ProfileSettingsPage.title' });

    return (
      <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="ProfileSettingsPage" />
            <UserNav selectedPageName="ProfileSettingsPage" />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div className={css.content}>
              <div className={css.headingContainer}>
                <h1 className={css.heading}>
                  <FormattedMessage id="ProfileSettingsPage.heading" />
                </h1>
                {user.id ? (
                  <NamedLink
                    className={css.profileLink}
                    name="ProfilePage"
                    params={{ id: user.id.uuid }}
                  >
                    <FormattedMessage id="ProfileSettingsPage.viewProfileLink" />
                  </NamedLink>
                ) : null}
              </div>
              {accountHeading &&
                <div className={css.accountInfo}>
                  <h3 className={css.sectionTitle}>
                    Account Type
                  </h3>
                  <h3>
                    {accountHeading}
                  </h3>
                  <p className={css.faqLink}>
                    <FormattedMessage id="ProfileSettingsPage.faqInfoLink" values={{ faqLink }} />
                  </p>
                </div>
              }
              {profileSettingsForm}
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

ProfileSettingsPageComponent.defaultProps = {
  currentUser: null,
  uploadImageError: null,
  updateProfileError: null,
  image: null,
};

const { bool, func, object, shape, string } = PropTypes;

ProfileSettingsPageComponent.propTypes = {
  currentUser: propTypes.currentUser,
  image: shape({
    id: string,
    imageId: propTypes.uuid,
    file: object,
    uploadedImage: propTypes.image,
  }),
  onImageUpload: func.isRequired,
  onUpdateProfile: func.isRequired,
  scrollingDisabled: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    image,
    uploadImageError,
    uploadInProgress,
    updateInProgress,
    updateProfileError,
  } = state.ProfileSettingsPage;
  return {
    currentUser,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
  };
};

const mapDispatchToProps = dispatch => ({
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateProfile: data => dispatch(updateProfile(data)),
});

const ProfileSettingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ProfileSettingsPageComponent);

export default ProfileSettingsPage;
