import React, { Component } from 'react';
import { array, arrayOf, bool, func, shape, string, oneOf } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import config from '../../config';
import routeConfiguration from '../../routeConfiguration';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_PENDING_APPROVAL, LISTING_STATE_CLOSED, propTypes } from '../../util/types';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_EDIT,
  createSlug,
} from '../../util/urlHelpers';
import { formatMoney } from '../../util/currency';
import { createResourceLocatorString, findRouteByRouteName } from '../../util/routes';
import {
  ensureListing,
  ensureOwnListing,
  ensureUser,
  userDisplayNameAsString,
} from '../../util/data';
import { richText } from '../../util/richText';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { initializeCardPaymentData } from '../../ducks/stripe.duck.js';
import {
  Page,
  NamedRedirect,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  BookingPanel,
  IconSpinner
} from '../../components';
import { TopbarContainer, NotFoundPage } from '../../containers';

import {
  sendEnquiry,
  setInitialValues,
  fetchTransactionLineItems,
  sendUpdatedFollowed,
  callFollowAPI
} from './ListingPage.duck';

import SectionBarterMaybe from './SectionBarterMaybe';
import SectionCustomOrdersMaybe from './SectionCustomOrdersMaybe';
import SectionDescriptionMaybe from './SectionDescriptionMaybe';
import SectionHeading from './SectionHeading';
import SectionImages from './SectionImages';
import SectionMaterialsMaybe from './SectionMaterialsMaybe';
import SectionPriceMaybe from './SectionPriceMaybe';
import SectionReviews from './SectionReviews';
import SectionSellerMaybe from './SectionSellerMaybe';
import SectionSizesMaybe from './SectionSizesMaybe';

import css from './ListingPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_TITLE = 16;

const { UUID } = sdkTypes;

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

const categoryLabel = (categories, key) => {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.label : key;
};

const subCategoryLabel = (categories, category, subCategoryKey) => {
  const cat = categories.find(c => c.key === category);
  const sub = cat.subCategories ? cat.subCategories.find(s => s.key === subCategoryKey) :
    null;
  return sub && sub.key !== 'other' ? sub.label : null;
};

export class ListingPageComponent extends Component {
  constructor(props) {
    super(props);
    const { enquiryModalOpenForListingId, params } = props;
    this.state = {
      pageClassNames: [],
      enquiryModalOpen: enquiryModalOpenForListingId === params.id,
    };
    this.followed = [];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onContactUser = this.onContactUser.bind(this);
    this.onSubmitEnquiry = this.onSubmitEnquiry.bind(this);
    this.isFollowed = this.isFollowed.bind(this);
    this.updateFollowed = this.updateFollowed.bind(this);
    this.sendFollowed = this.sendFollowed.bind(this);
  }

  handleSubmit(values) {
    const {
      history,
      getListing,
      params,
      callSetInitialValues,
      onInitializeCardPaymentData,
    } = this.props;
    const listingId = new UUID(params.id);
    const listing = getListing(listingId);
    const initialValues = {
      listing,
      bookingData: values,
      confirmPaymentError: null,
    };

    const saveToSessionStorage = !this.props.currentUser;

    const routes = routeConfiguration();
    // Customize checkout page state with current listing and selected bookingDates
    const { setInitialValues } = findRouteByRouteName('CheckoutPage', routes);

    callSetInitialValues(setInitialValues, initialValues, saveToSessionStorage);

    // Clear previous Stripe errors from store if there is any
    onInitializeCardPaymentData();

    // Redirect to CheckoutPage
    history.push(
      createResourceLocatorString(
        'CheckoutPage',
        routes,
        { id: listing.id.uuid, slug: createSlug(listing.attributes.title) },
      )
    );
  }

  onContactUser() {
    const { currentUser, history, callSetInitialValues, params, location } = this.props;

    if (!currentUser) {
      const state = { from: `${location.pathname}${location.search}${location.hash}` };

      // We need to log in before showing the modal, but first we need to ensure
      // that modal does open when user is redirected back to this listingpage
      callSetInitialValues(setInitialValues, { enquiryModalOpenForListingId: params.id });

      // signup and return back to listingPage.
      history.push(createResourceLocatorString('SignupPage', routeConfiguration(), {}, {}), state);
    } else {
      this.setState({ enquiryModalOpen: true });
    }
  }

