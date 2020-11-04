import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { convertUnitToSubUnit, unitDivisor } from '../../util/currency';
import { formatDateStringToUTC, getExclusiveEndDate } from '../../util/dates';
import config from '../../config';
import { denormalisedResponseEntities } from '../../util/data';
import { currentUserShowSuccess } from '../../ducks/user.duck';

// ================ Action types ================ //

export const SEARCH_LISTINGS_REQUEST = 'app/SearchPage/SEARCH_LISTINGS_REQUEST';
export const SEARCH_LISTINGS_SUCCESS = 'app/SearchPage/SEARCH_LISTINGS_SUCCESS';
export const SEARCH_LISTINGS_ERROR = 'app/SearchPage/SEARCH_LISTINGS_ERROR';

export const SEARCH_MAP_SET_ACTIVE_LISTING = 'app/SearchPage/SEARCH_MAP_SET_ACTIVE_LISTING';

export const UPDATE_PROFILE_REQUEST = 'app/ProfileSettingsPage/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'app/ProfileSettingsPage/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_ERROR = 'app/ProfileSettingsPage/UPDATE_PROFILE_ERROR';

// ================ Reducer ================ //

const initialState = {
  pagination: null,
  searchParams: null,
  searchInProgress: false,
  searchListingsError: null,
  currentPageResultIds: [],
};

const resultIds = data => data.data.map(l => l.id);

const listingPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_LISTINGS_REQUEST:
      return {
        ...state,
        searchParams: payload.searchParams,
        searchInProgress: true,
        searchListingsError: null,
      };
    case SEARCH_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        searchInProgress: false,
      };
    case SEARCH_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);  
      return { ...state, searchInProgress: false, searchListingsError: payload };

    case SEARCH_MAP_SET_ACTIVE_LISTING:
      return {
        ...state,
        activeListingId: payload,
      };
    default:
      return state;
  }
};

export default listingPageReducer;

// ================ Action creators ================ //

export const updateProfileRequest = params => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: { params },
});
export const updateProfileSuccess = result => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: result.data,
});
export const updateProfileError = error => ({
  type: UPDATE_PROFILE_ERROR,
  payload: error,
  error: true,
});

export const searchListingsRequest = searchParams => ({
  type: SEARCH_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const searchListingsSuccess = response => ({
  type: SEARCH_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const searchListingsError = e => ({
  type: SEARCH_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const searchListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchListingsRequest(searchParams));
  const priceSearchParams = priceParam => {
    const inSubunits = value =>
      convertUnitToSubUnit(value, unitDivisor(config.currencyConfig.currency));
    const values = priceParam ? priceParam.split(',') : [];
    return priceParam && values.length === 2
      ? {
        price: [inSubunits(values[0]), inSubunits(values[1]) + 1].join(','),
      }
      : {};
  };

  const datesSearchParams = datesParam => {
    const values = datesParam ? datesParam.split(',') : [];
    const hasValues = datesParam && values.length === 2;
    const startDate = hasValues ? values[0] : null;
    const isNightlyBooking = config.bookingUnitType === 'line-item/night';
    const endDate =
      hasValues && isNightlyBooking ? values[1] : hasValues ? getExclusiveEndDate(values[1]) : null;

    return hasValues
      ? {
        start: formatDateStringToUTC(startDate),
        end: formatDateStringToUTC(endDate),
        // Availability can be full or partial. Default value is full.
        availability: 'full',
      }
      : {};
  };

  const { perPage, price, dates, ...rest } = searchParams;
  const priceMaybe = priceSearchParams(price);
  const datesMaybe = datesSearchParams(dates);

  const params = {
    ...rest,
    ...priceMaybe,
    ...datesMaybe,
    per_page: perPage,
    meta_ranking: "0,",
    sort: "-meta_ranking"
  };

  console.log(params);

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(searchListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(searchListingsError(storableError(e)));
      throw e;
    });
};

export const setActiveListing = listingId => ({
  type: SEARCH_MAP_SET_ACTIVE_LISTING,
  payload: listingId,
});

export const updateLikedListings = actionPayload => {
  return (dispatch, getState, sdk) => {
    dispatch(updateProfileRequest());

    const queryParams = {
      expand: true,
    };

    return sdk.currentUser
      .updateProfile(actionPayload, queryParams)
      .then(response => {
        dispatch(updateProfileSuccess(response));

        const entities = denormalisedResponseEntities(response);
        if (entities.length !== 1) {
          throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
        }
        const currentUser = entities[0];

        // Update current user in state.user.currentUser through user.duck.js
        dispatch(currentUserShowSuccess(currentUser));
      })
      .catch(e => dispatch(updateProfileError(storableError(e))));
  };
};
