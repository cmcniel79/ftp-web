import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingPricingForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';

import css from './EditListingPricingPanel.css';

const { Money } = sdkTypes;

const EditListingPricingPanel = props => {
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
    userCountry,
    accountType
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);

  const { price, publicData } = currentListing.attributes;

  const shippingFee =
    publicData && publicData.shippingFee ? 
      new Money(publicData.shippingFee.amount, publicData.shippingFee.currency) : null;
  
  const internationalFee =
    publicData && publicData.internationalFee ? 
      new Money(publicData.internationalFee.amount, publicData.internationalFee.currency) : null;

  const internationalFeeCheckbox = internationalFee ? "checked" : null;

  const initialValues = { price, shippingFee, internationalFee, internationalFeeCheckbox };

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingPricingPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
      <FormattedMessage id="EditListingPricingPanel.createListingTitle" />
    );

  const priceCurrencyValid = price instanceof Money ? price.currency === config.currency : true;
  const form = priceCurrencyValid ? (
    <EditListingPricingForm
      className={css.form}
      initialValues={initialValues}
      // Code for onSubmit function was taken from here: 
      // https://www.sharetribe.com/docs/tutorial-transaction-process/customize-pricing-tutorial/
      onSubmit={values => {
        const { price, shippingFee, internationalFee } = values;

        const publicData = shippingFee && internationalFee ? {
          shippingFee: { amount: shippingFee.amount, currency: shippingFee.currency },
          internationalFee: { amount: internationalFee.amount, currency: internationalFee.currency },
          country: userCountry,
        } : shippingFee ? {
          shippingFee: { amount: shippingFee.amount, currency: shippingFee.currency },
          internationalFee: { amount: 0, currency: config.currency },
          country: userCountry,
        } : internationalFee ? {
          shippingFee: { amount: 0, currency: config.currency },
          internationalFee: { amount: internationalFee.amount, currency: internationalFee.currency },
          country: userCountry,
        } : {
          shippingFee: { amount: 0, currency: config.currency },
          internationalFee: { amount: 0, currency: config.currency },
          country: userCountry,
        };

        const updatedValues = {
          price,
          publicData: publicData
        };

        onSubmit(updatedValues);
      }}
      onChange={onChange}
      saveActionMsg={submitButtonText}
      disabled={disabled}
      ready={ready}
      updated={panelUpdated}
      updateInProgress={updateInProgress}
      fetchErrors={errors}
      userCountry={userCountry}
      accountType={accountType}
    />
  ) : (
      <div className={css.priceCurrencyInvalid}>
        <FormattedMessage id="EditListingPricingPanel.listingPriceCurrencyInvalid" />
      </div>
    );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {form}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingPricingPanel.propTypes = {
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

export default EditListingPricingPanel;