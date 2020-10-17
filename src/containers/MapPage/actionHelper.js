import { types as sdkTypes } from '../../util/sdkLoader';
import 'cross-fetch/polyfill';
const { UUID } = sdkTypes;


function getProducts() {
    return fetch("https://vmr5zmv3gg.execute-api.us-west-1.amazonaws.com/prd")
        .then(handleErrors)
        .then(res => res.json())
}

export function fetchProducts() {
    return dispatch => {
        dispatch(fetchProductsBegin());
        return getProducts()
            .then(json => {
                dispatch(fetchProductsSuccess(json));
                let id = new UUID(json.body[0].uuid);
                return id;
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

export const FETCH_PRODUCTS_BEGIN = "FETCH_PRODUCTS_BEGIN";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

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
