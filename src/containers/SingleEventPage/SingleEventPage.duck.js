import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';

import { types as sdkTypes } from '../../util/sdkLoader';
import fetch from 'cross-fetch';

const eventsURL = " https://yxcapgxgcj.execute-api.us-west-1.amazonaws.com/prd/events";
const { UUID } = sdkTypes;
const RESULT_PAGE_SIZE = 48;
// ================ Action types ================ //

export const EVENT_SELLERS_REQUEST = 'app/SingleEventPage/UPDATE_SELLERS_REQUEST';
export const EVENT_SELLERS_SUCCESS = 'app/SingleEventPage/UPDATE_SELLERS_SUCCESS';
export const EVENT_SELLERS_ERROR = 'app/SingleEventPage/UPDATE_SELLERS_ERROR';

export const EVENT_DETAILS_REQUEST = 'app/SingleEventPage/EVENT_DETAILS_REQUEST';
export const EVENT_DETAILS_SUCCESS = 'app/SingleEventPage/EVENT_DETAILS_SUCCESS';
export const EVENT_DETAILS_ERROR = 'app/SingleEventPage/EVENT_DETAILS_ERROR';

export const SEARCH_LISTINGS_REQUEST = 'app/SingleEventPage/SEARCH_LISTINGS_REQUEST';
export const SEARCH_LISTINGS_SUCCESS = 'app/SingleEventPage/SEARCH_LISTINGS_SUCCESS';
export const SEARCH_LISTINGS_ERROR = 'app/SingleEventPage/SEARCH_LISTINGS_ERROR';

// ================ Reducer ================ //

const initialState = {
  updateSellersResponse: null,
  updateSellersError: null,
  updateSellersInProgress: false,
  userIds: null,
  userInProgress: false,
  userShowError: null,
  searchParams: null,
  searchInProgress: false,
  searchListingsError: null,
  currentPageResultIds: null,
  pagination: null,
};

const resultIds = data => data.data.map(l => l.id);

const SingleEventPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {

    case EVENT_SELLERS_REQUEST:
      return { ...state, userShowError: null, userIds: payload };
    case EVENT_SELLERS_SUCCESS:
      return state;
    case EVENT_SELLERS_ERROR:
      return { ...state, userShowError: payload };

    case EVENT_DETAILS_REQUEST:
      return { ...state, eventInfoInProgress: true };
    case EVENT_DETAILS_SUCCESS:
      return { ...state, eventInfoInProgress: false, eventDetails: payload };
    case EVENT_DETAILS_ERROR:
      return { ...state, eventInfoInProgress: false, };

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

    default:
      return state;
  }
};

export default SingleEventPageReducer;

// ================ Action creators ================ //

// Event sellers
export const showUserRequest = userIds => ({ type: EVENT_SELLERS_REQUEST, payload: userIds });
export const showUserSuccess = () => ({ type: EVENT_SELLERS_SUCCESS });
export const showUserError = e => ({ type: EVENT_SELLERS_ERROR, error: true, payload: e });

// Event details
export const eventDetailsRequest = () => ({ type: EVENT_DETAILS_REQUEST, payload: {} });
export const eventDetailsSuccess = data => ({ type: EVENT_DETAILS_SUCCESS, payload: data });
export const eventDetailsError = error => ({ type: EVENT_DETAILS_ERROR, payload: error.body, error: true });

export const searchListingsRequest = searchParams => ({ type: SEARCH_LISTINGS_REQUEST, payload: { searchParams }});
export const searchListingsSuccess = response => ({ type: SEARCH_LISTINGS_SUCCESS, payload: { data: response.data }});
export const searchListingsError = e => ({ type: SEARCH_LISTINGS_ERROR, error: true, payload: e });


export const searchListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchListingsRequest(searchParams));
  const { perPage, sort, keywords, ...rest } = searchParams;
  const params = {
    ...rest,
    per_page: perPage,
    // meta_ranking: "0,",
    meta_events: "5f99bfd4-f237-4d5d-afea-445aacef888f",
    // sort: "-meta_ranking"
  };

  return sdk.listings
    .query(params)
    .then(response => {
      console.log(response);
      dispatch(addMarketplaceEntities(response));
      dispatch(searchListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(searchListingsError(storableError(e)));
      throw e;
    });
};

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

const fetchEventDetails = (hostUUID) => (dispatch, getState, sdk) => {
  dispatch(eventDetailsRequest());
  const options = {
    method: 'GET',
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      // "X-Api-Key": KEY,
    }
  }

  fetch(eventsURL + "?uuid=" + hostUUID, options)
    .then(response => response.json())
    .then((res) => dispatch(eventDetailsSuccess(res.body[0])))
    .catch(() => console.log("Could not update database"));
}

export const loadData = (id) => (dispatch, getState, sdk) => {
  const searchParams = {
    page: 1,
    perPage: RESULT_PAGE_SIZE,
    include: ['author', 'images'],
    'fields.listing': ['title', 'geolocation', 'price', 'publicData.websiteLink', 'publicData.category'],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName',
      'profile.publicData.accountType', 'profile.publicData.tribe', 'profile.publicData.companyName', 'profile.publicData.companyIndustry'], //added metadata for verify badge
    'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
    'limit.images': 1,
  };
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
    dispatch(loadUsers(ids)),
    dispatch(fetchEventDetails(id)),
    dispatch(searchListings(searchParams))
    // })
  ]);
};