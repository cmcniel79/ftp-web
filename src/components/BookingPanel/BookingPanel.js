import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { propTypes, LISTING_STATE_CLOSED } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { parse, stringify } from '../../util/urlHelpers';
import config from '../../config';
import { ModalInMobile, Button } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';

import css from './BookingPanel.module.css';

const Decimal = require('decimal.js');

// This defines when ModalInMobile shows content as Modal
const MODAL_BREAKPOINT = 1023;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: `(${price.currency})`,
      priceTitle: `Unsupported currency (${price.currency})`,
    };
  }
  return {};
};

const openBookModal = (isOwnListing, isClosed, history, location) => {
  if (isOwnListing || isClosed) {
    window.scrollTo(0, 0);
  } else {
    const { pathname, search, state } = location;
    const searchString = `?${stringify({ ...parse(search), book: true })}`;
    history.push(`${pathname}${searchString}`, state);
  }
};

const closeBookModal = (history, location) => {
  const { pathname, search, state } = location;
  const searchParams = omit(parse(search), 'book');
  const searchString = `?${stringify(searchParams)}`;
  history.push(`${pathname}${searchString}`, state);
};

// const handleFormSubmit = () => {
//   this.props.onSubmit(this.props.isDomesticOrder);
// }

const BookingPanel = props => {
  const {
    rootClassName,
    className,
    listing,
    isOwnListing,
    unitType,
    onSubmit,
    title,
    authorDisplayName,
    onManageDisableScrolling,
    history,
    location,
    intl,
    // onFetchTransactionLineItems,
    // lineItems,
    // fetchLineItemsInProgress,
    // fetchLineItemsError,
    isDomesticOrder,
    shippingFee
  } = props;

  const price = listing.attributes.price;
  const hasListingState = !!listing.attributes.state;
  const isClosed = hasListingState && listing.attributes.state === LISTING_STATE_CLOSED;
  const showBookingDatesForm = hasListingState && !isClosed;
  // Check where this is used in template
  // const showClosedListingHelpText = listing.id && isClosed; 
  const { formattedPrice, priceTitle } = priceData(price, intl);
  const isBook = !!parse(location.search).book;
  const classes = classNames(rootClassName || css.root, className);

  const bookingData = { unitType, isDomesticOrder };
  const shippingFeeItem = isDomesticOrder ? {
    code: 'line-item/shipping-fee',
    unitPrice: shippingFee,
    quantity: new Decimal(1),
    includeFor: ['customer', 'provider'],
    reversal: false,
    lineTotal: shippingFee
  } : {
      code: 'line-item/international-shipping-fee',
      unitPrice: shippingFee,
      quantity: new Decimal(1),
      includeFor: ['customer', 'provider'],
      reversal: false,
      lineTotal: shippingFee
    };
    
  const booking = {
    code: 'line-item/units',
    unitPrice: price,
    quantity: new Decimal(1),
    includeFor: ['customer', 'provider'],
    reversal: false,
    lineTotal: price
  };

  const lineItems = [booking, shippingFeeItem];
  const showEstimatedBreakdown = bookingData && lineItems;

  const bookingInfoMaybe = showEstimatedBreakdown ? (
    <div className={css.priceBreakdownContainer}>
      <EstimatedBreakdownMaybe bookingData={bookingData} lineItems={lineItems} />
    </div>
  ) : null;


  return (
    <div className={classes}>
      <ModalInMobile
        containerClassName={css.modalContainer}
        id="BookingDatesFormInModal"
        isModalOpenOnMobile={isBook}
        onClose={() => closeBookModal(history, location)}
        showAsModalMaxWidth={MODAL_BREAKPOINT}
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <div className={css.modalHeading}>
          <h1 className={css.title}>{title}</h1>
          <div className={css.author}>
            <FormattedMessage id="BookingPanel.hostedBy" values={{ name: authorDisplayName }} />
          </div>
        </div>
        {showBookingDatesForm ? (
          <div>
            <div className={css.modalBookingInfo}>
              {bookingInfoMaybe}
            </div>
            <p className={css.smallPrint}>
              <FormattedMessage
                id={isOwnListing
                    ? 'BookingDatesForm.ownListing'
                    : 'BookingDatesForm.youWontBeChargedInfo'}
              />
            </p>
            <div className={css.bookingDatesSubmitButtonWrapper}>
              <Button className={css.bookButton} onClick={() => { onSubmit(isDomesticOrder) }}>
                <FormattedMessage id="BookingDatesForm.requestToBook" />
              </Button>
            </div>
          </div>
        ) : null}
      </ModalInMobile>
      <div className={css.openBookingForm}>
          <div className={css.priceContainer} title={priceTitle}>
          <FormattedMessage id="BookingPanel.basePrice" />
            {formattedPrice}
        </div>
        {showBookingDatesForm ? (
          <Button
            rootClassName={css.bookButton}
            onClick={() => openBookModal(isOwnListing, isClosed, history, location)}
          >
            <FormattedMessage id="BookingPanel.ctaButtonMessage" />
          </Button>
        ) : isClosed ? (
          <div className={css.closedListingButton}>
            <FormattedMessage id="BookingPanel.closedListingButtonText" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

BookingPanel.defaultProps = {
  rootClassName: null,
  className: null,
  titleClassName: null,
  isOwnListing: false,
  subTitle: null,
  unitType: config.bookingUnitType,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingPanel.propTypes = {
  rootClassName: string,
  className: string,
  titleClassName: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  isOwnListing: bool,
  unitType: propTypes.bookingUnitType,
  onSubmit: func.isRequired,
  title: oneOfType([node, string]).isRequired,
  subTitle: oneOfType([node, string]),
  authorDisplayName: oneOfType([node, string]).isRequired,
  onManageDisableScrolling: func.isRequired,
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(
  withRouter,
  injectIntl
)(BookingPanel);
