import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { currentUserShowSuccess } from '../../ducks/user.duck';

const eventsURL = " https://yxcapgxgcj.execute-api.us-west-1.amazonaws.com/prd/events";

// ================ Action types ================ //

export const CLEAR_UPDATED_FORM = 'app/EventHostPage/CLEAR_UPDATED_FORM';

export const UPLOAD_IMAGE_REQUEST = 'app/EventHostPage/UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'app/EventHostPage/UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_ERROR = 'app/EventHostPage/UPLOAD_IMAGE_ERROR';

export const UPDATE_SELLERS_REQUEST = 'app/EventHostPage/UPDATE_SELLERS_REQUEST';
export const UPDATE_SELLERS_SUCCESS_ADD = 'app/EventHostPage/UPDATE_SELLERS_SUCCESS_ADD';
export const UPDATE_SELLERS_SUCCESS_REMOVE = 'app/EventHostPage/UPDATE_SELLERS_SUCCESS_REMOVE';
export const UPDATE_SELLERS_ERROR = 'app/EventHostPage/UPDATE_SELLERS_ERROR';

export const UPDATE_PROFILE_REQUEST = 'app/EventHostPage/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'app/EventHostPage/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_ERROR = 'app/EventHostPage/UPDATE_PROFILE_ERROR';

export const EVENT_INFO_REQUEST = 'app/EventHostPage/EVENT_INFO_REQUEST';
export const EVENT_INFO_SUCCESS = 'app/EventHostPage/EVENT_INFO_SUCCESS';

// ================ Reducer ================ //

const initialState = {
  image: null,
  uploadImageError: null,
  uploadInProgress: false,
  updateSellersResponseAdd: null,
  updateSellersResponseRemove: null,
  updateSellersError: null,
  updateSellersInProgress: false,
  updateInProgress: false,
  updateProfileError: null,
  eventInfoInProgress: false,
  eventDetails: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
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
      // eslint-disable-next-line no-console
      return { ...state, image: null, uploadInProgress: false, uploadImageError: payload.error };
    }

    case UPDATE_SELLERS_REQUEST: {
      // payload: {}
      return { ...state, updateSellersInProgress: true, updateSellersError: null, updateSellersResponse: null}
    }
    case UPDATE_SELLERS_SUCCESS_ADD: {
      // payload: {}
      return { ...state, updateSellersInProgress: false, updateSellersError: null,  updateSellersResponseAdd: payload, updateSellersResponseRemove: null };
    }
    case UPDATE_SELLERS_SUCCESS_REMOVE: {
      // payload: {}
      return { ...state, updateSellersInProgress: false, updateSellersError: null,  updateSellersResponseAdd: null, updateSellersResponseRemove: payload };
    }
    case UPDATE_SELLERS_ERROR: {
      // payload: {}
      return { ...state, updateSellersInProgress: false, updateSellersError: payload, updateSellersResponse: null };
    };

    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updateInProgress: true,
        updateProfileError: null,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        image: null,
        updateInProgress: false,
      };
    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        image: null,
        updateInProgress: false,
        updateProfileError: payload,
      };

    case CLEAR_UPDATED_FORM:
      return { ...state, updateProfileError: null, uploadImageError: null };

    case EVENT_INFO_REQUEST:
      return { ...state, eventInfoInProgress: true };
    case EVENT_INFO_SUCCESS:
      return { ...state, eventInfoInProgress: false, eventDetails: payload };
    default:
      return state;
  }
}

// ================ Selectors ================ //

// ================ Action creators ================ //
export const clearUpdatedForm = () => ({
  type: CLEAR_UPDATED_FORM,
});

// SDK method: images.upload
export const uploadImageRequest = params => ({ type: UPLOAD_IMAGE_REQUEST, payload: {} });
export const uploadImageSuccess = result => ({ type: UPLOAD_IMAGE_SUCCESS, payload: result.data });
export const uploadImageError = error => ({ type: UPLOAD_IMAGE_ERROR, payload: error, error: true });

export const updateSellersRequest = params => ({ type: UPDATE_SELLERS_REQUEST, payload: { params } });
export const updateSellersSuccessAdd = result => ({ type: UPDATE_SELLERS_SUCCESS_ADD, payload: result.body });
export const updateSellersSuccessRemove = result => ({ type: UPDATE_SELLERS_SUCCESS_REMOVE, payload: result.body });
export const updateSellersError = error => ({ type: UPDATE_SELLERS_ERROR, payload: error.body, error: true });

// SDK method: sdk.currentUser.updateProfile
export const updateProfileRequest = params => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: { params },
});
export const updateProfileSuccess = result => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: result.data,
});
export const updateProfileError = error => ({
  type: UPDATE_PROFILE_ERROR,
  payload: error,
  error: true,
});

export const eventInfoRequest = () => ({
  type: EVENT_INFO_REQUEST,
  payload: {}
})

export const eventInfoSuccess = data => ({
  type: EVENT_INFO_SUCCESS,
  payload: data
})

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
        console.log(data);
        if(data.statusCode === 240) {
          dispatch(updateSellersSuccessRemove(data));
        }
        else if(data.statusCode >= 200) {
        dispatch(updateSellersSuccessAdd(data));
        } else {
          dispatch(updateSellersError(data));
        }
      })
      .catch(() => dispatch(updateSellersError({ body: "There was an error when trying to update your sellers list" })));
  }
};

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
  // return (dispatch, getState, sdk) => {
  //   const id = actionPayload.id;
  //   dispatch(uploadImageRequest(actionPayload));

  //   const bodyParams = {
  //     image: actionPayload.file,
  //   };
  //   const queryParams = {
  //     expand: true,
  //     'fields.image': ['variants.square-small', 'variants.square-small2x'],
  //   };

  //   return sdk.images
  //     .upload(bodyParams, queryParams)
  //     .then(resp => {
  //       const uploadedImage = resp.data.data;
  //       dispatch(uploadImageSuccess({ data: { id, uploadedImage } }));
  //     })
  //     .catch(e => dispatch(uploadImageError({ id, error: storableError(e) })));
  // };
}

export const updateDetails = actionPayload => {
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


const fetchEventInfo = (UUID) => (dispatch, getState, sdk) => {
  var payload;
  dispatch(eventInfoRequest());
  const options = {
    method: 'GET',
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      // "X-Api-Key": KEY,
    }
  }

  return (fetch(eventsURL + "?uuid=" + UUID, options)
    .then(response => response.json())
    .then(data => data.body)
    .catch(() => console.log("Could not update database")));
}

export const loadData = (UUID) => (dispatch, getState, sdk) => {
  // Clear state so that previously loaded data is not visible
  // in case this page load fails.
  dispatch(clearUpdatedForm());
  return sdk.currentUser.show()
    .then(response => {
      dispatch(fetchEventInfo(response.data.data.id.uuid))
        .then((payload) => {
          if (payload && payload[0]) {
            dispatch(eventInfoSuccess(payload[0]));
          }
        });
    })
    .catch((e) => console.log(e));
};
