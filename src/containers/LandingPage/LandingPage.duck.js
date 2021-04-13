import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { storableError } from '../../util/errors';
import { types as sdkTypes } from '../../util/sdkLoader';
import fetch from 'cross-fetch';

const { UUID } = sdkTypes;

// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/LandingPage/SET_INITIAL_STATE';

export const QUERY_LISTINGS_REQUEST = 'app/LandingPage/QUERY_LISTINGS_REQUEST';
export const QUERY_LISTINGS_SUCCESS = 'app/LandingPage/QUERY_LISTINGS_SUCCESS';
export const QUERY_LISTINGS_ERROR = 'app/LandingPage/QUERY_LISTINGS_ERROR';

export const SHOW_USER_REQUEST = 'app/ProfilePage/SHOW_USER_REQUEST';
export const SHOW_USER_SUCCESS = 'app/ProfilePage/SHOW_USER_SUCCESS';
export const SHOW_USER_ERROR = 'app/ProfilePage/SHOW_USER_ERROR';

export const FETCH_UUIDS_BEGIN = "FETCH_UUIDS_BEGIN";
export const FETCH_UUIDS_SUCCESS = "FETCH_UUIDS_SUCCESS";
export const FETCH_UUIDS_FAILURE = "FETCH_UUIDS_FAILURE";

// ================ Reducer ================ //

const initialState = {
  userIds: null,
  promotedListingRefs: [],
  queryListingsError: null,
};

export default function landingPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_STATE:
      return { ...initialState };
    case QUERY_LISTINGS_REQUEST:
      return {
        ...state,

        // Empty listings only when user id changes
        promotedListingRefs: payload.userId === state.userId ? state.promotedListingRefs : [],

        queryListingsError: null,
      };
    case QUERY_LISTINGS_SUCCESS:
      return { ...state, promotedListingRefs: payload.listingRefs };
    case QUERY_LISTINGS_ERROR:
      return { ...state, promotedListingRefs: [], queryListingsError: payload };
    case SHOW_USER_REQUEST:
      return { ...state, userShowError: null, userIds: payload.userIds };
    case SHOW_USER_SUCCESS:
      return state;
    case SHOW_USER_ERROR:
      return { ...state, userShowError: payload };

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
}

// ================ Action creators ================ //

export const setInitialState = () => ({
  type: SET_INITIAL_STATE,
});

export const queryListingsRequest = userId => ({
  type: QUERY_LISTINGS_REQUEST,
  payload: { userId },
});

export const queryListingsSuccess = listingRefs => ({
  type: QUERY_LISTINGS_SUCCESS,
  payload: { listingRefs },
});

export const queryListingsError = e => ({
  type: QUERY_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const showUserRequest = userIds => ({
  type: SHOW_USER_REQUEST,
  payload: { userIds },
});

export const showUserSuccess = () => ({
  type: SHOW_USER_SUCCESS,
});

export const showUserError = e => ({
  type: SHOW_USER_ERROR,
  error: true,
  payload: e,
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

// ================ Thunks ================ //

export const queryPromotedListings = queryParams => (dispatch, getState, sdk) => {
  dispatch(queryListingsRequest(queryParams));
  return sdk.listings
    .query({
      meta_promoted: true,
      meta_ranking: "0,",
      sort: "-meta_ranking",
      include: ['author', 'images'],
      'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
    })
    .then(response => {
      // Pick only the id and type properties from the response listings
      const listingRefs = response.data.data.map(l => l.id);
      dispatch(addMarketplaceEntities(response));
      dispatch(queryListingsSuccess(listingRefs));
      return response;
    })
    .catch(e => dispatch(queryListingsError(storableError(e))));
};

export const loadFeaturedPartners = ids => (dispatch, getState, sdk) => {
  dispatch(showUserRequest(ids));
  if (ids && ids.length > 0) {
    ids.map(id => {
      return sdk.users
        .show({
          id: id.id,
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
    dispatch(showUserSuccess());
  }
};

function callAPI() {
  return fetch("https://vyvhifh63b.execute-api.us-west-1.amazonaws.com/prd?type=featured")
    .then(handleErrors)
    .then(res => res.json())
    .then(data => {
      return data.body.map(userId => {
        return { type: 'user', id: new UUID(userId.uuid) }
      })
    })
}

function fetchFeaturedUUIDs() {
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


export const loadData = () => dispatch => {
  // Clear state so that previously loaded data is not visible
  // in case this page load fails.
  dispatch(setInitialState());
  return Promise.all([
    dispatch(fetchFeaturedUUIDs())
      .then(ids => {
        dispatch(loadFeaturedPartners(ids));
      }),
    dispatch(queryPromotedListings())
  ]);
};