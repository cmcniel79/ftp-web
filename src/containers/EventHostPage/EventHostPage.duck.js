import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { currentUserShowSuccess } from '../../ducks/user.duck';

const eventsURL = " https://yxcapgxgcj.execute-api.us-west-1.amazonaws.com/prd/events";

// ================ Action types ================ //

export const UPLOAD_IMAGE_REQUEST = 'app/EventHostPage/UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'app/EventHostPage/UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_ERROR = 'app/EventHostPage/UPLOAD_IMAGE_ERROR';

export const UPDATE_SELLERS_REQUEST = 'app/EventHostPage/UPDATE_SELLERS_REQUEST';
export const UPDATE_SELLERS_SUCCESS = 'app/EventHostPage/UPDATE_SELLERS_SUCCESS';
export const UPDATE_SELLERS_ERROR = 'app/EventHostPage/UPDATE_SELLERS_ERROR';

export const EVENT_DETAILS_REQUEST = 'app/EventHostPage/EVENT_DETAILS_REQUEST';
export const EVENT_DETAILS_SUCCESS = 'app/EventHostPage/EVENT_DETAILS_SUCCESS';
export const EVENT_DETAILS_ERROR = 'app/EventHostPage/EVENT_DETAILS_ERROR';


// ================ Reducer ================ //

const initialState = {
  image: null,
  uploadImageError: null,
  uploadInProgress: false,
  updateSellersResponse: null,
  updateSellersError: null,
  updateSellersInProgress: false,
  eventSellers: null,
  eventInfoInProgress: false,
  eventDetails: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    ////////////////  IMAGE ACTIONS  ////////////////
    case UPLOAD_IMAGE_REQUEST:
      // payload.params: { id: 'tempId', file }
      return {
        ...state,
        image: { ...payload.params },
        uploadInProgress: true,
        uploadImageError: null,
      };
    case UPLOAD_IMAGE_SUCCESS: {
      // payload: { id: 'tempId', uploadedImage }
      const { id, uploadedImage } = payload;
      const { file } = state.image || {};
      const image = { id, file, uploadedImage };
      return { ...state, image, uploadInProgress: false };
    }
    case UPLOAD_IMAGE_ERROR: {
      return { ...state, image: null, uploadInProgress: false, uploadImageError: payload.error };
    }

    ////////////////  SELLER ACTIONS  ////////////////
    case UPDATE_SELLERS_REQUEST: {
      // payload: {}
      return { ...state, updateSellersInProgress: true, updateSellersError: null, updateSellersResponse: null }
    }
    case UPDATE_SELLERS_SUCCESS: {
      // payload: {}
      return {
        ...state,
        updateSellersInProgress: false,
        eventSellers: payload.updatedList,
        updateSellersError: null,
        updateSellersResponse: payload.response
      };
    }
    case UPDATE_SELLERS_ERROR: {
      // payload: {}
      return { ...state, updateSellersInProgress: false, updateSellersError: payload.response, updateSellersResponse: null };
    };

    ////////////////  EVENT DETAILS  ////////////////
    case EVENT_DETAILS_REQUEST:
      return { ...state, eventInfoInProgress: true };
    case EVENT_DETAILS_SUCCESS:
      return { ...state, eventInfoInProgress: false, eventDetails: payload };
    case EVENT_DETAILS_ERROR:
      return { ...state, eventInfoInProgress: false, };

    default:
      return state;
  }
}

// ================ Selectors ================ //

// ================ Action creators ================ //

// Event image upload
export const uploadImageRequest = params => ({ type: UPLOAD_IMAGE_REQUEST, payload: {} });
export const uploadImageSuccess = result => ({ type: UPLOAD_IMAGE_SUCCESS, payload: result.data });
export const uploadImageError = error => ({ type: UPLOAD_IMAGE_ERROR, payload: error, error: true });

// Event seller list update
export const updateSellersRequest = params => ({ type: UPDATE_SELLERS_REQUEST, payload: { params } });
export const updateSellersSuccess = result => ({ type: UPDATE_SELLERS_SUCCESS, payload: result.body });
export const updateSellersError = error => ({ type: UPDATE_SELLERS_ERROR, payload: error.body, error: true });

// Event details
export const eventDetailsRequest = () => ({ type: EVENT_DETAILS_REQUEST, payload: {} });
export const eventDetailsSuccess = data => ({ type: EVENT_DETAILS_SUCCESS, payload: data });
export const eventDetailsError = error => ({ type: EVENT_DETAILS_ERROR, payload: error.body, error: true });

// ================ Thunk ================ //

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
}

async function processFile(file) {
  try {
    return (await readFileAsync(file));
  } catch (err) {
    console.log(err);
  }
}

// Images return imageId which we need to map with previously generated temporary id
export function uploadImage(actionPayload) {
  return (dispatch, getState, sdk) => {
    dispatch(uploadImageRequest(actionPayload));
    processFile(actionPayload.file)
      .then((src) => {
        const options = {
          method: 'POST',
          withCredentials: false,
          body: JSON.stringify({ file: src, id: actionPayload.id, fileType: actionPayload.fileType }),
          headers: {
            "Content-Type": "application/json",
            // "X-Api-Key": KEY,
          }
        };
        fetch('https://yxcapgxgcj.execute-api.us-west-1.amazonaws.com/prd/events/photos', options)
          .then(response => response.json())
          .then(data => console.log(data))
          .then(() => dispatch(uploadImageSuccess({ data: { id: actionPayload.id, uploadedImage: actionPayload.file } })))
          .catch(response => console.log(response));
      })
  }
}

export const updateEventDetails = actionPayload => {
  return (dispatch, getState, sdk) => {
    const options = {
      method: 'POST',
      withCredentials: false,
      body: JSON.stringify(actionPayload),
      headers: {
        "Content-Type": "application/json",
        // "X-Api-Key": KEY,
      }
    }
    fetch(eventsURL, options)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(() => console.log("Could not update database"));
  }
}

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

export const updateSellers = actionPayload => {
  return (dispatch, getState, sdk) => {
    dispatch(updateSellersRequest());
    const options = {
      method: 'POST',
      withCredentials: false,
      body: JSON.stringify(actionPayload),
      headers: {
        "Content-Type": "application/json",
        // "X-Api-Key": KEY,
      }
    }

    fetch(eventsURL + "/sellers", options)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        if (data.statusCode >= 200 && data.statusCode < 300) {
          dispatch(updateSellersSuccess(data));
        } else {
          dispatch(updateSellersError(data));
        }
      })
      .catch(() => dispatch(updateSellersError({ body: "There was an error when trying to update your sellers list" })));
  }
};

const fetchEventSellers = (hostUUID) => (dispatch, getState, sdk) => {
  dispatch(updateSellersRequest());
  const options = {
    method: 'GET',
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      // "X-Api-Key": KEY,
    }
  }

  fetch(eventsURL + "/sellers?" + hostUUID, options)
    .then(response => response.json())
    .then(data => {
      dispatch(updateSellersSuccess(data));
    })
    .catch(() => console.log("Could not update database"));

}

export const loadData = (UUID) => (dispatch, getState, sdk) => {
  sdk.currentUser.show()
    .then((res) => {
      const hostUUID = res.data.data.id.uuid;
      return Promise.all([
        dispatch(fetchEventDetails(hostUUID)),
        dispatch(fetchEventSellers(hostUUID))
      ]);
    })
};
