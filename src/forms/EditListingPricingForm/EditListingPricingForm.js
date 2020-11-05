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
import { Button, Form, FieldCurrencyInput, FieldCheckbox } from '../../components';
import css from './EditListingPricingForm.css';

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
        // initialValues
      } = formRenderProps;

      const shippingFeeMessage = intl.formatMessage({
        id: 'EditListingPricingForm.shippingFeeInputMessage',
      });

      const shippingFeePlaceholder = intl.formatMessage({
        id: 'EditListingPricingForm.shippingFeeInputPlaceholder',
      });

      const internationalFeeMessage = intl.formatMessage({
        id: 'EditListingPricingForm.internationalFeeInputMessage',
      });

      const internationalFeePlaceholder = intl.formatMessage({
        id: 'EditListingPricingForm.internationalFeeInputPlaceholder',
      });

      const internationalCheckboxMessage = intl.formatMessage({
        id: 'EditListingPricingForm.internationalCheckboxMessage',
      });

      const pricePerUnitMessage = intl.formatMessage({
        id: 'EditListingPricingForm.pricePerUnit',
      });

      const pricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.priceInputPlaceholder',
      });

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
      let showInternational; 

      const checkbox = document.getElementById('allowsInternationalOrders');

      if (checkbox) {
        if (checkbox.checked) {
          showInternational = true;
        } else {
          showInternational = false;
        }
      };
      // For ad and non-profit account types, no price is needed on their listing cards.
      const noPriceNeededInfo = (accountType === "n" || accountType === "a") ?
        <div className={css.accountInfo}>
          <p>
            <FormattedMessage id="EditListingPricingForm.specialAccountInfo" />
          </p>
        </div> : null;

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
                <FieldCurrencyInput
                  id="price"
                  name="price"
                  className={css.priceInput}
                  // autoFocus
                  label={pricePerUnitMessage}
                  placeholder={pricePlaceholderMessage}
                  currencyConfig={config.currencyConfig}
                  validate={priceValidators}
                />
                {accountType !== "p" ?
                  <div className={css.shippingFees}>
                    <FieldCurrencyInput
                      id="shippingFee"
                      name="shippingFee"
                      className={css.priceInput}
                      label={shippingFeeMessage}
                      placeholder={shippingFeePlaceholder}
                      currencyConfig={config.currencyConfig}
                    />
                    <div className={css.internationalFee}>
                      <FieldCheckbox
                        id="allowsInternationalOrders"
                        name="allowsInternationalOrders"
                        label={internationalCheckboxMessage}
                        value="hasFee"
                      />
                      {showInternational &&
                      <div>
                        <FieldCurrencyInput
                          id="internationalFee"
                          name="internationalFee"
                          className={css.priceInput}
                          label={internationalFeeMessage}
                          placeholder={internationalFeePlaceholder}
                          currencyConfig={config.currencyConfig}
                        />
                        <div className={css.instructions}>
                        <p className={css.instructionsText}>
                          <FormattedMessage id="EditListingPricingForm.instructionsLine1" values={{ userCountry }} />
                          <br />
                          <br />
                          <FormattedMessage id="EditListingPricingForm.instructionsLine2" />
                        </p>
                      </div>
                      </div>
                      }
                    </div>
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
