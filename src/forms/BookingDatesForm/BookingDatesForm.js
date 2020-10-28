import React, { Component } from 'react';
import { string, bool, arrayOf, array, func } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { required, composeValidators } from '../../util/validators';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Form, IconSpinner, Button, FieldTextInput } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';

import css from './BookingDatesForm.css';
const Decimal = require('decimal.js');

const { Money } = sdkTypes;
const identity = v => v;

export class BookingDatesFormComponent extends Component {
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
    this.props.onSubmit(this.props.isDomesticOrder);
  }

  // When the values of the form are updated we need to fetch
  // lineItems from FTW backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the bookingData object.
  // See https://www.sharetribe.com/docs/tutorial-transaction-process/customize-pricing-tutorial/
  handleOnChange(formValues) {
    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;
    const isDomesticOrder = this.props.isDomesticOrder;
    if (!this.props.fetchLineItemsInProgress) {
      this.props.onFetchTransactionLineItems({
        bookingData: { isDomesticOrder },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingCurrencyInvalid" />
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
            // formId,
            handleSubmit,
            // intl,
            isOwnListing,
            submitButtonWrapperClassName,
            unitType,
            // values,
            // lineItems,
            // fetchLineItemsInProgress,
            // fetchLineItemsError,
            shippingFee,
            isDomesticOrder,
            // onFetchTransactionLineItems,
            // listingId
          } = fieldRenderProps;
          
          // const quantityMessage = intl.formatMessage({
          //   id: 'BookingDatesForm.quantityMessage',
          // });
    
          // const quantityPlaceholderMessage = intl.formatMessage({
          //   id: 'BookingDatesForm.quantityPlaceholder',
          // });

          const bookingData = { unitType, isDomesticOrder };
          const shippingFeeItem = {
            code: 'line-item/shipping-fee',
            unitPrice: shippingFee,
            quantity: new Decimal(1),
            includeFor: ['customer', 'provider'],
            reversal: false,
            lineTotal: shippingFee
          };
          const booking = {
            code: 'line-item/units',
            unitPrice: unitPrice,
            quantity: new Decimal(1),
            includeFor: ['customer', 'provider'],
            reversal: false,
            lineTotal: unitPrice
          };

          const lineItems = [booking, shippingFeeItem];

          const showEstimatedBreakdown = bookingData && lineItems;
          // bookingData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

          const bookingInfoMaybe = showEstimatedBreakdown ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingDatesForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe bookingData={bookingData} lineItems={lineItems} />
            </div>
          ) : null;

          // const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
          //   <IconSpinner className={css.spinner} />
          // ) : null;

          // const bookingInfoErrorMaybe = fetchLineItemsError ? (
          //   <span className={css.sideBarError}>
          //     <FormattedMessage id="BookingDatesForm.fetchLineItemsError" />
          //   </span>
          // ) : null;

          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          return (
            <Form onSubmit={handleSubmit} className={classes}> 
              {/* <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              /> */}
              {bookingInfoMaybe}
              {/* {loadingSpinnerMaybe}
              {bookingInfoErrorMaybe} */}

              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingDatesForm.ownListing'
                      : 'BookingDatesForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <Button type="submit" className={css.bookButton}>
                  <FormattedMessage id="BookingDatesForm.requestToBook" />
                </Button>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingDatesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingDatesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

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

const BookingDatesForm = compose(injectIntl)(BookingDatesFormComponent);
BookingDatesForm.displayName = 'BookingDatesForm';

export default BookingDatesForm;
