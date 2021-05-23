import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingDescriptionForm } from '../../forms';
import config from '../../config';

import css from './EditListingDescriptionPanel.module.css';

const EditListingDescriptionPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    accountType,
    allowsCustomOrders,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
      <FormattedMessage id="EditListingDescriptionPanel.createListingTitle" />
    );

  const category = publicData && publicData.category;
  const subCategory = publicData && publicData.subCategory;
  const style = publicData && publicData.style;
  const region = publicData && publicData.region;
  const material = publicData && publicData.material;
  const customOrders = publicData && publicData.customOrders === 'available' ? true :
    publicData.customOrders === 'unavailable' ? false : null;
  const sizes = publicData && publicData.sizes;
  const websiteLink = publicData && publicData.websiteLink;
  const verifiedSellers = accountType && (accountType === 'e' || accountType === 'p' || accountType === 'n')
    ? 'verified' : 'unverified';
  const barter = publicData && publicData.barter;
  const allowsBarter = publicData && publicData.allowsBarter ? ["hasBarter"] : null;

  const categoryOptions = findOptionsForSelectFilter('category', config.custom.filters);
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDescriptionForm
        className={css.form}
        initialValues={{ title, description, category, subCategory, style, region, material, customOrders, sizes, websiteLink, barter, allowsBarter }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { 
            title, 
            description, 
            category, 
            subCategory, 
            style, 
            region, 
            material, 
            customOrders, 
            sizes, 
            websiteLink, 
            barter, 
            allowsBarter 
          } = values;
          const customIsAvailable = customOrders ? 'available' : 'unavailable';
          const updateValues = {
            title: title.trim(),
            description,
            publicData: {
              category, 
              subCategory, 
              style, 
              region, 
              material, 
              customOrders: customIsAvailable, 
              sizes, 
              websiteLink, 
              verifiedSellers, 
              barter, 
              allowsBarter: allowsBarter && allowsBarter[0] === "hasBarter"
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={categoryOptions}
        accountType={accountType}
        allowsCustomOrders={allowsCustomOrders}
      />
    </div>
  );
};

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingDescriptionPanel;
