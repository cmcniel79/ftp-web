import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { UserCard, Modal } from '../../components';
import { EnquiryForm } from '../../forms';

import css from './ListingPage.module.css';

const SectionSellerMaybe = props => {
  const {
    title,
    listing,
    authorDisplayName,
    onContactUser,
    isEnquiryModalOpen,
    onCloseEnquiryModal,
    sendEnquiryError,
    sendEnquiryInProgress,
    onSubmitEnquiry,
    currentUser,
    onManageDisableScrolling,
    isPremium,
    isFollowed,
    updateFollowed
  } = props;

  if (!listing.author) {
    return null;
  }

  const sellerHeading = isPremium ?
    <h2 className={css.premiumSellerHeading}>
      <FormattedMessage id="ListingPage.premiumPartnerHeading" />
    </h2>
    :
    <h2 className={css.featuresHeading}>
      <FormattedMessage id="ListingPage.yourSellerHeading" />
    </h2>;

  return (
    <div id="seller" className={css.sectionSeller}>
      {sellerHeading}
      <UserCard 
      user={listing.author} 
      currentUser={currentUser}
      onContactUser={onContactUser}
      isFollowed={isFollowed} 
      updateFollowed={updateFollowed}
      isFollowingPage={false}
      />
      {!isPremium &&
        <Modal
          id="ListingPage.enquiry"
          contentClassName={css.enquiryModalContent}
          isOpen={isEnquiryModalOpen}
          onClose={onCloseEnquiryModal}
          usePortal
          onManageDisableScrolling={onManageDisableScrolling}
        >
          <EnquiryForm
            className={css.enquiryForm}
            submitButtonWrapperClassName={css.enquirySubmitButtonWrapper}
            listingTitle={title}
            authorDisplayName={authorDisplayName}
            sendEnquiryError={sendEnquiryError}
            onSubmit={onSubmitEnquiry}
            inProgress={sendEnquiryInProgress}
          />
        </Modal>
      }
    </div>
  );
};

export default SectionSellerMaybe;
