import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';

import { types as sdkTypes } from '../../util/sdkLoader';
import fetch from 'cross-fetch';

const KEY = process.env.REACT_APP_API_KEY;
const ENV = process.env.REACT_APP_ENV === "production" ? "prd" : "dev";
const BASE_URL = process.env.REACT_APP_API_DATABASE;

const { UUID } = sdkTypes;
// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/MapPage/SET_INITIAL_STATE';

export const SHOW_USER_REQUEST = 'app/MapPage/SHOW_USER_REQUEST';
export const SHOW_USER_SUCCESS = 'app/MapPage/SHOW_USER_SUCCESS';
export const SHOW_USER_ERROR = 'app/MapPage/SHOW_USER_ERROR';

export const FETCH_UUIDS_BEGIN = "FETCH_UUIDS_BEGIN";
export const FETCH_UUIDS_SUCCESS = "FETCH_UUIDS_SUCCESS";
export const FETCH_UUIDS_FAILURE = "FETCH_UUIDS_FAILURE";

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


export const loadUsers = (userIds) => (dispatch, getState, sdk) => {
  if (userIds && userIds.length > 0) {
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
  const url = BASE_URL + ENV + "?type=map";
  const options = {
    method: 'GET',
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": KEY,
    }
  }
  return fetch(url, options)
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
  return Promise.all([
    dispatch(fetchUUIDs())
      .then(ids => {
        dispatch(loadUsers(ids));
      })
  ]);
};