  isFollowed(sellerId) {
    return this.followed.findIndex(x => x === sellerId);
  }

  updateFollowed(sellerId) {
    const index = this.isFollowed(sellerId);
    var followBool;
    if (this.isFollowed(sellerId) > -1) {
      // Remove seller from followed list
      this.followed.splice(index, 1);
      followBool = false;
    } else {
      // Add seller to followed
      this.followed.push(sellerId);
      followBool = true;
    }
    this.sendFollowed();
    const apiPayload = {
      uuid: sellerId,
      isListing: false,
      add: followBool
    };
    callFollowAPI(apiPayload);
  }

  sendFollowed() {
    const updatedFollowed = {
      privateData: {
        followed: this.followed
      }
    };
    this.props.onSendUpdatedFollowed(updatedFollowed);
  }

  onSubmitEnquiry(values) {
    const { history, params, onSendEnquiry } = this.props;
    const routes = routeConfiguration();
    const listingId = new UUID(params.id);
    const { message } = values;

    onSendEnquiry(listingId, message.trim())
      .then(txId => {
        this.setState({ enquiryModalOpen: false });

        // Redirect to OrderDetailsPage
        history.push(
          createResourceLocatorString('OrderDetailsPage', routes, { id: txId.uuid }, {})
        );
      })
      .catch(() => {
        // Ignore, error handling in duck file
      });
  }

  render() {
    const {
      unitType,
      isAuthenticated,
      currentUser,
      getListing,
      getOwnListing,
      intl,
      onManageDisableScrolling,
      params: rawParams,
      location,
      scrollingDisabled,
      showListingError,
      reviews,
      fetchReviewsError,
      sendEnquiryInProgress,
      sendEnquiryError,
      filterConfig,
      onFetchTransactionLineItems,
      lineItems,
      fetchLineItemsInProgress,
      fetchLineItemsError,
    } = this.props;

    const listingId = new UUID(rawParams.id);
    const isPendingApprovalVariant = rawParams.variant === LISTING_PAGE_PENDING_APPROVAL_VARIANT;
    const isDraftVariant = rawParams.variant === LISTING_PAGE_DRAFT_VARIANT;
    const currentListing =
      isPendingApprovalVariant || isDraftVariant
        ? ensureOwnListing(getOwnListing(listingId))
        : ensureListing(getListing(listingId));

    const listingSlug = rawParams.slug || createSlug(currentListing.attributes.title || '');
    const params = { slug: listingSlug, ...rawParams };

    const listingType = isDraftVariant
      ? LISTING_PAGE_PARAM_TYPE_DRAFT
      : LISTING_PAGE_PARAM_TYPE_EDIT;
    const listingTab = isDraftVariant ? 'photos' : 'description';

    const isApproved =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_PENDING_APPROVAL;

    const pendingIsApproved = isPendingApprovalVariant && isApproved;

    // If a /pending-approval URL is shared, the UI requires
    // authentication and attempts to fetch the listing from own
    // listings. This will fail with 403 Forbidden if the author is
    // another user. We use this information to try to fetch the
    // public listing.
    const pendingOtherUsersListing =
      (isPendingApprovalVariant || isDraftVariant) &&
      showListingError &&
      showListingError.status === 403;
    const shouldShowPublicListingPage = pendingIsApproved || pendingOtherUsersListing;

    if (shouldShowPublicListingPage) {
      return <NamedRedirect name="ListingPage" params={params} search={location.search} />;
    }

    const {
      description = '',
      price = null,
      title = '',
      publicData,
    } = currentListing.attributes;

    const richTitle = (
      <span>
        {richText(title, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_TITLE,
          longWordClass: css.longWord,
        })}
      </span>
    );

    const bookingTitle = (
      <FormattedMessage id="ListingPage.bookingTitle" values={{ title: richTitle }} />
    );
    const bookingSubTitle = intl.formatMessage({ id: 'ListingPage.bookingSubTitle' });

    const topbar = <TopbarContainer />;

