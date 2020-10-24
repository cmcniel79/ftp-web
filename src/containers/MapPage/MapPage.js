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
  SearchMapUsers,
  Page,
  LayoutWrapperFooter,
  Footer,
  LayoutSingleColumn,
  LayoutWrapperMain,
  LayoutWrapperTopbar,
  ExternalLink,
  NativeLand,
  SelectSingleFilter,
  Modal
} from '../../components';
import { TopbarContainer } from '../../containers';

import { loadData } from './MapPage.duck';
import {
  pickSearchParamsOnly,
  validFilterParams,
} from './MapPage.helpers';
import css from './MapPage.css';
import { MapLegend } from './MapLegend';
import { types as sdkTypes } from '../../util/sdkLoader';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';



const { LatLng, LatLngBounds } = sdkTypes;

const SEARCH_WITH_MAP_DEBOUNCE = 300; // Little bit of debounce before search is initiated.

export class MapPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearchMapOpenOnMobile: props.tab === 'map',
      isMobileModalOpen: false,
      industry: null,
      tribe: null,
      origin: null,
      bounds: new LatLngBounds(new LatLng(71.4202919997506, -66.8847646185949), new LatLng(10, -150)),
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

    const faqLink = <ExternalLink href={'http://localhost:3000/faq#accountTypes'}> <FormattedMessage id="MapPage.faqLink" /> </ExternalLink>;
    const industryOptions = findOptionsForSelectFilter('industry', filterConfig);
    const modal =
      <Modal
        id="MapPageFilters"
        containerClassName={css.modalContainer}
        isOpen={this.state.isMobileModalOpen}
        onClose={() => this.setState({ isMobileModalOpen: false })}
        usePortal
        onManageDisableScrolling={() => null}
      >
        <h2 className={css.modalHeading}>
          <FormattedMessage id="MapPage.modalTitle" />
        </h2>
        <SelectSingleFilter
          className={css.industryFilter}
          queryParamNames={['pub_industry']}
          initialValues={this.initialValues()}
          showAsPopup={false}
          onSelect={this.selectIndustry}
          label="Industry"
          options={industryOptions}
        />
        <MapLegend options={industryOptions} />
      </Modal>;

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
              <div className={css.pageHeading} id='header'>
                <div className={css.desktopPanel}>
                  <SelectSingleFilter
                    className={css.industryFilter}
                    queryParamNames={['pub_industry']}
                    initialValues={this.initialValues()}
                    showAsPopup={true}
                    onSelect={this.selectIndustry}
                    label="Industry"
                    options={industryOptions}
                  />
                  <NativeLand
                    onSelect={this.selectTribe}
                    initialValues={this.initialValues}
                    setGeolocation={this.setGeolocation}
                    onMapPage={true}
                  />
                  <MapLegend options={industryOptions} />
                </div>
                <h5 className={css.pageSubtitle}>
                  <FormattedMessage id="MapPage.subtitle" values={{ faqLink }} />
                </h5>
                <div className={css.mobileButtons}>
                  <button
                    className={css.filtersButton}
                    onClick={() => this.setState({ isMobileModalOpen: true })}
                  >
                    Filters
                </button>
                  <NativeLand
                    onSelect={this.selectTribe}
                    initialValues={this.initialValues}
                    setGeolocation={this.setGeolocation}
                    onMapPage={true}
                  />
                  {modal}
                </div>
              </div>
              <div className={css.mapWrapper}>
                  <SearchMapUsers
                    reusableContainerClassName={css.map}
                    bounds={this.state.bounds}
                    center={this.state.origin}
                    isSearchMapOpenOnMobile={this.state.isSearchMapOpenOnMobile}
                    location={location}
                    users={users}
                    onMapMoveEnd={this.onMapMoveEnd}
                    onCloseAsModal={() => {
                      onManageDisableScrolling('MapPage.map', false);
                    }}
                    messages={intl.messages}
                    selectedIndustry={this.state.industry}
                    selectedTribe={this.state.tribe}
                  />
              </div>
              <a href="http://localhost:3000/map#header">
                  <button className={css.topButton}>
                    Go back to top
                  </button>
                  </a>
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
};

MapPageComponent.propTypes = {
  listings: array,
  mapListings: array,
  onManageDisableScrolling: func.isRequired,
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
    userIds,
  } = state.MapPage;
  const users = userIds.length > 0 ? getMarketplaceEntities(state, userIds) : null;

  return {
    users: users,
    pagination,
    scrollingDisabled: isScrollingDisabled(state),
    searchInProgress,
    searchListingsError,
    searchParams,
  };
};


const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
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
  // const id = new UUID("5f52e761-e46d-4d51-b4f2-a8a4ef16f8b2");
  return loadData();
};

export default MapPage;