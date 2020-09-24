import { updatedEntities, denormalisedEntities } from '../../util/data';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { storableError } from '../../util/errors';

// ================ Action types ================ //

export const FETCH_LISTINGS_REQUEST = 'app/LikedListingsPage/FETCH_LISTINGS_REQUEST';
export const FETCH_LISTINGS_SUCCESS = 'app/LikedListingsPage/FETCH_LISTINGS_SUCCESS';
export const FETCH_LISTINGS_ERROR = 'app/LikedListingsPage/FETCH_LISTINGS_ERROR';

export const ADD_OWN_ENTITIES = 'app/LikedListingsPage/ADD_OWN_ENTITIES';

// ================ Reducer ================ //

const initialState = {
    pagination: null,
    queryParams: null,
    queryInProgress: false,
    queryListingsError: null,
    currentPageResultIds: [],
    ownEntities: {},
};

const resultIds = data => data.data.map(l => l.id);

const merge = (state, sdkResponse) => {
    const apiResponse = sdkResponse.data;
    return {
        ...state,
        ownEntities: updatedEntities({ ...state.ownEntities }, apiResponse),
    };
};

const likedListingsPageReducer = (state = initialState, action = {}) => {
    const { type, payload } = action;
    switch (type) {
        case FETCH_LISTINGS_REQUEST:
            return {
                ...state,
                queryParams: payload.queryParams,
                queryInProgress: true,
                queryListingsError: null,
                currentPageResultIds: [],
            };
        case FETCH_LISTINGS_SUCCESS:
            return {
                ...state,
                currentPageResultIds: payload.listingRefs,
                // pagination: payload.data.meta,
                queryInProgress: false,
            };
        case FETCH_LISTINGS_ERROR:
            // eslint-disable-next-line no-console
            console.error(payload);
            return { ...state, queryInProgress: false, queryListingsError: payload };

        case ADD_OWN_ENTITIES:
            return merge(state, payload);

        default:
            return state;
    }
};

export default likedListingsPageReducer;

// ================ Action creators ================ //

// This works the same way as addMarketplaceEntities,
// but we don't want to mix own listings with searched listings
// (own listings data contains different info - e.g. exact location etc.)
export const addOwnEntities = sdkResponse => ({
    type: ADD_OWN_ENTITIES,
    payload: sdkResponse,
});

export const queryListingsRequest = queryParams => ({
    type: FETCH_LISTINGS_REQUEST,
    payload: { queryParams },
});

export const queryListingsSuccess = listingRefs => ({
    type: FETCH_LISTINGS_SUCCESS,
    payload: { listingRefs },
});

export const queryListingsError = e => ({
    type: FETCH_LISTINGS_ERROR,
    error: true,
    payload: e,
});

export const updateLikedListings = actionPayload => {
    return (dispatch, getState, sdk) => {
    //   dispatch(updateProfileRequest());
  
      const queryParams = {
        expand: true,
      };
  
      return sdk.currentUser
        .updateProfile(actionPayload, queryParams)
        // .then(response => {
        //   dispatch(updateProfileSuccess(response));
  
        //   const entities = denormalisedResponseEntities(response);
        //   if (entities.length !== 1) {
        //     throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
        //   }
        //   const currentUser = entities[0];
  
          // Update current user in state.user.currentUser through user.duck.js
        //   dispatch(currentUserShowSuccess(currentUser));
        // })
        // .catch(e => dispatch(updateProfileError(storableError(e))));
    };
  };


// Throwing error for new (loadData may need that info)
export const queryLikedListings = queryParams => (dispatch, getState, sdk) => {
    dispatch(queryListingsRequest(queryParams));

    const { perPage, ...rest } = queryParams;
    const params = { ...rest, per_page: perPage };

    return sdk.currentUser.show()
        .then(response => {
            // Pick only the id and type properties from the response listings
            const likedListingIds = response.data.data.attributes.profile.privateData.likedListings ?
                response.data.data.attributes.profile.privateData.likedListings.map(l =>
                    ({ _sdkType: "UUID", uuid: l.uuid }))
                : null;
            if (likedListingIds) {
                dispatch(queryListingsSuccess(likedListingIds));
                return (likedListingIds.map(like => 
                    sdk.listings.show({
                    id: like.uuid,
                    include: ['images'],
                    'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
                })
                    .then(response => {
                        dispatch(addMarketplaceEntities(response));
                    })
                    .catch(e => {
                        dispatch(queryListingsError(storableError(e)));
                    })
                ))
            }
        })
        .catch(e => {
            dispatch(queryListingsError(storableError(e)));
            throw e;
        });
};

