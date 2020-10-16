import React, { Component } from 'react';
import { array, bool, func, oneOf, object, shape, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import config from '../../config';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString, pathByRouteName } from '../../util/routes';
import { parse } from '../../util/urlHelpers';
import { propTypes } from '../../util/types';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { findOptionsForSelectFilter } from '../../util/search';
import {
  SearchMap,
  Page,
  LayoutWrapperFooter,
  Footer,
  LayoutSingleColumn,
  LayoutWrapperMain,
  LayoutWrapperTopbar,
  NamedLink,
  NativeLand,
  SelectSingleFilter,
} from '../../components';
import { TopbarContainer } from '../../containers';

import { searchMapListings, setActiveListing, loadData } from './MapPage.duck';
import {
  pickSearchParamsOnly,
  validFilterParams,
  createSearchResultSchema,
} from './MapPage.helpers';
import css from './MapPage.css';
import { types as sdkTypes } from '../../util/sdkLoader';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';


const { LatLng, LatLngBounds, UUID } = sdkTypes;

const SEARCH_WITH_MAP_DEBOUNCE = 300; // Little bit of debounce before search is initiated.

export class MapPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearchMapOpenOnMobile: props.tab === 'map',
      isMobileModalOpen: false,
      industry: null,
      tribe: null,
      origin: new LatLng(39.3812661305678, -97.9222112121185),
      bounds: new LatLngBounds(new LatLng(71.4202919997506, -66.8847646185949), new LatLng(18.8163608007951, -179.9)),
    };

    this.searchMapListingsInProgress = false;
    this.tribe = null;
    this.onMapMoveEnd = debounce(this.onMapMoveEnd.bind(this), SEARCH_WITH_MAP_DEBOUNCE);
    this.onOpenMobileModal = this.onOpenMobileModal.bind(this);
    this.onCloseMobileModal = this.onCloseMobileModal.bind(this);
    this.selectTribe = this.selectTribe.bind(this);
    this.selectIndustry = this.selectIndustry.bind(this);
    this.initialValues = this.initialValues.bind(this);
    this.setGeolocation = this.setGeolocation.bind(this);
  }

  selectTribe(value) {
    this.setState({ tribe: value['pub_nativeLands'] });
  }

  selectIndustry(value) {
    this.setState({ industry: value['pub_industry'] });
  }

  initialValues(array) {
    return { 'pub_nativeLands': this.state.tribe, 'pub_industry': this.state.industry };
  }

  setGeolocation(lat, lng) {
    this.setState({ origin: new LatLng(lat, lng) });
    this.setState({
      bounds: new LatLngBounds(new LatLng(lat + .5, lng + .5), new LatLng(lat - .5, lng - .5))
    });
  }

  // Callback to determine if new search is needed
  // when map is moved by user or viewport has changed
  onMapMoveEnd(viewportBoundsChanged, data) {
    const { viewportBounds, viewportCenter } = data;

    const routes = routeConfiguration();
    const searchPagePath = pathByRouteName('SearchPage', routes);
    const currentPath =
      typeof window !== 'undefined' && window.location && window.location.pathname;

    // When using the ReusableMapContainer onMapMoveEnd can fire from other pages than SearchPage too
    const isSearchPage = currentPath === searchPagePath;

    // If mapSearch url param is given
    // or original location search is rendered once,
    // we start to react to "mapmoveend" events by generating new searches
    // (i.e. 'moveend' event in Mapbox and 'bounds_changed' in Google Maps)
    if (viewportBoundsChanged && isSearchPage) {
      const { history, location, filterConfig } = this.props;

      // parse query parameters, including a custom attribute named category
      const { address, bounds, mapSearch, ...rest } = parse(location.search, {
        latlng: ['origin'],
        latlngBounds: ['bounds'],
      });

      //const viewportMapCenter = SearchMap.getMapCenter(map);
      const originMaybe = config.sortSearchByDistance ? { origin: viewportCenter } : {};

      const searchParams = {
        address,
        ...originMaybe,
        bounds: viewportBounds,
        mapSearch: true,
        ...validFilterParams(rest, filterConfig),
      };

      history.push(createResourceLocatorString('SearchPage', routes, {}, searchParams));
    }
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
      intl,
      users,
      filterConfig,
      sortConfig,
      location,
      onManageDisableScrolling,
      scrollingDisabled,
      activeListingId,
    } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { mapSearch, page, ...searchInURL } = parse(location.search, {
      latlng: ['origin'],
      latlngBounds: ['bounds'],
    });

    // urlQueryParams doesn't contain page specific url params
    // like mapSearch, page or origin (origin depends on config.sortSearchByDistance)
    const urlQueryParams = pickSearchParamsOnly(searchInURL, filterConfig, sortConfig);

    const onMapIconClick = () => {
      this.useLocationSearchBounds = true;
      this.setState({ isSearchMapOpenOnMobile: true });
    };

    const title = intl.formatMessage(
      { id: 'MapPage.schemaTitle' },
    );
    const description = intl.formatMessage(
      { id: 'MapPage.schemaDescription' },
    );

    // Set topbar class based on if a modal is open in
    // a child component
    const topbarClasses = this.state.isMobileModalOpen
      ? classNames(css.topbarBehindModal, css.topbar)
      : css.topbar;

    // N.B. openMobileMap button is sticky.
    // For some reason, stickyness doesn't work on Safari, if the element is <button>
    /* eslint-disable jsx-a11y/no-static-element-interactions */

    const faqLink = <NamedLink name="FAQPage"> <FormattedMessage id="MapPage.faqLink" /> </NamedLink>;
    const industryOptions = findOptionsForSelectFilter('industry', filterConfig);

    return (
      <Page
        scrollingDisabled={scrollingDisabled}
        description={description}
        title={title}
        schema={{
          '@context': 'http://schema.org',
          '@type': 'ItemPage',
          description: description,
          name: title,
        }}
      >
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer
              className={topbarClasses}
              currentPage="MapPage"
              currentSearchParams={urlQueryParams}
            />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div className={css.container}>
              <div className={css.pageHeading}>
                <h1 className={css.title}>
                  <FormattedMessage id="MapPage.heading" />
                </h1>
                <h5 className={css.pageSubtitle}>
                  <FormattedMessage id="MapPage.subtitle" values={{ faqLink }} />
                </h5>
                <SelectSingleFilter
                  className={css.industryFilter}
                  queryParamNames={['pub_industry']}
                  initialValues={this.initialValues()}
                  showAsPopup={true}
                  onSelect={this.selectIndustry}
                  label="Business Type"
                  options={industryOptions}
                />
                <NativeLand
                  onSelect={this.selectTribe}
                  initialValues={this.initialValues}
                  setGeolocation={this.setGeolocation}
                />
              </div>
              <div className={css.mapWrapper}>
                {users[0] !== null &&
                  <SearchMap
                    reusableContainerClassName={css.map}
                    activeListingId={activeListingId}
                    bounds={this.state.bounds}
                    center={this.state.origin}
                    isSearchMapOpenOnMobile={this.state.isSearchMapOpenOnMobile}
                    location={location}
                    listings={users || []}
                    onMapMoveEnd={this.onMapMoveEnd}
                    onCloseAsModal={() => {
                      onManageDisableScrolling('MapPage.map', false);
                    }}
                    messages={intl.messages}
                  />
                }
              </div>
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

MapPageComponent.defaultProps = {
  listings: [],
  mapListings: [],
  pagination: null,
  searchListingsError: null,
  searchParams: {},
  tab: 'listings',
  filterConfig: config.custom.filters,
  sortConfig: config.custom.sortConfig,
  activeListingId: null,
};

MapPageComponent.propTypes = {
  listings: array,
  mapListings: array,
  onActivateListing: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onSearchMapListings: func.isRequired,
  pagination: propTypes.pagination,
  scrollingDisabled: bool.isRequired,
  searchInProgress: bool.isRequired,
  searchListingsError: propTypes.error,
  searchParams: object,
  tab: oneOf(['filters', 'listings', 'map']).isRequired,
  filterConfig: propTypes.filterConfig,
  sortConfig: propTypes.sortConfig,

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
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
    activeListingId,
    userId,
  } = state.MapPage;

  const userMatches = getMarketplaceEntities(state, [{ type: 'user', id: userId }]);
  const user = userMatches.length === 1 ? userMatches[0] : null;

  return {
    users: [user],
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
  onSearchMapListings: searchParams => dispatch(searchMapListings(searchParams)),
  onActivateListing: listingId => dispatch(setActiveListing(listingId)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const MapPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(MapPageComponent);

MapPage.loadData = params => {
  const id = new UUID("5f52e761-e46d-4d51-b4f2-a8a4ef16f8b2");
  return loadData(id);
};

export default MapPage;

  // getGeoLocations(listings) {
  //   let locations = new Set;
  //   var x;
  //   var profile;
  //   for (x in listings) {
  //     profile = listings[x].author.attributes.profile;
  //     if (profile.publicData && profile.publicData.account == 'p' && profile.publicData.companyLocation) {
  //       locations.add(JSON.stringify({
  //         id: listings[x].author.id,
  //         attributes: {
  //           price: new Money(100, 'USD'),
  //           geolocation: {
  //             lat: profile.publicData.companyLocation.location.selectedPlace.origin.lat,
  //             lng: profile.publicData.companyLocation.location.selectedPlace.origin.lng
  //           },
  //           type: "seller",
  //         }
  //       }));
  //     }
  //   }
  //   let array = [];
  //   locations.forEach(v => array.push(JSON.parse(v)));
  //   return array;
  // }