import React, { Component } from 'react';
import { array, bool, func, oneOf, object, shape, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';
// import NativeMapsJSON from '../../assets/NativeMapsJSON.json';
import config from '../../config';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString, pathByRouteName } from '../../util/routes';
import { parse } from '../../util/urlHelpers';
import { propTypes } from '../../util/types';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { findOptionsForSelectFilter } from '../../util/search';
import facebookImage from '../../assets/map_square_400x400.png';
import twitterImage from '../../assets/map_square_400x400.png';
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
  Button
} from '../../components';
import { TopbarContainer } from '../../containers';

import { loadData } from './MapPage.duck';
import {
  pickSearchParamsOnly,
  validFilterParams,
} from './MapPage.helpers';
import { MapLegend } from './MapLegend';
import { types as sdkTypes } from '../../util/sdkLoader';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';

import css from './MapPage.module.css';


const { LatLng, LatLngBounds } = sdkTypes;

const SEARCH_WITH_MAP_DEBOUNCE = 300; // Little bit of debounce before search is initiated.

export class MapPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearchMapOpenOnMobile: props.tab === 'map',
      industry: null,
      tribe: null,
      origin: null,
      bounds: new LatLngBounds(new LatLng(71.4202919997506, -5), new LatLng(10, -150)),
      geometry: null,
      showNativePlaces: true,
    };

    this.searchMapListingsInProgress = false;
    this.tribe = null;
    this.onMapMoveEnd = debounce(this.onMapMoveEnd.bind(this), SEARCH_WITH_MAP_DEBOUNCE);
    this.selectTribe = this.selectTribe.bind(this);
    this.selectIndustry = this.selectIndustry.bind(this);
    this.initialValues = this.initialValues.bind(this);
    this.setGeolocation = this.setGeolocation.bind(this);
    this.selectGeometry = this.selectGeometry.bind(this);
    this.toggleNativeMaps = this.toggleNativeMaps.bind(this);
  }

  componentDidMount() {
    if (window) {
      this.props.onLoadData();
    }
  }

  selectTribe(value) {
    this.setState({ tribe: value['pub_nativeLands'] });
  }

  selectIndustry(value) {
    this.setState({ industry: value });
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

  selectGeometry(geo) {
    this.setState({ geometry: geo });
  }

  toggleNativeMaps() {
    this.setState(prevState => ({
      showNativePlaces: !prevState.showNativePlaces
    })
    )
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

    // const onMapIconClick = () => {
    //   this.useLocationSearchBounds = true;
    //   this.setState({ isSearchMapOpenOnMobile: true });
    // };

    const title = intl.formatMessage(
      { id: 'MapPage.schemaTitle' },
    );
    const description = intl.formatMessage(
      { id: 'MapPage.schemaDescription' },
    );

    const schemaImage = `${config.canonicalRootURL}${facebookImage}`;
    // N.B. openMobileMap button is sticky.
    // For some reason, stickyness doesn't work on Safari, if the element is <button>
    // /* eslint-disable jsx-a11y/no-static-element-interactions */

    const faqLink = <ExternalLink href={'https://www.fromthepeople.co/faq#account-types'}> <FormattedMessage id="MapPage.faqLink" /> </ExternalLink>;
    const industryOptions = findOptionsForSelectFilter('industry', filterConfig);
    const nativePlacesButtonClasses = this.state.showNativePlaces ? css.nativePlacesSelected : css.nativePlaces;
    // const jsonLink = (
    //   <ExternalLink href={`data:application/json,${JSON.stringify(NativeMapsJSON)}`}>
    //       here
    //   </ExternalLink>
    // );

    return (
      <Page
        scrollingDisabled={scrollingDisabled}
        description={description}
        title={title}
        facebookImages={[{ url: facebookImage, width: 300, height: 300 }]}
        twitterImages={[
          { url: `${config.canonicalRootURL}${twitterImage}`, width: 300, height: 300 },
        ]}
        schema={{
          '@context': 'http://schema.org',
          '@type': 'ItemPage',
          description: description,
          name: title,
          image: [schemaImage],
        }}
      >
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer
              className={css.topbar}
              currentPage="MapPage"
              currentSearchParams={urlQueryParams}
            />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div className={css.container}>
              <div className={css.pageHeading} id='header'>
                <div className={css.desktopPanel}>
                  <NativeLand
                    onSelect={this.selectTribe}
                    initialValues={this.initialValues}
                    setGeolocation={this.setGeolocation}
                    onMapPage={true}
                    selectGeometry={this.selectGeometry}
                  />
                  <Button className={nativePlacesButtonClasses} onClick={() => this.toggleNativeMaps()}>
                    {this.state.showNativePlaces ? (
                      <FormattedMessage id="MapPage.hideNative" />
                    ) : (
                      <FormattedMessage id="MapPage.showNative" />
                    )}
                  </Button>
                  <MapLegend className={css.desktopLegend} options={industryOptions} onSelect={this.selectIndustry} selected={this.state.industry} />
                </div>
                <h5 className={css.pageSubtitleDesktop}>
                  <FormattedMessage id="MapPage.subtitle1" values={{ faqLink }} />
                  {/* <br />
                  <br />
                  <FormattedMessage id="MapPage.subtitle2" values={{ jsonLink }}/> */}
                </h5>
                <div className={css.mobileButtons}>
                  <NativeLand
                    onSelect={this.selectTribe}
                    initialValues={this.initialValues}
                    setGeolocation={this.setGeolocation}
                    onMapPage={true}
                    selectGeometry={this.selectGeometry}
                  />
                  <Button className={nativePlacesButtonClasses} onClick={() => this.toggleNativeMaps()}>
                    {this.state.showNativePlaces ? (
                      <FormattedMessage id="MapPage.hideNative" />
                    ) : (
                      <FormattedMessage id="MapPage.showNative" />
                    )}
                  </Button>
                  <MapLegend
                    className={css.mobileLegend}
                    options={industryOptions}
                    onSelect={this.selectIndustry}
                    selected={this.state.industry}
                  />
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
                  geometry={this.state.geometry}
                  showNativePlaces={this.state.showNativePlaces}
                />
              </div>
              <h5 className={css.pageSubtitleMobile}>
                <FormattedMessage id="MapPage.subtitle1" values={{ faqLink }} />
              </h5>
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
    // /* eslint-enable jsx-a11y/no-static-element-interactions */
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
  const users = userIds && userIds.length > 0 ? getMarketplaceEntities(state, userIds) : null;
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
  onLoadData: () => dispatch(loadData()),
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

export default MapPage;