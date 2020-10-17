import unionWith from 'lodash/unionWith';
import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';

import {
  FETCH_PRODUCTS_BEGIN,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  fetchProducts
} from "./actionHelper";
// import 'cross-fetch/polyfill';

// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/MapPage/SET_INITIAL_STATE';

export const SEARCH_MAP_LISTINGS_REQUEST = 'app/MapPage/SEARCH_MAP_LISTINGS_REQUEST';
export const SEARCH_MAP_LISTINGS_SUCCESS = 'app/MapPage/SEARCH_MAP_LISTINGS_SUCCESS';
export const SEARCH_MAP_LISTINGS_ERROR = 'app/MapPage/SEARCH_MAP_LISTINGS_ERROR';

export const SHOW_USER_REQUEST = 'app/MapPage/SHOW_USER_REQUEST';
export const SHOW_USER_SUCCESS = 'app/MapPage/SHOW_USER_SUCCESS';
export const SHOW_USER_ERROR = 'app/MapPage/SHOW_USER_ERROR';

export const SEARCH_MAP_SET_ACTIVE_LISTING = 'app/MapPage/SEARCH_MAP_SET_ACTIVE_LISTING';

// ================ Reducer ================ //

const initialState = {
  pagination: null,
  searchParams: null,
  searchInProgress: false,
  searchListingsError: null,
  currentPageResultIds: [],
  searchMapListingIds: [],
  searchMapListingsError: null,
  userId: null,
};

const resultIds = data => data.data.map(l => l.id);

const mapPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_STATE:
      return { ...initialState };
    case SHOW_USER_REQUEST:
      return { ...state, userShowError: null, userId: payload.userId };
    case SHOW_USER_SUCCESS:
      return state;
    case SHOW_USER_ERROR:
      return { ...state, userShowError: payload };

    case SEARCH_MAP_LISTINGS_REQUEST:
      return {
        ...state,
        searchMapListingsError: null,
      };
    case SEARCH_MAP_LISTINGS_SUCCESS: {
      const searchMapListingIds = unionWith(
        state.searchMapListingIds,
        resultIds(payload.data),
        (id1, id2) => id1.uuid === id2.uuid
      );
      return {
        ...state,
        searchMapListingIds,
      };
    }
    case SEARCH_MAP_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchMapListingsError: payload };

    case SEARCH_MAP_SET_ACTIVE_LISTING:
      return {
        ...state,
        activeListingId: payload,
      };
    case FETCH_PRODUCTS_BEGIN:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PRODUCTS_SUCCESS:
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      return {
        ...state,
        loading: false,
        items: action.payload.products
      };

    case FETCH_PRODUCTS_FAILURE:
      // The request failed, but it did stop, so set loading to "false".
      // Save the error, and we can display it somewhere
      // Since it failed, we don't have items to display anymore, so set it empty.
      // This is up to you and your app though: maybe you want to keep the items
      // around! Do whatever seems right.
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };
    default:
      return state;
  }
};

export default mapPageReducer;

// ================ Action creators ================ //

export const setInitialState = () => ({
  type: SET_INITIAL_STATE,
});

export const searchMapListingsRequest = () => ({ 
  type: SEARCH_MAP_LISTINGS_REQUEST 
});

export const searchMapListingsSuccess = response => ({
  type: SEARCH_MAP_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const searchMapListingsError = e => ({
  type: SEARCH_MAP_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const showUserRequest = userId => ({
  type: SHOW_USER_REQUEST,
  payload: { userId },
});

export const showUserSuccess = () => ({
  type: SHOW_USER_SUCCESS,
});

export const showUserError = e => ({
  type: SHOW_USER_ERROR,
  error: true,
  payload: e,
});

export const setActiveListing = listingId => ({
  type: SEARCH_MAP_SET_ACTIVE_LISTING,
  payload: listingId,
});

export const searchMapListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchMapListingsRequest(searchParams));

  const { perPage, ...rest } = searchParams;
  const params = {
    ...rest,
    per_page: perPage,
  };

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(searchMapListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(searchMapListingsError(storableError(e)));
      throw e;
    });
};

export const loadUsers = userId => (dispatch, getState, sdk) => {
  console.log(userId);
  dispatch(showUserRequest(userId));
  return sdk.users
    .show({
      id: userId,
      include: ['profileImage', 'publicData'],
      'fields.image': ['variants.square-small', 'variants.square-small2x'],
    })
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(showUserSuccess());
      return response;
    })
    .catch(e => dispatch(showUserError(storableError(e))));
};

export const loadData = userId => (dispatch, getState, sdk) => {
  // Clear state so that previously loaded data is not visible
  // in case this page load fails.
  dispatch(setInitialState());

  return Promise.all([
    dispatch(fetchProducts())
      .then(id => {
        dispatch(loadUsers(id));
      })
  ]);
};