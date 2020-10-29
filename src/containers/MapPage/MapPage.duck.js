import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';

import { types as sdkTypes } from '../../util/sdkLoader';
import fetch from 'cross-fetch';

const { UUID } = sdkTypes;
// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/MapPage/SET_INITIAL_STATE';

export const SHOW_USER_REQUEST = 'app/MapPage/SHOW_USER_REQUEST';
export const SHOW_USER_SUCCESS = 'app/MapPage/SHOW_USER_SUCCESS';
export const SHOW_USER_ERROR = 'app/MapPage/SHOW_USER_ERROR';

export const FETCH_PRODUCTS_BEGIN = "FETCH_PRODUCTS_BEGIN";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

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
  userIds: [],
};

const resultIds = data => data.data.map(l => l.id);

const mapPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_STATE:
      return { ...initialState };

    case SHOW_USER_REQUEST:
      return { ...state, userShowError: null, userIds: payload };
    case SHOW_USER_SUCCESS:
      return state;
    case SHOW_USER_ERROR:
      return { ...state, userShowError: payload };

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

export const showUserRequest = userIds => ({
  type: SHOW_USER_REQUEST,
  payload: userIds,
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

export const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

export const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products }
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: { error }
});


export const loadUsers = userIds => (dispatch, getState, sdk) => {
  dispatch(showUserRequest(userIds));
  console.log(userIds);
  if (userIds) {
    userIds.map(userId => {
      return sdk.users
        .show({
          id: userId.id,
          include: ['profileImage', 'publicData'],
          'fields.image': ['variants.square-small', 'variants.square-small2x'],
        })
        .then(response => {
          dispatch(addMarketplaceEntities(response));
        })
        .catch(e => dispatch(showUserError(storableError(e))));
    });
  }
  dispatch(showUserSuccess());
};

function getProducts() {
  return fetch("https://vyvhifh63b.execute-api.us-west-1.amazonaws.com/prd")
    .then(handleErrors)
    .then(res => res.json())
}

export function fetchProducts() {
  return dispatch => {
    dispatch(fetchProductsBegin());
    return getProducts()
      .then(json => {
        console.log(json);
        dispatch(fetchProductsSuccess(json));
        let ids = [];
        ids.push({ type: 'user', id: new UUID(json.body[0].uuid) });
        ids.push({ type: 'user', id: new UUID("5f99bfd4-f237-4d5d-afea-445aacef888f") });
        return ids;
      })
      .catch(error =>
        dispatch(fetchProductsFailure(error))
      );
  };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const loadData = () => (dispatch, getState, sdk) => {
  // Clear state so that previously loaded data is not visible
  // in case this page load fails.
  dispatch(setInitialState());
  return Promise.all([
    dispatch(fetchProducts())
      .then(ids => {
        console.log(ids);
        dispatch(loadUsers(ids));
      })
  ]);
};