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
import { Button, Form, FieldCurrencyInput } from '../../components';
import css from './EditListingPricingForm.css';

const { Money } = sdkTypes;

var hasInternationalFee = false;

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
        userCountry
      } = formRenderProps;

      const shippingFeeMessage = intl.formatMessage({
        id: 'EditListingPricingForm.shippingFeeInputMessage',
      });

      const shippingFeePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.shippingFeeInputPlaceholder',
      });

      const internationalFeeMessage = intl.formatMessage({
        id: 'EditListingPricingForm.internationalFeeInputMessage',
      });

      const internationalFeePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.internationalFeeInputPlaceholder',
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

      const internationalInput = document.getElementById('internationalFee');
      if (internationalInput) {
        internationalInput.addEventListener('input', () => {
          hasInternationalFee = true;
        })
      }

      const internationalInstructions = hasInternationalFee ?
        <div className={css.instructions}>
          <p className={css.instructionsText}>The international fee will be used automatically if a buyer is from a
          different country from you. Currrently, your country of origin is listed as {userCountry}.
            <br />
            <br />
             If this is the wrong country, you should go to your account settings and change your address before posting
             this item.
          </p>
        </div>
        : null;

      const specialAccountInfo = (accountType === "n" || accountType === "a") ?
        <div className={css.accountInfo}>
          <p>You have either a Ad or Non-profit account and do not need to enter pricing information. Press the button below to
          continue.
        </p>
        </div> : null;

console.log(accountType);
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
                  autoFocus
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
                      placeholder={shippingFeePlaceholderMessage}
                      currencyConfig={config.currencyConfig}
                    />
                    <FieldCurrencyInput
                      id="internationalFee"
                      name="internationalFee"
                      className={css.priceInput}
                      label={internationalFeeMessage}
                      placeholder={internationalFeePlaceholderMessage}
                      currencyConfig={config.currencyConfig}
                    />
                  </div>
                : null}
              </div>
            }
            {specialAccountInfo}
            {internationalInstructions}
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
