import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { arrayOf, func, node, number, shape, string } from 'prop-types';
import differenceBy from 'lodash/differenceBy';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { types as sdkTypes } from '../../util/sdkLoader';
import { parse } from '../../util/urlHelpers';
import { propTypes } from '../../util/types';
import { ensureUser } from '../../util/data';
import { sdkBoundsToFixedCoordinates, hasSameSDKBounds } from '../../util/maps';
import {
  SearchMapSellerCard,
  SearchMapSellerLabel,
  SearchMapGroupLabel,
  SearchMapPlaceLabel,
} from '../../components';
import { groupedByCoordinates, reducedToArray } from './SearchMap.helpers.js';
import css from './SearchMapWithMapbox.module.css';
import arrowIcon from './Images/arrow.svg'

export const LABEL_HANDLE = 'SearchMapLabel';
export const INFO_CARD_HANDLE = 'SearchMapInfoCard';
export const SOURCE_AUTOCOMPLETE = 'autocomplete';
const BOUNDS_FIXED_PRECISION = 8;

const { LatLng: SDKLatLng, LatLngBounds: SDKLatLngBounds } = sdkTypes;
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const GEO_SOURCE_NAME = 'geoSource';
const NATIVE_SOURCE_NAME = 'native-place-names';

/**
 * Fit part of map (descriped with bounds) to visible map-viewport
 *
 * @param {Object} map - map that needs to be centered with given bounds
 * @param {SDK.LatLngBounds} bounds - the area that needs to be visible when map loads.
 */
export const fitMapToBounds = (map, bounds, options) => {
  const { padding = 0, isAutocompleteSearch = false } = options;

  // map bounds as string literal for google.maps
  const mapBounds = sdkBoundsToMapboxBounds(bounds);
  const paddingOptionMaybe = padding == null ? { padding } : {};
  const eventData = isAutocompleteSearch ? { searchSource: SOURCE_AUTOCOMPLETE } : {};

  // If bounds are given, use it (defaults to center & zoom).
  if (map && mapBounds) {
    map.fitBounds(mapBounds, { ...paddingOptionMaybe, linear: true, duration: 0 }, eventData);
  }
};

/**
 * Convert Mapbox formatted LatLng object to Sharetribe SDK's LatLng coordinate format
 * Longitudes > 180 and < -180 are converted to the correct corresponding value
 * between -180 and 180.
 *
 * @param {LngLat} mapboxLngLat - Mapbox LngLat
 *
 * @return {SDKLatLng} - Converted latLng coordinate
 */
export const mapboxLngLatToSDKLatLng = lngLat => {
  const mapboxLng = lngLat.lng;

  // For bounding boxes that overlap the antimeridian Mapbox sometimes gives
  // longitude values outside -180 and 180 degrees.Those values are converted
  // so that longitude is always between -180 and 180.
  const lng = mapboxLng > 180 ? mapboxLng - 360 : mapboxLng < -180 ? mapboxLng + 360 : mapboxLng;

  return new SDKLatLng(lngLat.lat, lng);
};

/**
 * Convert Mapbox formatted bounds object to Sharetribe SDK's bounds format
 *
 * @param {LngLatBounds} mapboxBounds - Mapbox LngLatBounds
 *
 * @return {SDKLatLngBounds} - Converted bounds
 */
export const mapboxBoundsToSDKBounds = mapboxBounds => {
  if (!mapboxBounds) {
    return null;
  }

  const ne = mapboxBounds.getNorthEast();
  const sw = mapboxBounds.getSouthWest();
  return new SDKLatLngBounds(mapboxLngLatToSDKLatLng(ne), mapboxLngLatToSDKLatLng(sw));
};

/**
 * Convert sdk bounds that overlap the antimeridian into values that can
 * be passed to Mapbox. This is achieved by converting the SW longitude into
 * a value less than -180 that flows over the antimeridian.
 *
 * @param {SDKLatLng} bounds - bounds passed to the map
 *
 * @return {LngLatBoundsLike} a bounding box that is compatible with Mapbox
 */
