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
  ExternalLink,
} from '../../components';
import { ProfileSettingsForm } from '../../forms';
import { TopbarContainer } from '../../containers';

import { updateProfile, uploadImage, updateDatabase } from './ProfileSettingsPage.duck';
import css from './ProfileSettingsPage.module.css';

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

    const isEventHost = currentUser && currentUser.attributes.profile.metadata && currentUser.attributes.profile.metadata.eventHost;

    function checkAddress(location) {
      return location && location.selectedPlace && location.selectedPlace.origin &&
        location.selectedPlace.origin.lat && location.selectedPlace.origin.lng ? true : false;
    }

    const handleSubmit = (values) => {
      const { firstName, lastName, bio: rawBio, tribe, nativeLands, companyName, companyIndustry,
        location, building, facebook, twitter, insta, tiktok } = values;
      // Ensure that the optional bio is a string
      const bio = rawBio || '';
      const profile = companyName || location || companyIndustry ? {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio,
        publicData: {
          tribe: tribe,
          nativeLands: nativeLands,
          companyName: companyName,
          companyIndustry: companyIndustry,
          companyLocation: { location: location, building: building },
          socialMedia: { facebook: facebook, twitter: twitter, insta: insta, tiktok: tiktok }
        }
      } : {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          bio,
          publicData: {
            tribe: tribe,
            nativeLands: nativeLands,
            socialMedia: { facebook: facebook, twitter: twitter, insta: insta, tiktok: tiktok }
          },
        };
      const uploadedImage = this.props.image;

      // Update profileImage only if file system has been accessed
      const updatedValues =
        uploadedImage && uploadedImage.imageId && uploadedImage.file
          ? { ...profile, profileImageId: uploadedImage.imageId }
          : profile;
      onUpdateProfile(updatedValues);

      const accountValue = user && user.attributes.profile.publicData ? user.attributes.profile.publicData.accountType : null;
      if (accountValue === 'p' || accountValue === 'a' || accountValue === 'n' || accountValue === 'e') {
        const uuid = user && user.id ? user.id.uuid : null;
        const requestBody = {
          ownerName: firstName + " " + lastName,
          companyName: companyName ? companyName : null,
          uuid: uuid,
          hasAddress: checkAddress(location)
        };
        updateDatabase(requestBody);
      }
    };

    const user = ensureCurrentUser(currentUser);
    const { firstName, lastName, bio } = user.attributes.profile;
    const profileImageId = user.profileImage ? user.profileImage.id : null;
    const profileImage = image || { imageId: profileImageId };

    const tribe = user.attributes.profile.publicData ? user.attributes.profile.publicData.tribe : null;
    const nativeLands = user.attributes.profile.publicData ? user.attributes.profile.publicData.nativeLands : null;
    const accountType = user.attributes.profile.publicData ? user.attributes.profile.publicData.accountType : null;
    const companyName = user.attributes.profile.publicData ? user.attributes.profile.publicData.companyName : null;
    const companyWebsite = user.attributes.profile.publicData ? user.attributes.profile.publicData.companyWebsite : null;
    const companyIndustry = user.attributes.profile.publicData ? user.attributes.profile.publicData.companyIndustry : null;
    const location = user.attributes.profile.publicData && user.attributes.profile.publicData.companyLocation
      ? user.attributes.profile.publicData.companyLocation.location : null;
    const building = user.attributes.profile.publicData && user.attributes.profile.publicData.companyLocation &&
      user.attributes.profile.publicData.companyLocation.building ? user.attributes.profile.publicData.companyLocation.building : null;
    const socialMedia = user.attributes.profile.publicData ? user.attributes.profile.publicData.socialMedia : null;
    const facebook = socialMedia && socialMedia.facebook ? socialMedia.facebook : null;
    const twitter = socialMedia && socialMedia.twitter ? socialMedia.twitter : null;
    const insta = socialMedia && socialMedia.insta ? socialMedia.insta : null;
    const tiktok = socialMedia && socialMedia.tiktok ? socialMedia.tiktok : null;
    const faqLink =
      <NamedLink name="FAQPage">
        <FormattedMessage id="ProfileSettingsPage.faqLink" />
      </NamedLink>;
    let verification;
    let listingsLimit;
    let profileHeading;
    switch (accountType) {
      default:
        profileHeading = "Standard";
        listingsLimit = 0;
        verification = <FormattedMessage id="ProfileSettingsPage.unverifiedAccount" />;
        break;
      case "u":
        profileHeading = "Standard";
        listingsLimit = 5;
        verification = <FormattedMessage id="ProfileSettingsPage.unverifiedAccount" />;
        break;
      case "e":
        profileHeading = "Standard";
        listingsLimit = 30;
        verification = <FormattedMessage id="ProfileSettingsPage.verifiedAccount" />;
        break;
      case "p":
        profileHeading = "Premium";
        listingsLimit = 0;
        verification = null;
        break;
      case "a":
        profileHeading = "Ad"
        listingsLimit = 1;
        verification = null;
        break;
      case "n":
        profileHeading = "Nonprofit";
        listingsLimit = 1;
        verification = null;
        break;
    }

    const profileSettingsForm = user.id ? (
      <ProfileSettingsForm
        className={css.form}
        accountType={accountType}
        companyWebsite={companyWebsite}
        currentUser={currentUser}
        initialValues={{
          firstName, lastName, bio, profileImage: user.profileImage, tribe, nativeLands,
          companyName, companyIndustry, location, building, facebook, twitter, insta, tiktok
        }}
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

    const accountLimit = currentUser && currentUser.attributes.profile.publicData.accountLimit ?
      currentUser.attributes.profile.publicData.accountLimit : null;

    listingsLimit = accountLimit ? accountLimit : listingsLimit;

    const premiumPlan =
      accountType === 'p' && accountLimit > 7 ? "Trader Plan" :
        accountType === 'p' && accountLimit > 0 ? "Artist Plan" :
          accountType === 'p' ? "Map Only Plan" : null

    return (
      <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="ProfileSettingsPage" />
            <UserNav selectedPageName="ProfileSettingsPage" isEventHost={isEventHost}/>
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div className={css.content}>
              <div className={css.headingContainer}>
                <h1 className={css.heading}>
                  <FormattedMessage id="ProfileSettingsPage.heading" />
                </h1>
                {user.id &&
                  <NamedLink
                    className={css.profileLink}
                    name="ProfilePage"
                    params={{ id: user.id.uuid }}
                  >
                    <FormattedMessage id="ProfileSettingsPage.viewProfileLink" />
                  </NamedLink>
                }
              </div>
              {user.id &&
                <div className={css.profileInfo}>
                  <h3>
                    <FormattedMessage id="ProfileSettingsPage.profileType" />
                  </h3>
                  <div className={css.infoLine}>
                    <h3 className={css.lineTitle}>
                      <FormattedMessage id="ProfileSettingsPage.profileLine" />
                    </h3>
                    <FormattedMessage id="ProfileSettingsPage.profileHeading" values={{ profileHeading }} />
                  </div>
                  {premiumPlan &&
                    <div className={css.infoLine}>
                      <h3 className={css.lineTitle}>
                        <FormattedMessage id="ProfileSettingsPage.planLine" />
                      </h3>
                      {premiumPlan}
                    </div>
                  }
                  {verification &&
                    <div className={css.infoLine}>
                      <h3 className={css.lineTitle}>
                        <FormattedMessage id="ProfileSettingsPage.verificationLine" />
                      </h3>
                      {verification}
                    </div>
                  }
                  <div className={css.infoLine}>
                    <h3 className={css.lineTitle}>
                      <FormattedMessage id="ProfileSettingsPage.listingsLine" />
                    </h3>
                    <FormattedMessage id="ProfileSettingsPage.listingsLimit" values={{ listingsLimit }} />
                  </div>
                  {accountType === 'p' || accountType === 'a' ?
                    <p>
                      <FormattedMessage id="ProfileSettingsPage.chargebeeText" />
                      <ExternalLink href="https://fromthepeople.chargebeeportal.com/portal/v2/login?forward=portal_main">
                        <FormattedMessage id="ProfileSettingsPage.chargebeeLink" />
                      </ExternalLink>
                    </p>
                    :
                    <p className={css.faqLink}>
                      <FormattedMessage id="ProfileSettingsPage.faqInfoLink" values={{ faqLink }} />
                    </p>
                  }
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
  onUpdateDatabase: func.isRequired,

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
  onUpdateDatabase: data => dispatch(updateDatabase(data)),
});

const ProfileSettingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ProfileSettingsPageComponent);

export default ProfileSettingsPage;
