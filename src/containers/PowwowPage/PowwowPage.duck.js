import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';

import { types as sdkTypes } from '../../util/sdkLoader';
import fetch from 'cross-fetch';

const { UUID } = sdkTypes;
// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/PowwowPage/SET_INITIAL_STATE';

export const SHOW_USER_REQUEST = 'app/PowwowPage/SHOW_USER_REQUEST';
export const SHOW_USER_SUCCESS = 'app/PowwowPage/SHOW_USER_SUCCESS';
export const SHOW_USER_ERROR = 'app/PowwowPage/SHOW_USER_ERROR';

export const FETCH_UUIDS_BEGIN = "FETCH_UUIDS_BEGIN";
export const FETCH_UUIDS_SUCCESS = "FETCH_UUIDS_SUCCESS";
export const FETCH_UUIDS_FAILURE = "FETCH_UUIDS_FAILURE";

export const SEARCH_MAP_SET_ACTIVE_LISTING = 'app/PowwowPage/SEARCH_MAP_SET_ACTIVE_LISTING';

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


const powwowPageReducer = (state = initialState, action = {}) => {
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

    case FETCH_UUIDS_BEGIN:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_UUIDS_SUCCESS:
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      return {
        ...state,
        loading: false,
        items: action.payload.uuids
      };

    case FETCH_UUIDS_FAILURE:
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

export default powwowPageReducer;

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

export const fetchUUIDsBegin = () => ({
  type: FETCH_UUIDS_BEGIN
});

export const fetchUUIDsSuccess = uuids => ({
  type: FETCH_UUIDS_SUCCESS,
  payload: { uuids }
});

export const fetchUUIDsFailure = error => ({
  type: FETCH_UUIDS_FAILURE,
  payload: { error }
});


export const loadUsers = userIds => (dispatch, getState, sdk) => {
  if (userIds.length > 0) {
    dispatch(showUserRequest(userIds));
    userIds.map(userId => {
      return sdk.users
        .show({
          id: userId.id.uuid,
          include: ['profileImage', 'publicData'],
          'fields.image': ['variants.square-small', 'variants.square-small2x'],
        })
        .then(response => {
          dispatch(addMarketplaceEntities(response));
        })
        .catch(e => {
          dispatch(showUserError(storableError(e)
          ))
        });
    });
  }
  dispatch(showUserSuccess());
};

function callAPI() {
  return fetch("https://vyvhifh63b.execute-api.us-west-1.amazonaws.com/prd?type=map")
    .then(handleErrors)
    .then(res => res.json())
    .then(data => {
      return data.body.map(userId => {
        return { type: 'user', id: new UUID(userId.uuid) }
      })
    })
}

function fetchUUIDs() {
  return dispatch => {
    dispatch(fetchUUIDsBegin());
    return callAPI()
      .catch(error =>
        dispatch(fetchUUIDsFailure(error))
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
  const ids = [
    { type: 'user', id: new UUID("5f99d32d-0925-4712-94a8-5482c98f565d") },
    { type: 'user', id: new UUID("5f99bfd4-f237-4d5d-afea-445aacef888f") },
    { type: 'user', id: new UUID("5fa0da90-af2e-4273-8dea-5580d591e568") },
    { type: 'user', id: new UUID("5fa42dbd-3d9c-4909-9a36-29ad941d9e0b") },
    // { type: 'user', id: new UUID("") },
  ];
  return Promise.all([
    // dispatch(fetchUUIDs())
      // .then(ids => {
        dispatch(loadUsers(ids))
      // })
  ]);
};