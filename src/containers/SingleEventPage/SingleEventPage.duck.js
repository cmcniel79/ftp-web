import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { parse } from '../../util/urlHelpers';

import fetch from 'cross-fetch';

const RESULT_PAGE_SIZE = 48;
const EVENTS_URL = process.env.REACT_APP_API_EVENTS + 'prd/events';
const KEY = process.env.REACT_APP_API_KEY;

// ================ Action types ================ //

export const EVENT_DETAILS_REQUEST = 'app/SingleEventPage/EVENT_DETAILS_REQUEST';
export const EVENT_DETAILS_SUCCESS = 'app/SingleEventPage/EVENT_DETAILS_SUCCESS';
export const EVENT_DETAILS_ERROR = 'app/SingleEventPage/EVENT_DETAILS_ERROR';

export const SEARCH_LISTINGS_REQUEST = 'app/SingleEventPage/SEARCH_LISTINGS_REQUEST';
export const SEARCH_LISTINGS_SUCCESS = 'app/SingleEventPage/SEARCH_LISTINGS_SUCCESS';
export const SEARCH_LISTINGS_ERROR = 'app/SingleEventPage/SEARCH_LISTINGS_ERROR';

// ================ Reducer ================ //

const initialState = {
  eventInfoInProgress: false,
  eventDetails: null,
  eventInfoError: null,
  searchListingsInProgress: false,
  searchListingsError: null,
  currentPageResultIds: [],
  pagination: null,
};

const resultIds = data => data.data.map(l => l.id);

const SingleEventPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {

    case EVENT_DETAILS_REQUEST:
      return { ...state, eventInfoInProgress: true };
    case EVENT_DETAILS_SUCCESS:
      return { ...state, eventInfoInProgress: false, eventDetails: payload };
    case EVENT_DETAILS_ERROR:
      return { ...state, eventInfoInProgress: false, eventInfoError: payload };

    case SEARCH_LISTINGS_REQUEST:
      return { ...state, searchListingsInProgress: true, searchListingsError: null };
    case SEARCH_LISTINGS_SUCCESS:
      return { ...state, currentPageResultIds: resultIds(payload.data), pagination: payload.data.meta, searchListingsInProgress: false };
    case SEARCH_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      return { ...state, searchListingsInProgress: false, searchListingsError: payload };

    default:
      return state;
  }
};

export default SingleEventPageReducer;

// ================ Action creators ================ //

// Event details
export const eventDetailsRequest = () => ({ type: EVENT_DETAILS_REQUEST, payload: {} });
export const eventDetailsSuccess = data => ({ type: EVENT_DETAILS_SUCCESS, payload: data });
export const eventDetailsError = error => ({ type: EVENT_DETAILS_ERROR, payload: error, error: true });

export const searchListingsRequest = searchParams => ({ type: SEARCH_LISTINGS_REQUEST, payload: { searchParams } });
export const searchListingsSuccess = response => ({ type: SEARCH_LISTINGS_SUCCESS, payload: { data: response.data } });
export const searchListingsError = e => ({ type: SEARCH_LISTINGS_ERROR, error: true, payload: e });

export const searchListings = (searchParams, id) => (dispatch, getState, sdk) => {
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

  const { perPage, price, dates, sort, keywords, ...rest } = searchParams;
  const priceMaybe = priceSearchParams(price);
  const params = {
    ...rest,
    ...priceMaybe,
    per_page: perPage,
    meta_ranking: "0,",
    meta_events: id,
    sort: "-meta_ranking",
    keywords: keywords,
    sort: (keywords ? null : sort ? sort : "-meta_ranking")
  };

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

const fetchEventDetails = (hostUUID) => (dispatch, getState, sdk) => {
  dispatch(eventDetailsRequest());
  const options = {
    method: 'GET',
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": KEY,
    }
  }
  const url = EVENTS_URL + "?uuid=" + hostUUID;
  fetch(url, options)
    .then(response => response.json())
    .then((res) => dispatch(eventDetailsSuccess(res.body[0][0])))
    .catch(() => dispatch(eventDetailsError("Could Not Get Event Details")));
}

export const loadData = (params, search) => dispatch  => {
  
  const queryId = params.id;
  const queryParams = parse(search, {
    latlng: ['origin'],
    latlngBounds: ['bounds'],
  });

  const { page = 1, address, origin, ...rest } = queryParams;
  const searchParams = {
    ...rest,
    page,
    perPage: RESULT_PAGE_SIZE,
    include: ['author', 'images'],
    'fields.listing': ['title', 'geolocation', 'price', 'publicData.websiteLink', 'publicData.category'],
    'fields.user': [
      //added metadata for verify badge
      'profile.displayName', 
      'profile.abbreviatedName',
      'profile.publicData.accountType', 
      'profile.publicData.tribe',
      'profile.publicData.companyName',
       'profile.publicData.companyIndustry'
    ],
    'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
    'limit.images': 1,
  };
  return Promise.all([
    dispatch(searchListings(searchParams, queryId)),
    dispatch(fetchEventDetails(queryId)),
  ]);
};