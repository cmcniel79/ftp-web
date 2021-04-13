import {
    updatedEntities,
    denormalisedResponseEntities
} from '../../util/data';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { storableError } from '../../util/errors';
import { types as sdkTypes } from '../../util/sdkLoader';
import { currentUserShowSuccess } from '../../ducks/user.duck'

const KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_API_LIKES;
const { UUID } = sdkTypes;


// ================ Action types ================ //

export const FETCH_LISTINGS_REQUEST = 'app/LikedListingsPage/FETCH_LISTINGS_REQUEST';
export const FETCH_LIKE_IDS = 'app/LikedListingsPage/FETCH_LIKE_IDS';
export const FETCH_LISTINGS_SUCCESS = 'app/LikedListingsPage/FETCH_LISTINGS_SUCCESS';
export const FETCH_LISTINGS_ERROR = 'app/LikedListingsPage/FETCH_LISTINGS_ERROR';

export const ADD_OWN_ENTITIES = 'app/LikedListingsPage/ADD_OWN_ENTITIES';

// ================ Reducer ================ //

const initialState = {
    pagination: null,
    queryParams: null,
    queryInProgress: false,
    queryListingsError: null,
    likedIds: [],
    ownEntities: {},
};

// const resultIds = data => data.data.map(l => l.id);

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
                queryInProgress: true,
                queryListingsError: null,
            };
        case FETCH_LIKE_IDS:
            return {
                ...state,
                likedIds: payload.listingsRefs,
            };
        case FETCH_LISTINGS_SUCCESS:
            return {
                ...state,
                queryInProgress: false,
            };
        case FETCH_LISTINGS_ERROR:
            // eslint-disable-next-line no-console
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

export const queryListingsRequest = () => ({
    type: FETCH_LISTINGS_REQUEST,
    payload: {},
});

export const queryLikeIds = listingsRefs => ({
    type: FETCH_LIKE_IDS,
    payload: { listingsRefs },
});

export const queryListingsSuccess = () => ({
    type: FETCH_LISTINGS_SUCCESS,
    payload: {},
});

export const queryListingsError = e => ({
    type: FETCH_LISTINGS_ERROR,
    error: true,
    payload: e,
});

export const sendUpdatedLikes = actionPayload => {
    return (dispatch, getState, sdk) => {
        const queryParams = {
            expand: true,
        };

        return sdk.currentUser
            .updateProfile(actionPayload, queryParams)
            .then(response => {
            const entities = denormalisedResponseEntities(response);
            if (entities.length !== 1) {
                throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
            }
            const currentUser = entities[0];

            // Update current user in state.user.currentUser through user.duck.js
            dispatch(currentUserShowSuccess(currentUser));
        })
        .catch(e => console.log(e));
    };
};

export const queryLikedListings = () => (dispatch, getState, sdk) => {
    dispatch(queryListingsRequest());

    return sdk.currentUser.show()
        .then(response => {
            // Pick only the id and type properties from the response listings
            const likedListingIds = response.data.data.attributes.profile.privateData.likes ?
                response.data.data.attributes.profile.privateData.likes : null;
            if (likedListingIds && likedListingIds.length > 0) {
                dispatch(queryLikeIds(likedListingIds.reverse().map(l => ({ type: 'listing', id: new UUID(l) }))));
                return (likedListingIds.map(like =>
                    sdk.listings.show({
                        id: like,
                        include: ['images'],
                        'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
                    })
                        .then(response => {
                            console.log(response);
                            dispatch(addMarketplaceEntities(response));
                        })
                        .catch(e => {
                            dispatch(console.log(e));
                        })
                ))
            }
        })
        .then(() => {
            dispatch(queryListingsSuccess());
        })
        .catch(e => {
            dispatch(queryListingsError(storableError(e)));
            throw e;
        });
};

export const callLikeAPI = actionPayload => {
    const options = {
      method: 'POST',
      withCredentials: false,
      body: JSON.stringify(actionPayload),
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": KEY,
      }
    }
    fetch(URL, options)
      .then(response => {
        response.json();
      })
      .catch(e => console.log(e));
};

export const loadData = () => {
    return queryLikedListings();
}