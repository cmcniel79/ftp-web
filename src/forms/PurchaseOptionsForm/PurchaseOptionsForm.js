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

import css from './PurchaseOptionsForm.module.css';

export class PurchaseOptionsFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { focusedInput: null };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.onFocusedInputChange = this.onFocusedInputChange.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
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
        const country = e && e.country ? e.country :
            (!this.props.allowsInternationalOrders && this.props.authorCountry) ? this.props.authorCountry : null;
        const quantity = e && e.quantity ? e.quantity : null

        if (!country) {
            e.preventDefault();
            this.setState({ focusedInput: "country" });
        } else if (!quantity) {
            e.preventDefault();
            this.setState({ focusedInput: "quantity" });
        } else {
            this.props.onSubmit({country, quantity});
        }
    }

    // When the values of the form are updated we need to fetch
    // lineItems from FTW backend for the EstimatedTransactionMaybe
    // In case you add more fields to the form, make sure you add
    // the values here to the bookingData object.
    handleOnChange(formValues) {
        const country = formValues.values && formValues.values.country ? formValues.values.country : 
            !this.props.allowsInternationalOrders && this.props.authorCountry ? this.props.authorCountry : null;
        const quantity = formValues.values && formValues.values.quantity;
        const listingId = this.props.listingId;
        const isOwnListing = this.props.isOwnListing;

        if (country && quantity && !this.props.fetchLineItemsInProgress) {
            this.props.onFetchTransactionLineItems({
                bookingData: { isDomesticOrder: true, shippingCountry: country, quantity },
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
                        authorCountry
                    } = fieldRenderProps;

                    const country = values && values.country;
                    const quantity = values && values.quantity;

                    const countryLabel = intl.formatMessage({ id: 'PurchaseOptionsForm.countryLabel' });
                    const countryPlaceholder = intl.formatMessage({ id: 'PurchaseOptionsForm.countryPlaceholder' });
                    const countryRequiredMessage = intl.formatMessage({ id: 'PurchaseOptionsForm.countryRequiredMessage' });
                    const countryRequired = required(countryRequiredMessage);

                    const quantityLabel = intl.formatMessage({ id: 'PurchaseOptionsForm.quantityLabel' });
                    const quantityRequiredMessage = intl.formatMessage({ id: 'PurchaseOptionsForm.quantityRequiredMessage' });
                    const quantityRequired = required(quantityRequiredMessage);

                    var quantityArray = [];
                    for (var i = 1; i <= 10; i++) {
                        quantityArray.push(i);
                    }

                    // This is the place to collect breakdown estimation data.
                    // Note: lineItems are calculated and fetched from FTW backend
                    // so we need to pass only booking data that is needed otherwise
                    // If you have added new fields to the form that will affect to pricing,
                    // you need to add the values to handleOnChange function
                    const bookingData =
                        (country && quantity) || (!allowsInternationalOrders && authorCountry && quantity)
                            ? {
                                unitType,
                                country: country ? country : authorCountry,
                                quantity,
                            }
                            : null;

                    const showEstimatedBreakdown =
                        bookingData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

                    const bookingInfoMaybe = showEstimatedBreakdown ? (
                        <div className={css.priceBreakdownContainer}>
                            <EstimatedBreakdownMaybe bookingData={bookingData} lineItems={lineItems} />
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

                    const onlyShipsToCountry = !allowsInternationalOrders && authorCountry ? (
                        <span className={css.onlyShipsToCountry}>
                            <FormattedMessage id="PurchaseOptionsForm.onlyShipsToCountry" values={{ country: authorCountry }} />
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
                            {basePrice}
                            <div className={css.fieldContainer}>
                                {allowsInternationalOrders ? (
                                    <FieldSelect
                                        id={`${formId}.country`}
                                        name="country"
                                        className={css.countryField}
                                        label={countryLabel}
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
                                ) : null}
                                <FieldSelect
                                    id={`${formId}.quantity`}
                                    name="quantity"
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
                            </div>
                            {onlyShipsToCountry}
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