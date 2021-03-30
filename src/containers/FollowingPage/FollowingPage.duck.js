import {
    updatedEntities,
    // denormalisedEntities 
} from '../../util/data';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { storableError } from '../../util/errors';
import { types as sdkTypes } from '../../util/sdkLoader';
import { denormalisedResponseEntities } from '../../util/data';
import { currentUserShowSuccess } from '../../ducks/user.duck';


// ================ Action types ================ //

export const FETCH_FOLLOWED_REQUEST = 'app/FollowingPage/FETCH_FOLLOWED_REQUEST';
export const FETCH_FOLLOWED_IDS = 'app/FollowingPage/FETCH_FOLLOWED_IDS';
export const FETCH_FOLLOWED_SUCCESS = 'app/FollowingPage/FETCH_FOLLOWED_SUCCESS';
export const FETCH_FOLLOWED_ERROR = 'app/FollowingPage/FETCH_FOLLOWED_ERROR';

export const ADD_OWN_ENTITIES = 'app/FollowingPage/ADD_OWN_ENTITIES';

const { UUID } = sdkTypes;
const KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_API_LIKES;

// ================ Reducer ================ //

const initialState = {
    pagination: null,
    queryParams: null,
    queryInProgress: false,
    queryFollowedError: null,
    followedIds: [],
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

const followingPageReducer = (state = initialState, action = {}) => {
    const { type, payload } = action;
    switch (type) {
        case FETCH_FOLLOWED_REQUEST:
            return {
                ...state,
                queryInProgress: true,
                queryFollowedError: null,
            };
        case FETCH_FOLLOWED_IDS:
            return {
                ...state,
                followedIds: payload.sellerRefs,
            };
        case FETCH_FOLLOWED_SUCCESS:
            return {
                ...state,
                queryInProgress: false,
            };
        case FETCH_FOLLOWED_ERROR:
            // eslint-disable-next-line no-console
            console.error(payload);
            return { ...state, queryInProgress: false, queryFollowedError: payload };

        case ADD_OWN_ENTITIES:
            return merge(state, payload);

        default:
            return state;
    }
};

export default followingPageReducer;

// ================ Action creators ================ //

// This works the same way as addMarketplaceEntities,
// but we don't want to mix own listings with searched listings
// (own listings data contains different info - e.g. exact location etc.)
export const addOwnEntities = sdkResponse => ({
    type: ADD_OWN_ENTITIES,
    payload: sdkResponse,
});

export const queryFollowedRequest = () => ({
    type: FETCH_FOLLOWED_REQUEST,
    payload: {},
});

export const queryFollowedIds = sellerRefs => ({
    type: FETCH_FOLLOWED_IDS,
    payload: { sellerRefs },
});

export const queryFollowedSuccess = () => ({
    type: FETCH_FOLLOWED_SUCCESS,
    payload: {},
});

export const queryFollowedError = e => ({
    type: FETCH_FOLLOWED_ERROR,
    error: true,
    payload: e,
});

// Throwing error for new (loadData may need that info)
export const queryFollowed = () => (dispatch, getState, sdk) => {
    dispatch(queryFollowedRequest());
    
    return sdk.currentUser.show()
        .then(response => {
            // Pick only the id and type properties from the response listings
            const followedIds = response.data.data.attributes.profile.privateData.followed ?
                response.data.data.attributes.profile.privateData.followed : null;
            if (followedIds && followedIds.length > 0) {
                dispatch(queryFollowedIds(followedIds.reverse().map(l => ({ type: 'user', id: new UUID(l) }))));
                return (followedIds.map(follow =>
                    sdk.users.show({
                        id: follow,
                        include: ['profileImage', 'publicData'],
                        'fields.image': ['variants.square-small', 'variants.square-small2x'],
                    })
                        .then(response => {
                            dispatch(addMarketplaceEntities(response));
                        })
                        .catch(e => {
                            dispatch(console.log(e));
                        })
                ))
            }
        })
        .then(() => {
            dispatch(queryFollowedSuccess())
        })
        .catch(e => {
            dispatch(queryFollowedError(storableError(e)));
            throw e;
        });
};

export const sendUpdatedFollowed = actionPayload => {
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

export const callFollowAPI = actionPayload => {
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
    return queryFollowed();
  };