const sdkBoundsToMapboxBounds = bounds => {
  if (!bounds) {
    return null;
  }
  const { ne, sw } = bounds;

  // if sw lng is > ne lng => the bounds overlap antimeridian
  // => flip the nw lng to the negative side so that the value
  // is less than -180
  const swLng = sw.lng > ne.lng ? -360 + sw.lng : sw.lng;

  return [[swLng, sw.lat], [ne.lng, ne.lat]];
};

/**
 * Return map bounds as SDKBounds
 *
 * @param {Mapbox} map - Mapbox map from where the bounds are asked
 *
 * @return {SDKLatLngBounds} - Converted bounds of given map
 */
export const getMapBounds = map => mapboxBoundsToSDKBounds(map.getBounds());

/**
 * Return map center as SDKLatLng
 *
 * @param {Mapbox} map - Mapbox map from where the center is asked
 *
 * @return {SDKLatLng} - Converted center of given map
 */
export const getMapCenter = map => mapboxLngLatToSDKLatLng(map.getCenter());

/**
 * Check if map library is loaded
 */
export const isMapsLibLoaded = () =>
  typeof window !== 'undefined' && window.mapboxgl && window.mapboxgl.accessToken;

/**
 * Return price labels grouped by listing locations.
 * This is a helper function for SearchMapWithMapbox component.
 */
const priceLabelsInLocations = (
  users,
  infoCardOpen,
  onUserClicked,
  mapComponentRefreshToken
) => {
  const userArraysInLocations = reducedToArray(groupedByCoordinates(users));
  const priceLabels = userArraysInLocations.reverse().map(userArr => {

    // If location contains only one listing, print price label
    if (userArr.length === 1) {
      const user = userArr[0];
      const infoCardOpenIds = Array.isArray(infoCardOpen)
        ? infoCardOpen.map(l => l.id.uuid)
        : infoCardOpen
          ? [infoCardOpen.id.uuid]
          : [];

      // if the listing is open, don't print price label
      if (infoCardOpen != null && infoCardOpenIds.includes(user.id.uuid)) {
        return null;
      }

      // Explicit type change to object literal for Google OverlayViews (geolocation is SDK type)
      const geolocation = user.attributes.profile.publicData.companyLocation.location.selectedPlace.origin;
      const tribe = user.attributes.profile.publicData && user.attributes.profile.publicData.nativeLands ?
        user.attributes.profile.publicData.nativeLands : null;
      const industry = user.attributes.profile.publicData && user.attributes.profile.publicData.companyIndustry ?
        user.attributes.profile.publicData.companyIndustry : 'other';
      const accountType = user.attributes.profile.publicData && user.attributes.profile.publicData.accountType ?
        user.attributes.profile.publicData.accountType : null;
      const key = user.id.uuid;

      return {
        markerId: `user_${key}`,
        location: geolocation,
        type: 'user',
        tribe: tribe,
        industry: accountType === 'e' ? 'verified' : industry,
        componentProps: {
          key,
          className: LABEL_HANDLE,
          user,
          onUserClicked,
          mapComponentRefreshToken,
        },
      }
    }

    // Explicit type change to object literal for Google OverlayViews (geolocation is SDK type)
    const firstUser = ensureUser(userArr[0]);
    const geolocation = firstUser.attributes.profile.publicData.companyLocation.location.selectedPlace.origin;

    const key = userArr[0].id.uuid;
    return {
      markerId: `group_${key}`,
      location: geolocation,
      type: 'group',
      componentProps: {
        key,
        className: LABEL_HANDLE,
        users: userArr,
        onUserClicked,
        mapComponentRefreshToken,
      },
    };
  });
  return priceLabels;
};

/**
 * Return info card. This is a helper function for SearchMapWithMapbox component.
 */
const infoCardComponent = (
  infoCardOpen,
  onUserInfoCardClicked,
  createURLToProfile,
  mapComponentRefreshToken
) => {
  const usersArray = Array.isArray(infoCardOpen) ? infoCardOpen : [infoCardOpen];

  if (!infoCardOpen) {
    return null;
  }

  const firstUser = ensureUser(usersArray[0]);
  const key = firstUser.id.uuid;
  const geolocation = firstUser.attributes.profile.publicData.companyLocation.location.selectedPlace.origin;
  const type = firstUser.type ? firstUser.type : null;

  return {
    markerId: `infoCard_${key}`,
    location: geolocation,
    componentProps: {
      key,
      mapComponentRefreshToken,
      className: INFO_CARD_HANDLE,
      users: usersArray,
      onUserInfoCardClicked,
      createURLToProfile,
      type: type,
    },
  };
};