    if (showListingError && showListingError.status === 404) {
      // 404 listing not found

      return <NotFoundPage />;
    } else if (showListingError) {
      // Other error in fetching listing

      const errorTitle = intl.formatMessage({
        id: 'ListingPage.errorLoadingListingTitle',
      });

      return (
        <Page title={errorTitle} scrollingDisabled={scrollingDisabled}>
          <LayoutSingleColumn className={css.pageRoot}>
            <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
            <LayoutWrapperMain>
              <p className={css.errorText}>
                <FormattedMessage id="ListingPage.errorLoadingListingMessage" />
              </p>
            </LayoutWrapperMain>
            <LayoutWrapperFooter>
              <Footer />
            </LayoutWrapperFooter>
          </LayoutSingleColumn>
        </Page>
      );
    } else if (!currentListing.id) {
      // Still loading the listing

      const loadingTitle = intl.formatMessage({
        id: 'ListingPage.loadingListingTitle',
      });

      return (
        <Page title={loadingTitle} scrollingDisabled={scrollingDisabled}>
          <LayoutSingleColumn className={css.pageRoot}>
            <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
            <LayoutWrapperMain>
              <p className={css.loadingText}>
                <FormattedMessage id="ListingPage.loadingListingMessage" />
              </p>
            </LayoutWrapperMain>
            <LayoutWrapperFooter>
              <Footer />
            </LayoutWrapperFooter>
          </LayoutSingleColumn>
        </Page>
      );
    }

    this.followed = currentUser && currentUser.attributes.profile.privateData && currentUser.attributes.profile.privateData.followed ?
      currentUser.attributes.profile.privateData.followed : [];
    const authorAvailable = currentListing && currentListing.author;
    const userAndListingAuthorAvailable = !!(currentUser && authorAvailable);
    const isOwnListing =
      userAndListingAuthorAvailable && currentListing.author.id.uuid === currentUser.id.uuid;
    // Should check where showContactUser was originally used in the templace 
    // const showContactUser = authorAvailable && (!currentUser || (currentUser && !isOwnListing));

    const currentAuthor = authorAvailable ? currentListing.author : null;
    const ensuredAuthor = ensureUser(currentAuthor);
    // When user is banned or deleted the listing is also deleted.
    // Because listing can be never showed with banned or deleted user we don't have to provide
    // banned or deleted display names for the function
    const authorDisplayName = userDisplayNameAsString(ensuredAuthor, '');

    const authorPublicData = ensuredAuthor.attributes.profile.publicData;
    const authorCountry = authorPublicData && authorPublicData.country ? authorPublicData.country : "United States";
    const authorTribe = authorPublicData && authorPublicData.tribe ? authorPublicData.tribe : null;
    const accountType = authorPublicData && authorPublicData.accountType ? authorPublicData.accountType : null;
    const isPremium = accountType && (accountType === "p" || accountType === "a" || accountType === "n") ? true : false;

    const { formattedPrice, priceTitle } = priceData(price, intl);

    const handleBookingSubmit = values => {
      const isCurrentlyClosed = currentListing.attributes.state === LISTING_STATE_CLOSED;
      if (isOwnListing || isCurrentlyClosed) {
        window.scrollTo(0, 0);
      } else {
        this.handleSubmit(values);
      }
    };

    const listingImages = (listing, variantName) =>
      (listing.images || [])
        .map(image => {
          const variants = image.attributes.variants;
          const variant = variants ? variants[variantName] : null;

          // deprecated
          // for backwards combatility only
          const sizes = image.attributes.sizes;
          const size = sizes ? sizes.find(i => i.name === variantName) : null;

          return variant || size;
        })
        .filter(variant => variant != null);

    const facebookImages = listingImages(currentListing, 'facebook');
    const twitterImages = listingImages(currentListing, 'twitter');
    const schemaImages = JSON.stringify(facebookImages.map(img => img.url));
    const siteTitle = config.siteTitle;
    const schemaTitle = intl.formatMessage(
      { id: 'ListingPage.schemaTitle' },
      { title, price: formattedPrice, siteTitle }
    );

