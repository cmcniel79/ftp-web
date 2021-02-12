const EVENTS_URL = process.env.REACT_APP_API_EVENTS + 'prd/events';
const KEY = process.env.REACT_APP_API_KEY;

// ================ Action types ================ //

export const EVENT_DETAILS_REQUEST = 'app/EventHostPage/EVENT_DETAILS_REQUEST';
export const EVENT_DETAILS_SUCCESS = 'app/EventHostPage/EVENT_DETAILS_SUCCESS';
export const EVENT_DETAILS_UPDATE = 'app/EventHostPage/EVENT_DETAILS_UPDATE';
export const EVENT_DETAILS_ERROR = 'app/EventHostPage/EVENT_DETAILS_ERROR';

export const UPLOAD_IMAGE_REQUEST = 'app/EventHostPage/UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'app/EventHostPage/UPLOAD_IMAGE_SUCCESS';
export const SAVE_IMAGE_SUCCESS = 'app/EventHostPage/SAVE_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_ERROR = 'app/EventHostPage/UPLOAD_IMAGE_ERROR';

export const UPDATE_SELLERS_REQUEST = 'app/EventHostPage/UPDATE_SELLERS_REQUEST';
export const UPDATE_SELLERS_SUCCESS = 'app/EventHostPage/UPDATE_SELLERS_SUCCESS';
export const UPDATE_SELLERS_ERROR = 'app/EventHostPage/UPDATE_SELLERS_ERROR';

// ================ Reducer ================ //

const initialState = {
  eventDetails: null,
  eventDetailsUpdate: false,
  eventDetailsInProgress: false,
  eventDetailsError: null,
  imageId: null,
  uploadInProgress: false,
  uploadImageError: null,
  eventSellers: null,
  updateSellersResponse: null,
  updateSellersInProgress: false,
  updateSellersError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {

    ////////////////  EVENT DETAILS  ////////////////
    case EVENT_DETAILS_REQUEST:
      return { ...state, eventDetailsInProgress: true };
    case EVENT_DETAILS_SUCCESS:
      return { ...state, eventDetailsInProgress: false, eventDetails: payload };
    case EVENT_DETAILS_UPDATE:
      return { ...state, eventDetailsInProgress: false, eventDetailsUpdate: true };
    case EVENT_DETAILS_ERROR:
      return { ...state, eventDetailsInProgress: false, eventDetailsError: payload };

    ////////////////  IMAGE ACTIONS  ////////////////
    case UPLOAD_IMAGE_REQUEST:
      return {
        ...state,
        uploadInProgress: true,
        uploadImageError: null,
      };
    case UPLOAD_IMAGE_SUCCESS: {
      return { ...state, imageId: payload, uploadInProgress: false };
    }
    case SAVE_IMAGE_SUCCESS: {
      return { ...state, uploadInProgress: false };
    }
    case UPLOAD_IMAGE_ERROR: {
      return { ...state, imageId: null, uploadInProgress: false, uploadImageError: payload.error };
    }

    ////////////////  SELLER ACTIONS  ////////////////
    case UPDATE_SELLERS_REQUEST: {
      return { ...state, updateSellersInProgress: true, updateSellersError: null, updateSellersResponse: null }
    }
    case UPDATE_SELLERS_SUCCESS: {
      return {
        ...state,
        updateSellersInProgress: false,
        eventSellers: payload.updatedList,
        updateSellersError: null,
        updateSellersResponse: payload.response
      };
    }
    case UPDATE_SELLERS_ERROR: {
      return { ...state, updateSellersInProgress: false, updateSellersError: payload.response, updateSellersResponse: null };
    }

    default:
      return state;
  }
}

// ================ Selectors ================ //

// ================ Action creators ================ //

// Event details
export const eventDetailsRequest = () => ({ type: EVENT_DETAILS_REQUEST, payload: {} });
export const eventDetailsSuccess = data => ({ type: EVENT_DETAILS_SUCCESS, payload: data });
export const eventDetailsUpdateSuccess = () => ({ type: EVENT_DETAILS_UPDATE, payload: {} });
export const eventDetailsError = error => ({ type: EVENT_DETAILS_ERROR, payload: error, error: true });

// Event image upload
export const uploadImageRequest = params => ({ type: UPLOAD_IMAGE_REQUEST, payload: { params } });
export const uploadImageSuccess = result => ({ type: UPLOAD_IMAGE_SUCCESS, payload: result });
export const saveImageSuccess = () => ({ type: SAVE_IMAGE_SUCCESS, payload: {} });
export const uploadImageError = error => ({ type: UPLOAD_IMAGE_ERROR, payload: error, error: true });

// Event seller list update
export const updateSellersRequest = params => ({ type: UPDATE_SELLERS_REQUEST, payload: { params } });
export const updateSellersSuccess = result => ({ type: UPDATE_SELLERS_SUCCESS, payload: result.body });
export const updateSellersError = error => ({ type: UPDATE_SELLERS_ERROR, payload: error.body, error: true });

// ================ Thunk ================ //

export const updateEventDetails = actionPayload => {
  return (dispatch, getState, sdk) => {
    dispatch(eventDetailsRequest());
    const options = {
      method: 'POST',
      withCredentials: false,
      body: JSON.stringify(actionPayload),
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": KEY,
      }
    }
    fetch(EVENTS_URL, options)
      .then(response => response.json())
      .then((res) => dispatch(eventDetailsUpdateSuccess()))
      .catch(() => dispatch(eventDetailsError("Could not update event details. Please try again")));
  }
}

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
    .catch(() => dispatch(eventDetailsError("Could not update event details. Please try again")));
}

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
            "X-Api-Key": KEY,
          }
        };
        const url = EVENTS_URL + '/photos';
        fetch(url, options)
          .then(response => response.json())
          .then(data => dispatch(uploadImageSuccess(data.body.id)))
          .catch(response => dispatch(uploadImageError(response)));
      })
  }
}

export function updateImage(actionPayload) {
  return (dispatch, getState, sdk) => {
    dispatch(uploadImageRequest(actionPayload));
    const options = {
      method: 'POST',
      withCredentials: false,
      body: JSON.stringify(actionPayload),
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": KEY,
      }
    }
    const url = EVENTS_URL + '/photos'
    fetch(url, options)
      .then(response => response.json())
      .then(() => dispatch(saveImageSuccess()))
      .catch(response => dispatch(uploadImageError(response)));
  };
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
        "X-Api-Key": KEY,
      }
    }
    const url = EVENTS_URL + "/sellers";
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
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
      "X-Api-Key": KEY,
    }
  }
  const url = EVENTS_URL + "/sellers?uuid=" + hostUUID;
  fetch(url, options)
    .then(response => response.json())
    .then(data => dispatch(updateSellersSuccess(data)))
    .catch(() => dispatch(updateSellersError({ body: "There was an error when trying to update your sellers list" })));

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
