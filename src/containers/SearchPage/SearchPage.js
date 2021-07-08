import React, { Component } from 'react';
import { array, bool, func, oneOf, object, shape, string } from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import config from '../../config';
import { parse, stringify } from '../../util/urlHelpers';
import { propTypes } from '../../util/types';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { Page } from '../../components';
import { TopbarContainer } from '../../containers';
import { 
  setActiveListing, 
  sendUpdatedLikes, 
  callLikeAPI, 
  updateRanking 
} from './SearchPage.duck';
import {
  pickSearchParamsOnly,
  validURLParamsForExtendedData,
  createSearchResultSchema,
} from './SearchPage.helpers';
import MainPanel from './MainPanel';

import css from './SearchPage.module.css';

// Pagination page size might need to be dynamic on responsive page layouts
// Current design has max 3 columns 12 is divisible by 2 and 3
// So, there's enough cards to fill all columns on full pagination pages
const MODAL_BREAKPOINT = 768; // Search is in modal on mobile layout

export class SearchPageComponent extends Component {
  constructor(props) {
    super(props);

    this.tribes = [];
    this.likes = [];
    this.state = {
      isSearchMapOpenOnMobile: props.tab === 'map',
      isMobileModalOpen: false,
    };
    this.onOpenMobileModal = this.onOpenMobileModal.bind(this);
    this.onCloseMobileModal = this.onCloseMobileModal.bind(this);
    this.isLiked = this.isLiked.bind(this);
    this.updateLikes = this.updateLikes.bind(this);
    this.sendLikes = this.sendLikes.bind(this);
    this.saveTribes = this.saveTribes.bind(this);
  }

  saveTribes(nativeLandTribes) {
    this.tribes = nativeLandTribes;
  }

  isLiked(listingId) {
    return this.likes && this.likes.length > 0 ? this.likes.findIndex(x => x === listingId) : -1;
  }

  updateLikes(listingId) {
    const index = this.likes && this.likes.length > 0 ? this.isLiked(listingId) : -1;
    var likeBool;
    if (index > -1) {
      // Remove listing from likes list
      this.likes.splice(index, 1);
      likeBool = false;
    } else {
      // Add listing to likes list
      this.likes.push(listingId);
      likeBool = true;
    }
    this.sendLikes();
    const apiPayload = {
      uuid: listingId,
      isListing: true,
      add: likeBool
    };
    callLikeAPI(apiPayload);
  }

  sendLikes() {
    const updatedLikes = {
      privateData: {
        likes: this.likes
      }
    };
    this.props.onSendUpdatedLikes(updatedLikes);
  }

  // Invoked when a modal is opened from a child component,
  // for example when a filter modal is opened in mobile view
  onOpenMobileModal() {
    this.setState({ isMobileModalOpen: true });
  }

  // Invoked when a modal is closed from a child component,
  // for example when a filter modal is opened in mobile view
  onCloseMobileModal() {
    this.setState({ isMobileModalOpen: false });
  }

