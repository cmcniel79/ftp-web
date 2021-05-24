import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput, FieldCheckbox, FieldSelect } from '../../components';
import css from './EditListingPricingForm.module.css';

const { Money } = sdkTypes;

export const EditListingPricingFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        accountType,
        userCountry,
      } = formRenderProps;

      // Domestic Shipping Fee Stuff
      const shippingFeeMessage = intl.formatMessage({ id: 'EditListingPricingForm.shippingFeeInputMessage' });
      const shippingFeePlaceholder = intl.formatMessage({ id: 'EditListingPricingForm.shippingFeeInputPlaceholder' });

      // International Shipping Fee Stuff
      const internationalCheckbox = document.getElementById('allowsInternationalOrders');
      const internationalFeeMessage = intl.formatMessage({ id: 'EditListingPricingForm.internationalFeeInputMessage' });
      const internationalFeePlaceholder = intl.formatMessage({ id: 'EditListingPricingForm.internationalFeeInputPlaceholder' });
      const internationalCheckboxMessage = intl.formatMessage({ id: 'EditListingPricingForm.internationalCheckboxMessage' });

      // Quantity Optional Field Stuff
      const quantityLabel = intl.formatMessage({ id: 'EditListingPricingForm.quantityLabel' });
      const quantityRequiredMessage = intl.formatMessage({ id: 'EditListingPricingForm.quantityRequiredMessage' });
      const quantityRequired = validators.required(quantityRequiredMessage);

      var quantityArray = [];
      // Max quantity selection is 100
      for (var i = 1; i <= 100; i++) {
        quantityArray.push(i);
      }

      // Price Stuff
      const pricePerUnitMessage = intl.formatMessage({ id: 'EditListingPricingForm.pricePerUnit' });
      const pricePlaceholderMessage = intl.formatMessage({ id: 'EditListingPricingForm.priceInputPlaceholder' });
      const priceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.priceRequired',
        })
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );
      const priceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(priceRequired, minPriceRequired)
        : priceRequired;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      // For ad and non-profit account types, no price is needed on their listing cards.
      const noPriceNeededInfo = (accountType === "n" || accountType === "a") ?
        <div className={css.accountInfo}>
          <p>
            <FormattedMessage id="EditListingPricingForm.specialAccountInfo" />
          </p>
        </div> : null;

      const showInternationalSection = internationalCheckbox && internationalCheckbox.checked;
      const internationalSection = (
        <div className={css.internationalFeeSection}>
          <FieldCheckbox
            id="allowsInternationalOrders"
            name="allowsInternationalOrders"
            label={internationalCheckboxMessage}
            value="hasFee"
          />
          <div className={showInternationalSection ? css.instructionsShown : css.instructionsHidden}>
            <FieldCurrencyInput
              id="internationalFee"
              name="internationalFee"
              className={css.internationalFeeField}
              label={internationalFeeMessage}
              placeholder={internationalFeePlaceholder}
              currencyConfig={config.currencyConfig}
            />
            <p className={css.instructionsText}>
              <FormattedMessage id="EditListingPricingForm.instructionsLine1" values={{ userCountry }} />
              <br />
              <br />
              <FormattedMessage id="EditListingPricingForm.instructionsLine2" />
            </p>
          </div>
        </div>
      );

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.showListingFailed" />
            </p>
          ) : null}

          <div className={css.columns}>
            {accountType !== "n" && accountType !== "a" &&
              <div className={css.priceInputs}>
                <h2 className={css.sectionHeader}>
                  {accountType === "p" ? (
                    <FormattedMessage id="EditListingPricingForm.priceHeader" />
                  ) : (
                    <FormattedMessage id="EditListingPricingForm.priceAndQuantityHeader" />
                  )}
                </h2>
                <div className={css.priceAndQuantityFieldContainer}>
                  <FieldCurrencyInput
                    id="price"
                    name="price"
                    className={css.priceField}
                    label={pricePerUnitMessage}
                    placeholder={pricePlaceholderMessage}
                    currencyConfig={config.currencyConfig}
                    validate={priceValidators}
                  />
                  {accountType !== "p" ? (
                    // Premium Accounts do not need to set a quantity
                    <FieldSelect
                      id="maxQuantity"
                      name="maxQuantity"
                      className={css.quantityField}
                      label={quantityLabel}
                      validate={quantityRequired}
                    >
                      {quantityArray.map(x => {
                        return (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        );
                      })}
                    </FieldSelect>
                  ) : null}
                </div>
                {accountType !== "p" ?
                  // Premium Accounts do not need to set shipping fees
                  <div className={css.shippingFees}>
                    <h2 className={css.sectionHeader}>
                      <FormattedMessage id="EditListingPricingForm.shippingHeader" />
                    </h2>
                    <FieldCurrencyInput
                      id="shippingFee"
                      name="shippingFee"
                      className={css.priceInput}
                      label={shippingFeeMessage}
                      placeholder={shippingFeePlaceholder}
                      currencyConfig={config.currencyConfig}
                    />
                    {internationalSection}
                  </div>
                  : null}
              </div>
            }
            {noPriceNeededInfo}
          </div>
          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingPricingFormComponent.defaultProps = { fetchErrors: null };

EditListingPricingFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