    const materialOptions = findOptionsForSelectFilter('material', filterConfig);
    const categoryOptions = findOptionsForSelectFilter('category', filterConfig);
    const listingCategory = publicData && publicData.category ? categoryLabel(categoryOptions, publicData.category) : null;
    const listingSubCategory = publicData && publicData.category && publicData.subCategory ? subCategoryLabel(categoryOptions, publicData.category, publicData.subCategory) : null;
    const headingSubtitle = publicData && publicData.category && publicData.subCategory ? (
      <span className={css.headingSubtitle}>
        {listingCategory}
        {listingSubCategory &&
          <div className={css.authorTribe}>
            <span className={css.separator}>•</span>
            {listingSubCategory}
          </div>}
        {authorTribe &&
          <div className={css.authorTribe}>
            <span className={css.separator}>•</span>
            {authorTribe}
          </div>}
      </span>
    ) : null;

    const material = publicData && publicData.material ? publicData.material : null;
    const sizes = publicData && publicData.sizes ? publicData.sizes : null;
    const customOrders = publicData && publicData.customOrders ? publicData.customOrders : null;
    const websiteLink = isPremium && publicData && publicData.websiteLink ? publicData.websiteLink : null;
    const allowsBarter = publicData && publicData.allowsBarter;
    const allowsInternationalOrders = publicData && publicData.allowsInternationalOrders;
    const barter = publicData && publicData.barter ? publicData.barter : null;
    const userAccountType = currentUser && currentUser.attributes.profile.publicData &&
      currentUser.attributes.profile.publicData.accountType ? currentUser.attributes.profile.publicData.accountType : null;

    const maxQuantity = publicData && publicData.maxQuantity ? publicData.maxQuantity : null;
    const shippingFee = publicData && publicData.shippingFee ? publicData.shippingFee : null;

    const loadingSpinnerMaybe = (
      <IconSpinner className={css.spinner} />
    );