  render() {
    const {
      currentUser,
      intl,
      listings,
      filterConfig,
      sortConfig,
      history,
      location,
      onManageDisableScrolling,
      pagination,
      scrollingDisabled,
      searchInProgress,
      searchListingsError,
      searchParams,
      onActivateListing,
    } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { mapSearch, page, ...searchInURL } = parse(location.search, {
      latlng: ['origin'],
      latlngBounds: ['bounds'],
    });

    this.likes = currentUser && currentUser.attributes.profile.privateData && currentUser.attributes.profile.privateData.likes ? 
      currentUser.attributes.profile.privateData.likes : [];
    // urlQueryParams doesn't contain page specific url params
    // like mapSearch, page or origin (origin depends on config.sortSearchByDistance)
    const urlQueryParams = pickSearchParamsOnly(searchInURL, filterConfig, sortConfig);

    // Page transition might initially use values from previous search
    const urlQueryString = stringify(urlQueryParams);
    const paramsQueryString = stringify(
      pickSearchParamsOnly(searchParams, filterConfig, sortConfig)
    );
    const searchParamsAreInSync = urlQueryString === paramsQueryString;

    const validQueryParams = validURLParamsForExtendedData(searchInURL, filterConfig);

    const onMapIconClick = () => {
      this.useLocationSearchBounds = true;
      this.setState({ isSearchMapOpenOnMobile: true });
    };

    const { address } = searchInURL || {};
    const { title, description, schema } = createSearchResultSchema(listings, address, intl);

    // Set topbar class based on if a modal is open in
    // a child component
    const topbarClasses = this.state.isMobileModalOpen
      ? classNames(css.topbarBehindModal, css.topbar)
      : css.topbar;
    // N.B. openMobileMap button is sticky.
    // For some reason, stickyness doesn't work on Safari, if the element is <button>
    return (
      <Page
        scrollingDisabled={scrollingDisabled}
        description={description}
        title={title}
        schema={schema}
      >
        <TopbarContainer
          className={topbarClasses}
          currentPage="SearchPage"
          currentSearchParams={urlQueryParams}
        />
        <div className={css.container}>
          <MainPanel
            urlQueryParams={validQueryParams}
            listings={listings}
            searchInProgress={searchInProgress}
            searchListingsError={searchListingsError}
            searchParamsAreInSync={searchParamsAreInSync}
            onActivateListing={onActivateListing}
            onManageDisableScrolling={onManageDisableScrolling}
            onOpenModal={this.onOpenMobileModal}
            onCloseModal={this.onCloseMobileModal}
            onMapIconClick={onMapIconClick}
            pagination={pagination}
            searchParamsForPagination={parse(location.search)}
            showAsModalMaxWidth={MODAL_BREAKPOINT}
            history={history}
            currentUser={currentUser}
            isLiked={this.isLiked}
            updateLikes={this.updateLikes}
            saveTribes={this.saveTribes}
            tribes={this.tribes}
            updateRanking={updateRanking}
          />
        </div>
      </Page>
    );
  }
}

SearchPageComponent.defaultProps = {
  listings: [],
  pagination: null,
  searchListingsError: null,
  searchParams: {},
  tab: 'listings',
  filterConfig: config.custom.filters,
  sortConfig: config.custom.sortConfig,
  activeListingId: null,
  currentUser: null
};

SearchPageComponent.propTypes = {
  listings: array,
  onActivateListing: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  pagination: propTypes.pagination,
  scrollingDisabled: bool.isRequired,
  searchInProgress: bool.isRequired,
  searchListingsError: propTypes.error,
  searchParams: object,
  tab: oneOf(['filters', 'listings', 'map']).isRequired,
  filterConfig: propTypes.filterConfig,
  sortConfig: propTypes.sortConfig,
  currentUser: propTypes.currentUser,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    currentPageResultIds,
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
    activeListingId,
  } = state.SearchPage;
  const pageListings = getListingsById(state, currentPageResultIds);
  const { currentUser } = state.user;
  return {
    currentUser,
    listings: pageListings,
    pagination,
    scrollingDisabled: isScrollingDisabled(state),
    searchInProgress,
    searchListingsError,
    searchParams,
    activeListingId,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onActivateListing: listingId => dispatch(setActiveListing(listingId)),
  onSendUpdatedLikes: data => dispatch(sendUpdatedLikes(data)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const SearchPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(SearchPageComponent);

// SearchPage.loadData = (params, search) => {
//   const queryParams = parse(search, {
//     latlng: ['origin'],
//     latlngBounds: ['bounds'],
//   });
//   const { page = 1, address, origin, ...rest } = queryParams;
//   const originMaybe = config.sortSearchByDistance && origin ? { origin } : {};
//   return searchListings({
//     ...rest,
//     ...originMaybe,
//     page,
//     perPage: RESULT_PAGE_SIZE,
//     include: ['author', 'images'],
//     'fields.listing': ['title', 'geolocation', 'price', 'publicData.websiteLink', 'publicData.category'],
//     'fields.user': ['profile.displayName', 'profile.abbreviatedName',
//       'profile.publicData.accountType', 'profile.publicData.tribe', 'profile.publicData.companyName', 'profile.publicData.companyIndustry'], //added metadata for verify badge
//     'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
//     'limit.images': 1,
//   });
// };

export default SearchPage;
