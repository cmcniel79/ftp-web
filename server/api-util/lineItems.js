const { calculateTotalFromLineItems, resolveShippingFeePrice } = require('./lineItemHelpers');
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

// This bookingUnitType needs to be one of the following:
// line-item/night, line-item/day or line-item/units
const bookingUnitType = 'line-item/night';
const PROVIDER_COMMISSION_PERCENTAGE = -6;

/** Returns collection of lineItems (max 50)
 *
 * Each line items has following fields:
 * - `code`: string, mandatory, indentifies line item type (e.g. \"line-item/cleaning-fee\"), maximum length 64 characters.
 * - `unitPrice`: money, mandatory
 * - `lineTotal`: money
 * - `quantity`: number
 * - `percentage`: number (e.g. 15.5 for 15.5%)
 * - `seats`: number
 * - `units`: number
 * - `includeFor`: array containing strings \"customer\" or \"provider\", default [\":customer\"  \":provider\" ]
 *
 * Line item must have either `quantity` or `percentage` or both `seats` and `units`.
 *
 * `includeFor` defines commissions. Customer commission is added by defining `includeFor` array `["customer"]` and provider commission by `["provider"]`.
 *
 * @param {Object} listing
 * @param {Object} bookingData
 * @returns {Array} lineItems
 */
exports.transactionLineItems = (listing, bookingData) => {
  const unitPrice = listing.attributes.price;
  const { shippingCountry, quantity } = bookingData;

  console.log(bookingData);
  const isDomesticOrder = shippingCountry === listing.attributes.publicData.country;

  /**
   * If you want to use pre-defined component and translations for printing the lineItems base price for booking,
   * you should use one of the codes:
   * line-item/night, line-item/day or line-item/units (translated to persons).
   *
   * Pre-definded commission components expects line item code to be one of the following:
   * 'line-item/provider-commission', 'line-item/customer-commission'
   *
   * By default BookingBreakdown prints line items inside LineItemUnknownItemsMaybe if the lineItem code is not recognized. */

  
  const booking = {
    code: 'line-item/units',
    unitPrice: unitPrice,
    quantity: quantity ? quantity : 1,
    includeFor: ['customer', 'provider'],
  };

  const shippingFee = isDomesticOrder ? {
    code: 'line-item/shipping',
    unitPrice: resolveShippingFeePrice(listing.attributes.publicData.shippingFee),
    quantity: 1,
    includeFor: ['customer', 'provider'],
  } : {
    code: 'line-item/shipping',
    unitPrice: resolveShippingFeePrice(listing.attributes.publicData.internationalFee),
    quantity: 1,
    includeFor: ['customer', 'provider'],
  };

  const providerCommission = {
    code: 'line-item/provider-commission',
    unitPrice: calculateTotalFromLineItems([booking, shippingFee]),
    percentage: PROVIDER_COMMISSION_PERCENTAGE,
    includeFor: ['provider'],
  };

  const listingEvents = listing.attributes.metadata && listing.attributes.metadata.events;
  const isWithStanford = listingEvents && listingEvents.includes("5f99d32d-0925-4712-94a8-5482c98f565d");

  // No commission on Stanford Powwow Listings
  const lineItems = isWithStanford ? [booking, shippingFee] : [booking, shippingFee, providerCommission];

  return lineItems;
};
