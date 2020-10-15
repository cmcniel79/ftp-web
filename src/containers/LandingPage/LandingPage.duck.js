import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { storableError } from '../../util/errors';

// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/LandingPage/SET_INITIAL_STATE';

export const QUERY_LISTINGS_REQUEST = 'app/LandingPage/QUERY_LISTINGS_REQUEST';
export const QUERY_LISTINGS_SUCCESS = 'app/LandingPage/QUERY_LISTINGS_SUCCESS';
export const QUERY_LISTINGS_ERROR = 'app/LandingPage/QUERY_LISTINGS_ERROR';

// ================ Reducer ================ //

const initialState = {
  userId: null,
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
  

// ================ Thunks ================ //

export const queryPromotedListings = queryParams => (dispatch, getState, sdk) => {
    dispatch(queryListingsRequest(queryParams));
    return sdk.listings
      .query({
        meta_promoted: true,
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
  

  export const loadData = userId => (dispatch, getState, sdk) => {
    // Clear state so that previously loaded data is not visible
    // in case this page load fails.
    dispatch(setInitialState());
  
    return Promise.all([
      dispatch(queryPromotedListings()),
    ]);
  };