    return (
      <Page
        title={schemaTitle}
        scrollingDisabled={scrollingDisabled}
        author={authorDisplayName}
        contentType="website"
        description={description}
        facebookImages={facebookImages}
        twitterImages={twitterImages}
        schema={{
          '@context': 'http://schema.org',
          '@type': 'ItemPage',
          description: description,
          name: schemaTitle,
          image: schemaImages,
        }}
      >
        <LayoutSingleColumn className={css.pageRoot}>
          <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div>
              <div className={css.contentContainer}>
                <div className={css.mainContent}>
                  <SectionHeading
                    priceTitle={priceTitle}
                    formattedPrice={formattedPrice}
                    richTitle={richTitle}
                    subTitle={headingSubtitle}
                  />
                  <SectionImages
                    className={css.sectionImages}
                    title={title}
                    listing={currentListing}
                    isOwnListing={isOwnListing}
                    editParams={{
                      id: listingId.uuid,
                      slug: listingSlug,
                      type: listingType,
                      tab: listingTab,
                    }}
                  />
                  {!isPremium &&
                    <div className={css.reviewsContainerDesktop}>
                      <SectionReviews reviews={reviews} fetchReviewsError={fetchReviewsError} />
                    </div>}
                </div>
                {description && publicData ? (
                  <div className={css.bookingPanel}>
                    <SectionSellerMaybe
                      title={title}
                      listing={currentListing}
                      authorDisplayName={authorDisplayName}
                      onContactUser={this.onContactUser}
                      isEnquiryModalOpen={isAuthenticated && this.state.enquiryModalOpen}
                      onCloseEnquiryModal={() => this.setState({ enquiryModalOpen: false })}
                      sendEnquiryError={sendEnquiryError}
                      sendEnquiryInProgress={sendEnquiryInProgress}
                      onSubmitEnquiry={this.onSubmitEnquiry}
                      currentUser={currentUser}
                      onManageDisableScrolling={onManageDisableScrolling}
                      isPremium={isPremium}
                      isFollowed={this.isFollowed}
                      updateFollowed={this.updateFollowed}
                    />
                    <SectionDescriptionMaybe description={description} />
                    {userAccountType === 'e' ? (
                      <SectionBarterMaybe barter={barter} allowsBarter={allowsBarter} />
                    ) : null}
                    <SectionCustomOrdersMaybe customOrders={customOrders} />
                    <SectionMaterialsMaybe options={materialOptions} material={material} />
                    <SectionSizesMaybe sizes={sizes} />
                    {isPremium ? (
                      <SectionPriceMaybe
                        currentUser={currentUser}
                        isPremium={isPremium}
                        price={formattedPrice}
                        websiteLink={websiteLink}
                        onSubmit={handleBookingSubmit}
                      />
                    ) : (
                      <BookingPanel
                        className={css.bookingBreakdown}
                        listing={currentListing}
                        isOwnListing={isOwnListing}
                        unitType={unitType}
                        onSubmit={handleBookingSubmit}
                        title={bookingTitle}
                        subTitle={bookingSubTitle}
                        authorDisplayName={authorDisplayName}
                        onManageDisableScrolling={onManageDisableScrolling}
                        onFetchTransactionLineItems={onFetchTransactionLineItems}
                        lineItems={lineItems}
                        fetchLineItemsInProgress={fetchLineItemsInProgress}
                        fetchLineItemsError={fetchLineItemsError}
                        allowsInternationalOrders={allowsInternationalOrders}
                        authorCountry={authorCountry}
                        maxQuantity={maxQuantity}
                        shippingFee={shippingFee}
                      />
                    )}
                    {!isPremium &&
                      <div className={css.reviewsContainerMobile}>
                        <SectionReviews reviews={reviews} fetchReviewsError={fetchReviewsError} />
                      </div>}
                  </div>
                ) : (
                  loadingSpinnerMaybe
                )}
              </div>
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

ListingPageComponent.defaultProps = {
  unitType: config.bookingUnitType,
  currentUser: null,
  enquiryModalOpenForListingId: null,
  showListingError: null,
  reviews: [],
  fetchReviewsError: null,
  sendEnquiryError: null,
  filterConfig: config.custom.filters,
  lineItems: null,
  fetchLineItemsError: null,
};

ListingPageComponent.propTypes = {
  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  unitType: propTypes.bookingUnitType,
  // from injectIntl
  intl: intlShape.isRequired,

  params: shape({
    id: string.isRequired,
    slug: string,
    variant: oneOf([LISTING_PAGE_DRAFT_VARIANT, LISTING_PAGE_PENDING_APPROVAL_VARIANT]),
  }).isRequired,

  isAuthenticated: bool.isRequired,
  currentUser: propTypes.currentUser,
  getListing: func.isRequired,
  getOwnListing: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  scrollingDisabled: bool.isRequired,
  enquiryModalOpenForListingId: string,
  showListingError: propTypes.error,
  callSetInitialValues: func.isRequired,
  reviews: arrayOf(propTypes.review),
  fetchReviewsError: propTypes.error,
  sendEnquiryInProgress: bool.isRequired,
  sendEnquiryError: propTypes.error,
  onSendEnquiry: func.isRequired,
  onInitializeCardPaymentData: func.isRequired,
  filterConfig: array,
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,
};

const mapStateToProps = state => {
  const { isAuthenticated } = state.Auth;
  const {
    showListingError,
    reviews,
    fetchReviewsError,
    sendEnquiryInProgress,
    sendEnquiryError,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    enquiryModalOpenForListingId,
  } = state.ListingPage;
  const { currentUser } = state.user;
  const getListing = id => {
    const ref = { id, type: 'listing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  const getOwnListing = id => {
    const ref = { id, type: 'ownListing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  return {
    isAuthenticated,
    currentUser,
    getListing,
    getOwnListing,
    scrollingDisabled: isScrollingDisabled(state),
    enquiryModalOpenForListingId,
    showListingError,
    reviews,
    fetchReviewsError,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    sendEnquiryInProgress,
    sendEnquiryError,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  callSetInitialValues: (setInitialValues, values, saveToSessionStorage) =>
    dispatch(setInitialValues(values, saveToSessionStorage)),
  onFetchTransactionLineItems: (bookingData, listingId, isOwnListing) =>
    dispatch(fetchTransactionLineItems(bookingData, listingId, isOwnListing)),
  onSendEnquiry: (listingId, message) => dispatch(sendEnquiry(listingId, message)),
  onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
  onSendUpdatedFollowed: (data) => dispatch(sendUpdatedFollowed(data))
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const ListingPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ListingPageComponent);

export default ListingPage;
