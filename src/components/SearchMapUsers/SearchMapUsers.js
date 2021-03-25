import React, { Component } from 'react';
import { arrayOf, func, number, string, shape, object } from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';
import { propTypes } from '../../util/types';
// import { obfuscatedCoordinates } from '../../util/maps';
import config from '../../config';

import { hasParentWithClassName } from './SearchMap.helpers.js';
import SearchMapWithMapbox, {
  LABEL_HANDLE,
  INFO_CARD_HANDLE,
  getMapBounds,
  getMapCenter,
  fitMapToBounds,
  isMapsLibLoaded,
} from './SearchMapWithMapbox';
import ReusableMapContainer from './ReusableMapContainer';
import css from './SearchMap.module.css';

const REUSABLE_MAP_HIDDEN_HANDLE = 'reusableMapHidden';

// const withCoordinatesObfuscated = users => {
//   return users.map(user => {
//     const { id, attributes, ...rest } = user;
//     const origGeolocation = attributes.geolocation;
//     const cacheKey = id ? `${id.uuid}_${origGeolocation.lat}_${origGeolocation.lng}` : null;
//     const geolocation = obfuscatedCoordinates(origGeolocation, cacheKey);
//     return {
//       id,
//       ...rest,
//       attributes: {
//         ...attributes,
//         geolocation,
//       },
//     };
//   });
// };

export class SearchMapUsersComponent extends Component {
  constructor(props) {
    super(props);

    this.users = [];
    this.mapRef = null;

    let mapReattachmentCount = 0;

    if (typeof window !== 'undefined') {
      if (window.mapReattachmentCount) {
        mapReattachmentCount = window.mapReattachmentCount;
      } else {
        window.mapReattachmentCount = 0;
      }
    }

    this.state = { infoCardOpen: null, mapReattachmentCount };

    this.createURLToProfile = this.createURLToProfile.bind(this);
    this.onUserInfoCardClicked = this.onUserInfoCardClicked.bind(this);
    this.onUserClicked = this.onUserClicked.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.onMapLoadHandler = this.onMapLoadHandler.bind(this);
  }

  componentWillUnmount() {
    this.users = [];
  }

  createURLToProfile(user) {
    const routes = routeConfiguration();

    const id = user.id.uuid;
    const pathParams = { id, slug: null };

    return createResourceLocatorString('ProfilePage', routes, pathParams, {});
  }

  onUserClicked(users) {
    this.setState({ infoCardOpen: users });
  }

  onUserInfoCardClicked(user) {
    if (this.props.onCloseAsModal) {
      this.props.onCloseAsModal();
    }

    // To avoid full page refresh we need to use internal router
    const history = this.props.history;
    history.push(this.createURLToProfile(user));
  }

  onMapClicked(e) {
    // Close open listing popup / infobox, unless the click is attached to a price label
    const labelClicked = hasParentWithClassName(e.nativeEvent.target, LABEL_HANDLE);
    const infoCardClicked = hasParentWithClassName(e.nativeEvent.target, INFO_CARD_HANDLE);
    if (this.state.infoCardOpen != null && !labelClicked && !infoCardClicked) {
      this.setState({ infoCardOpen: null });
    }
  }

  onMapLoadHandler(map) {
    this.mapRef = map;

    if (this.mapRef && this.state.mapReattachmentCount === 0) {
      // map is ready, let's fit search area's bounds to map's viewport
      fitMapToBounds(this.mapRef, this.props.bounds, { padding: 0, isAutocompleteSearch: true });
    }
  }

  render() {
    const {
      className,
      rootClassName,
      reusableContainerClassName,
      bounds,
      center,
      location,
      users,
      onMapMoveEnd,
      zoom,
      // mapsConfig,
      messages,
      selectedIndustry,
      selectedTribe,
      geometry,
      showNativePlaces
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    const usersWithLocation = users ? users.filter(u => !!(u.attributes.profile.publicData.companyLocation && u.attributes.profile.publicData.companyLocation.location
      && u.attributes.profile.publicData.companyLocation.location.selectedPlace && u.attributes.profile.publicData.companyLocation.location.selectedPlace.origin)) : null;

    // const users = mapsConfig.fuzzy.enabled
    //   ? withCoordinatesObfuscated(usersWithLocation)
    //   : usersWithLocation;
    const infoCardOpen = this.state.infoCardOpen;

    const forceUpdateHandler = () => {
      // Update global reattachement count
      window.mapReattachmentCount += 1;
      // Initiate rerendering
      this.setState({ mapReattachmentCount: window.mapReattachmentCount });
    };

    return isMapsLibLoaded() ? (
      <ReusableMapContainer
        className={reusableContainerClassName}
        reusableMapHiddenHandle={REUSABLE_MAP_HIDDEN_HANDLE}
        onReattach={forceUpdateHandler}
        messages={messages}
      >
        <SearchMapWithMapbox
          className={classes}
          bounds={bounds}
          center={center}
          location={location}
          infoCardOpen={infoCardOpen}
          users={usersWithLocation}
          mapComponentRefreshToken={this.state.mapReattachmentCount}
          createURLToProfile={this.createURLToProfile}
          onUserClicked={this.onUserClicked}
          onUserInfoCardClicked={this.onUserInfoCardClicked}
          onMapLoad={this.onMapLoadHandler}
          onClick={this.onMapClicked}
          onMapMoveEnd={onMapMoveEnd}
          zoom={zoom}
          reusableMapHiddenHandle={REUSABLE_MAP_HIDDEN_HANDLE}
          selectedIndustry={selectedIndustry}
          selectedTribe={selectedTribe}
          geometry={geometry}
          showNativePlaces={showNativePlaces}
        />
      </ReusableMapContainer>
    ) : (
      <div className={classes} />
    );
  }
}

SearchMapUsersComponent.defaultProps = {
  className: null,
  rootClassName: null,
  mapRootClassName: null,
  reusableContainerClassName: null,
  bounds: null,
  center: null,
  users: [],
  onCloseAsModal: null,
  zoom: 11,
  mapsConfig: config.maps,
};

SearchMapUsersComponent.propTypes = {
  className: string,
  rootClassName: string,
  mapRootClassName: string,
  reusableContainerClassName: string,
  bounds: propTypes.latlngBounds,
  center: propTypes.latlng,
  location: shape({
    search: string.isRequired,
  }).isRequired,
  users: arrayOf(propTypes.user),
  onCloseAsModal: func,
  onMapMoveEnd: func.isRequired,
  zoom: number,
  mapsConfig: object,
  messages: object.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

const SearchMapUsers = withRouter(SearchMapUsersComponent);

SearchMapUsers.getMapBounds = getMapBounds;
SearchMapUsers.getMapCenter = getMapCenter;

export default SearchMapUsers;