/**
 * SearchMap component using Mapbox as map provider
 */
class SearchMapWithMapbox extends Component {
  constructor(props) {
    super(props);
    this.map = typeof window !== 'undefined' && window.mapboxMap ? window.mapboxMap : null;
    this.currentMarkers = [];
    this.currentInfoCard = null;
    this.state = { mapContainer: null, isMapReady: false };
    this.viewportBounds = null;
    this.popup = new mapboxgl.Popup({
      maxWidth: 'none',
      closeButton: false,
      closeOnClick: true,
      anchor: 'bottom',
      className: css.popupContainer,
    });

    this.onMount = this.onMount.bind(this);
    this.onMoveend = this.onMoveend.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
    this.handleDoubleClickOnInfoCard = this.handleDoubleClickOnInfoCard.bind(this);
    this.handleMobilePinchZoom = this.handleMobilePinchZoom.bind(this);
    this.addPopup = this.addPopup.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.bounds, this.props.bounds)) {
      // If no mapSearch url parameter is given, this is original location search
      const { mapSearch } = parse(this.props.location.search, {
        latlng: ['origin'],
        latlngBounds: ['bounds'],
      });
      if (!mapSearch) {
        this.viewportBounds = null;
      }
    }

    if (this.map) {
      const currentBounds = getMapBounds(this.map);

      // Do not call fitMapToBounds if bounds are the same.
      // Our bounds are viewport bounds, and fitBounds will try to add margins around those bounds
      // that would result to zoom-loop (bound change -> fitmap -> bounds change -> ...)
      if (!isEqual(this.props.bounds, currentBounds) && !this.viewportBounds) {
        fitMapToBounds(this.map, this.props.bounds, { padding: 0, isAutocompleteSearch: true });
      }
    }

    if (!this.map && this.state.mapContainer) {
      this.initializeMap();

      /* Notify parent component that Mapbox map is loaded */
      this.props.onMapLoad(this.map);
    } else if (prevProps.mapComponentRefreshToken !== this.props.mapComponentRefreshToken) {
      /* Notify parent component that Mapbox map is loaded */
      this.props.onMapLoad(this.map);
    }
  }

  componentWillUnmount() {
    if (this.currentInfoCard) {
      this.currentInfoCard.markerContainer.removeEventListener(
        'dblclick',
        this.handleDoubleClickOnInfoCard
      );
    }
    document.removeEventListener('gesturestart', this.handleMobilePinchZoom, false);
    document.removeEventListener('gesturechange', this.handleMobilePinchZoom, false);
    document.removeEventListener('gestureend', this.handleMobilePinchZoom, false);
  }

  onMount(element) {
    // This prevents pinch zoom to affect whole page on mobile Safari.
    document.addEventListener('gesturestart', this.handleMobilePinchZoom, false);
    document.addEventListener('gesturechange', this.handleMobilePinchZoom, false);
    document.addEventListener('gestureend', this.handleMobilePinchZoom, false);

    this.setState({ mapContainer: element });
  }

  onMoveend(e) {
    if (this.map) {
      // If reusableMapHiddenHandle is given and parent element has that class,
      // we don't listen moveend events.
      // This fixes mobile Chrome bug that sends map events to invisible map components.
      const isHiddenByReusableMap =
        this.props.reusableMapHiddenHandle &&
        this.state.mapContainer.parentElement.classList.contains(
          this.props.reusableMapHiddenHandle
        );
      if (!isHiddenByReusableMap) {
        const viewportMapBounds = getMapBounds(this.map);
        const viewportMapCenter = getMapCenter(this.map);
        const viewportBounds = sdkBoundsToFixedCoordinates(
          viewportMapBounds,
          BOUNDS_FIXED_PRECISION
        );

        // ViewportBounds from (previous) rendering differ from viewportBounds currently set to map
        // I.e. user has changed the map somehow: moved, panned, zoomed, resized
        const viewportBoundsChanged =
          this.viewportBounds && !hasSameSDKBounds(this.viewportBounds, viewportBounds);

        this.props.onMapMoveEnd(viewportBoundsChanged, { viewportBounds, viewportMapCenter });
        this.viewportBounds = viewportBounds;
      }
    }
  }

  initializeMap() {
    const { offsetHeight, offsetWidth } = this.state.mapContainer;
    const hasDimensions = offsetHeight > 0 && offsetWidth > 0;
    if (hasDimensions) {
      this.map = new window.mapboxgl.Map({
        container: this.state.mapContainer,
        style: 'mapbox://styles/cmcniel79/cklztcfzf7f2g17o1kj6tvr84',
        accessToken: MAPBOX_TOKEN
      });
      window.mapboxMap = this.map;

      var nav = new window.mapboxgl.NavigationControl({ showCompass: false });
      this.map.addControl(nav, 'top-left');

      this.map.on('moveend', this.onMoveend);

      // Introduce rerendering after map is ready (to include labels),
      // but keep the map out of state life cycle.
      this.setState({ isMapReady: true });
    }
  }

  handleMobilePinchZoom(e) {
    e.preventDefault();
    // A hack to prevent pinch zoom gesture in mobile Safari
    // Otherwise, pinch zoom would zoom both map and the document.
    document.body.style.zoom = 0.99;
  }

  handleDoubleClickOnInfoCard(e) {
    e.stopPropagation();
  }

  addPopup(e, isTouchEvent) {
    const coordinates = e.features[0].geometry ? e.features[0].geometry.coordinates : [e.lngLat.lng, e.lngLat.lat];
    const popupContainer = document.createElement('div');
    popupContainer.setAttribute('id', 'nativePlacesPopup');

    const label = (
      <SearchMapPlaceLabel event={e} coordinates={coordinates} isTouchEvent={isTouchEvent} />
    );

    ReactDOM.render(label, popupContainer);

    this.popup
      .setDOMContent(popupContainer)
      .setLngLat(coordinates)
      .addTo(this.map);
  }

  render() {
    const {
      className,
      users,
      infoCardOpen,
      onUserClicked,
      onUserInfoCardClicked,
      createURLToProfile,
      mapComponentRefreshToken,
      selectedIndustry,
      selectedTribe,
      geometry,
      showNativePlaces
    } = this.props;

    if (this.map) {

      // Remove the native-lands polygon map layer & source
      if (typeof this.map.getLayer(GEO_SOURCE_NAME) !== 'undefined') {
        this.map.removeLayer(GEO_SOURCE_NAME).removeSource(GEO_SOURCE_NAME);
      }

      if (geometry) {
        // Add the native-lands polygon map layer & source if user has selected a tribe
        this.map.addSource(GEO_SOURCE_NAME, {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': geometry
          }
        });
        this.map.addLayer({
          'id': GEO_SOURCE_NAME,
          'type': 'fill',
          'source': GEO_SOURCE_NAME,
          'layout': {},
          'paint': {
            'fill-color': '#d40000',
            'fill-opacity': .3
          }
        });
      }

      // Show or hide the native place nammes' map source based on user input
      if (!showNativePlaces && typeof this.map.getLayer(NATIVE_SOURCE_NAME) !== 'undefined') {
        this.map.setLayoutProperty(NATIVE_SOURCE_NAME, 'visibility', 'none');
      } else if (showNativePlaces && typeof this.map.getLayer(NATIVE_SOURCE_NAME) !== 'undefined') {
        this.map.setLayoutProperty(NATIVE_SOURCE_NAME, 'visibility', 'visible');
      };

      // Add the popup when mouse enters a feature on the native place names' map source
      this.map.on('mouseenter', NATIVE_SOURCE_NAME, e => {
        this.addPopup(e, false);
      });

      // Remove popup on click
      this.map.on('click', NATIVE_SOURCE_NAME, () => {
        this.popup.remove();
      });

      // Create markers out of price labels and grouped labels
      const labels = priceLabelsInLocations(
        users,
        infoCardOpen,
        onUserClicked,
        mapComponentRefreshToken
      );

      // If map has moved or info card opened, unnecessary markers need to be removed
      const removableMarkers = differenceBy(this.currentMarkers, labels, 'markerId');
      removableMarkers.forEach(rm => rm.marker.remove());

      // Helper function to create markers to given container
      const createMarker = (data, markerContainer) =>
        new window.mapboxgl.Marker(markerContainer, { anchor: 'bottom' })
          .setLngLat([data.location.lng, data.location.lat])
          .addTo(this.map);

      // SearchMapPriceLabel and SearchMapGroupLabel:
      // create a new marker or use existing one if markerId is among previously rendered markers
      this.currentMarkers = labels
        .filter(v => v != null)
        .filter(l => selectedIndustry === null || l.industry === selectedIndustry)
        .filter(l => selectedTribe === null || l.tribe === selectedTribe)
        .map(m => {
          const existingMarkerId = this.currentMarkers.findIndex(
            marker => m.markerId === marker.markerId && marker.marker
          );

          if (existingMarkerId >= 0) {
            const { marker, markerContainer, ...rest } = this.currentMarkers[existingMarkerId];
            return { ...rest, ...m, markerContainer, marker };
          } else {
            const markerContainer = document.createElement('div');
            markerContainer.setAttribute('id', m.markerId);
            markerContainer.classList.add(css.labelContainer);
            const marker = createMarker(m, markerContainer);
            return { ...m, markerContainer, marker };
          }
        });

      /* Create marker for SearchMapInfoCard component */
      if (infoCardOpen) {
        const infoCard = infoCardComponent(
          infoCardOpen,
          onUserInfoCardClicked,
          createURLToProfile,
          mapComponentRefreshToken
        );

        // marker container and its styles
        const infoCardContainer = document.createElement('div');
        infoCardContainer.setAttribute('id', infoCard.markerId);
        infoCardContainer.classList.add(css.infoCardContainer);
        infoCardContainer.addEventListener('dblclick', this.handleDoubleClickOnInfoCard, false);
        this.currentInfoCard = {
          ...infoCard,
          markerContainer: infoCardContainer,
          marker: infoCard ? createMarker(infoCard, infoCardContainer) : null,
        };
      } else {
        if (this.currentInfoCard) {
          this.currentInfoCard.markerContainer.removeEventListener(
            'dblclick',
            this.handleDoubleClickOnInfoCard
          );
        }
        this.currentInfoCard = null;
      }
    }

    return (
      <div
        id="map"
        ref={this.onMount}
        className={classNames(className, css.fullArea)}
        onClick={this.props.onClick}
      >
        {this.currentMarkers.map(m => {
          // Remove existing activeLabel classes and add it only to the correct container
          m.markerContainer.classList.remove(css.activeLabel);

          const isMapReadyForMarkers = this.map && m.markerContainer;
          // DOM node that should be used as portal's root
          const portalDOMContainer = isMapReadyForMarkers
            ? document.getElementById(m.markerContainer.id)
            : null;

          // Create component portals for correct marker containers
          if (isMapReadyForMarkers && m.type === 'user') {
            return ReactDOM.createPortal(
              <SearchMapSellerLabel {...m.componentProps} />,
              portalDOMContainer
            );
          } else if (isMapReadyForMarkers && m.type === 'group') {
            return ReactDOM.createPortal(
              <SearchMapGroupLabel {...m.componentProps} />,
              portalDOMContainer
            );
          }
          return null;
        })}
        {this.state.mapContainer && this.currentInfoCard &&
          this.currentInfoCard.componentProps && this.currentInfoCard.componentProps.type === 'user'
          ? ReactDOM.createPortal(
            <SearchMapSellerCard {...this.currentInfoCard.componentProps} />,
            this.currentInfoCard.markerContainer
          ) : null}
        <a href={window.location.href + "#header"} className={css.topButton}>
          <img className={css.icon} src={arrowIcon} alt="arrowIcon" />
        </a>
      </div>
    );
  }
}

SearchMapWithMapbox.defaultProps = {
  center: null,
  priceLabels: [],
  infoCard: null,
  zoom: 11,
  reusableMapHiddenHandle: null,
};

SearchMapWithMapbox.propTypes = {
  center: propTypes.latlng,
  location: shape({
    search: string.isRequired,
  }).isRequired,
  priceLabels: arrayOf(node),
  infoCard: node,
  onClick: func.isRequired,
  onMapMoveEnd: func.isRequired,
  onMapLoad: func.isRequired,
  zoom: number,
  reusableMapHiddenHandle: string,
};

export default SearchMapWithMapbox;
