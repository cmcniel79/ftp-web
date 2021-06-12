import React, { Component } from 'react';
import { string, bool, array, func } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import config from '../../config';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { required } from '../../util/validators';
import { propTypes } from '../../util/types';
import { Form, IconSpinner, PrimaryButton, FieldSelect } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';
import getCountryCodes from '../../translations/countryCodes';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';

import css from './PurchaseOptionsForm.module.css';

const Decimal = require('decimal.js');
const { Money } = sdkTypes;

const resolveShippingFeePrice = shippingFee => {
    const { amount, currency } = shippingFee;
    if ((amount && currency) || (amount === 0 && currency)) {
      return new Money(amount, currency);
    }
    return null;
  };
  

export class PurchaseOptionsFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { focusedInput: null };
        this._isMounted = false;
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.onFocusedInputChange = this.onFocusedInputChange.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount() { 
        this._isMounted = true;
      }
      
      componentWillUnmount() {
         this._isMounted = false;
      }

    // Function that can be passed to nested components
    // so that they can notify this component when the
    // focused input changes.
    onFocusedInputChange(focusedInput) {
        this.setState({ focusedInput });
    }

    // In case start or end date for the booking is missing
    // focus on that input, otherwise continue with the
    // default handleSubmit function.
    handleFormSubmit(e) {
        const allowsInternationalOrders = this.props && this.props.allowsInternationalOrders ? this.props.allowsInternationalOrders : false;
        const authorCountry = this.props && this.props.authorCountry ? this.props.authorCountry : null;

        const country = e && e.country ? e.country : null;
        const quantity = e && e.quantity ? e.quantity : 1;

        if (!country && !authorCountry) {
            e.preventDefault();
            this.setState({ focusedInput: "country" });
        } else if (!quantity) {
            e.preventDefault();
            this.setState({ focusedInput: "quantity" });
        } else {
            this.props.onSubmit({
                authorCountry,
                shippingCountry: allowsInternationalOrders ? country : authorCountry,
                quantity
            });
        }
    }

    // When the values of the form are updated we need to fetch
    // lineItems from FTW backend for the EstimatedTransactionMaybe
    // In case you add more fields to the form, make sure you add
    // the values here to the bookingData object.
    handleOnChange(formValues) {
        
        const allowsInternationalOrders = this.props && this.props.allowsInternationalOrders ? this.props.allowsInternationalOrders : false;
        const authorCountry = this.props && this.props.authorCountry ? this.props.authorCountry : null;
        const maxQuantity = this.props && this.props.maxQuantity ? this.props.maxQuantity : null;

        // Should not update the line items through onFetchTransactionLineItems if
        // listing does not allow international orders and if max transaction quantity is limited to 1
        // or if maxQuantity does not exist
        const shouldNotUpdateLineItems = !allowsInternationalOrders && (!maxQuantity || maxQuantity === 1);
        
        const country = formValues.values && formValues.values.country && allowsInternationalOrders ? formValues.values.country : 
            !allowsInternationalOrders && authorCountry ? authorCountry : null;
        const quantity = formValues.values && formValues.values.quantity ? formValues.values.quantity : null;
        
        const listingId = this.props.listingId;
        const isOwnListing = this.props.isOwnListing;

        if (this._isMounted && !shouldNotUpdateLineItems && country && quantity && !this.props.fetchLineItemsInProgress) {
            this.props.onFetchTransactionLineItems({
                bookingData: {
                    authorCountry,
                    shippingCountry: country,
                    quantity
                },
                listingId,
                isOwnListing,
            });
        }
    }

    render() {
        const { rootClassName, className, price: unitPrice, ...rest } = this.props;
        const classes = classNames(rootClassName || css.root, className);
        const countryCodes = getCountryCodes(config.locale);

        if (!unitPrice) {
            return (
                <div className={classes}>
                    <p className={css.error}>
                        <FormattedMessage id="PurchaseOptionsForm.listingPriceMissing" />
                    </p>
                </div>
            );
        }
        if (unitPrice.currency !== config.currency) {
            return (
                <div className={classes}>
                    <p className={css.error}>
                        <FormattedMessage id="PurchaseOptionsForm.listingCurrencyInvalid" />
                    </p>
                </div>
            );
        }

        return (
            <FinalForm
                {...rest}
                unitPrice={unitPrice}
                onSubmit={this.handleFormSubmit}
                render={fieldRenderProps => {
                    const {
                        formId,
                        handleSubmit,
                        intl,
                        isOwnListing,
                        submitButtonWrapperClassName,
                        unitType,
                        values,
                        lineItems,
                        fetchLineItemsInProgress,
                        fetchLineItemsError,
                        allowsInternationalOrders,
                        authorCountry,
                        maxQuantity,
                        shippingFee,
                    } = fieldRenderProps;

                    const country = values && values.country;
                    const quantity = values && values.quantity;

                    const countryPlaceholder = intl.formatMessage({ id: 'PurchaseOptionsForm.countryPlaceholder' });
                    const countryRequiredMessage = intl.formatMessage({ id: 'PurchaseOptionsForm.countryRequiredMessage' });
                    const countryRequired = required(countryRequiredMessage);

                    const quantityRequiredMessage = intl.formatMessage({ id: 'PurchaseOptionsForm.quantityRequiredMessage' });
                    const quantityRequired = required(quantityRequiredMessage);


                    var quantityArray = [];
                    const shouldShowQuantityField = maxQuantity && maxQuantity > 1;
                    if (shouldShowQuantityField) {
                        for (var i = 1; i <= maxQuantity; i++) {
                            quantityArray.push(i);
                        }
                    };

                    // The line items here are only used if the listing does not allow 
                    // international orders and if the listing does not allow more than 1 
                    // to be sold at a time. In that case, the buyer does not input any info
                    // into the form. The listing page crashes on reload if these constructed 
                    // line items are not used for this condition. onFetchLineItems is the culprit
                    // for crashing the listing page on reload.
                    const shippingLineItem = shippingFee ? {
                        code: 'line-item/shipping',
                        unitPrice: resolveShippingFeePrice(shippingFee),
                        quantity: new Decimal(1),
                        includeFor: ['customer', 'provider'],
                        lineTotal: resolveShippingFeePrice(shippingFee)
                    } : null;

                    const priceLineItem = unitPrice ? {
                        code: 'line-item/units',
                        unitPrice: unitPrice,
                        quantity: new Decimal(1),
                        includeFor: ['customer', 'provider'],
                        lineTotal: unitPrice
                    } : null;

                    const defaultLineItems = shippingLineItem && priceLineItem ? [shippingLineItem, priceLineItem] : null;

                    // Default line items are using the listing author's country for the shipping address and
                    // if the maxQuantity is missing or equals one. User input is needed for any other cases and 
                    // lineItems can be used - the line items taken from the API call.
                    const bookingLineItems = !allowsInternationalOrders && (!maxQuantity || maxQuantity === 1 || quantity === 1) ? 
                        defaultLineItems : lineItems;

                    // This is the place to collect breakdown estimation data.
                    // Note: lineItems are calculated and fetched from FTW backend
                    // so we need to pass only booking data that is needed otherwise
                    // If you have added new fields to the form that will affect to pricing,
                    // you need to add the values to handleOnChange function
                    const bookingData =
                        (country && quantity) || (!allowsInternationalOrders && authorCountry && quantity)
                            ? {
                                unitType,
                                authorCountry,
                                shippingCountry: country ? country : authorCountry,
                                quantity,
                            }
                            : null;

                    const showEstimatedBreakdown =
                        bookingData && bookingLineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

                    const bookingInfoMaybe = showEstimatedBreakdown ? (
                        <div className={css.priceBreakdownContainer}>
                            <EstimatedBreakdownMaybe bookingData={bookingData} lineItems={bookingLineItems} />
                        </div>
                    ) : null;

                    const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
                        <IconSpinner className={css.spinner} />
                    ) : null;

                    const bookingInfoErrorMaybe = fetchLineItemsError ? (
                        <span className={css.sideBarError}>
                            <FormattedMessage id="PurchaseOptionsForm.fetchLineItemsError" />
                        </span>
                    ) : null;

                    const submitButtonClasses = classNames(
                        submitButtonWrapperClassName || css.submitButtonWrapper
                    );

                    const priceString = unitPrice ? formatMoney(intl, unitPrice) : null;
                    const basePrice = !showEstimatedBreakdown && priceString ? (
                        <span className={css.basePrice}>
                            <FormattedMessage id="PurchaseOptionsForm.basePrice" values={{ unitPrice: priceString }} />
                        </span>
                    ) : null;

                    return (
                        <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
                            <FormSpy
                                subscription={{ values: true }}
                                onChange={values => {
                                    this.handleOnChange(values);
                                }}
                            />
                            <div className={css.fieldContainer}>
                                <div className={css.countryField}>
                                    <h2 className={css.featuresHeading}>
                                        <FormattedMessage id="PurchaseOptionsForm.shippingHeading" />
                                    </h2>
                                    {allowsInternationalOrders ? (
                                        <FieldSelect
                                            id={`${formId}.country`}
                                            name="country"
                                            validate={countryRequired}
                                        >
                                            <option disabled value="">
                                                {countryPlaceholder}
                                            </option>
                                            {countryCodes.map(country => {
                                                return (
                                                    <option key={country.code} value={country.name}>
                                                        {country.name}
                                                    </option>
                                                );
                                            })}
                                        </FieldSelect>
                                    ) : !allowsInternationalOrders && authorCountry ? (
                                        <FormattedMessage id="PurchaseOptionsForm.onlyShipsToCountry" values={{ country: authorCountry }} />
                                    ) : null}
                                </div>
                                {shouldShowQuantityField ? (
                                    <div className={css.quantityField}>
                                        <h2 className={css.featuresHeading}>
                                            <FormattedMessage id="PurchaseOptionsForm.quantityHeading" />
                                        </h2>
                                        <FieldSelect
                                            id={`${formId}.quantity`}
                                            name="quantity"
                                            // label={quantityLabel}
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
                                    </div>
                                ) : null}
                            </div>
                            {basePrice}
                            {bookingInfoMaybe}
                            {loadingSpinnerMaybe}
                            {bookingInfoErrorMaybe}

                            <div className={submitButtonClasses}>
                                <PrimaryButton type="submit" className={css.purchaseButton}>
                                    <FormattedMessage id="PurchaseOptionsForm.requestToBook" />
                                </PrimaryButton>
                            </div>

                            <p className={css.smallPrint}>
                                <FormattedMessage
                                    id={
                                        isOwnListing
                                            ? 'PurchaseOptionsForm.ownListing'
                                            : 'PurchaseOptionsForm.youWontBeChargedInfo'
                                    }
                                />
                            </p>

                        </Form>
                    );
                }}
            />
        );
    }
}

PurchaseOptionsFormComponent.defaultProps = {
    rootClassName: null,
    className: null,
    submitButtonWrapperClassName: null,
    price: null,
    isOwnListing: false,
    startDatePlaceholder: null,
    endDatePlaceholder: null,
    lineItems: null,
    fetchLineItemsError: null,
};

PurchaseOptionsFormComponent.propTypes = {
    rootClassName: string,
    className: string,
    submitButtonWrapperClassName: string,

    unitType: propTypes.bookingUnitType.isRequired,
    price: propTypes.money,
    isOwnListing: bool,

    onFetchTransactionLineItems: func.isRequired,
    lineItems: array,
    fetchLineItemsInProgress: bool.isRequired,
    fetchLineItemsError: propTypes.error,

    // from injectIntl
    intl: intlShape.isRequired,

    // for tests
    startDatePlaceholder: string,
    endDatePlaceholder: string,
};

const PurchaseOptionsForm = compose(injectIntl)(PurchaseOptionsFormComponent);
PurchaseOptionsForm.displayName = 'PurchaseOptionsForm';

export default PurchaseOptionsForm;