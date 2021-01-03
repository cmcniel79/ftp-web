import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { currentUserShowSuccess } from '../../ducks/user.duck';

const eventsURL = " https://yxcapgxgcj.execute-api.us-west-1.amazonaws.com/prd";

// ================ Action types ================ //

export const CLEAR_UPDATED_FORM = 'app/EventHostPage/CLEAR_UPDATED_FORM';

export const UPLOAD_IMAGE_REQUEST = 'app/EventHostPage/UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'app/EventHostPage/UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_ERROR = 'app/EventHostPage/UPLOAD_IMAGE_ERROR';

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
      const image = { id, imageId: uploadedImage.id, file, uploadedImage };
      return { ...state, image, uploadInProgress: false };
    }
    case UPLOAD_IMAGE_ERROR: {
      // eslint-disable-next-line no-console
      return { ...state, image: null, uploadInProgress: false, uploadImageError: payload.error };
    }

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
export const uploadImageRequest = params => ({ type: UPLOAD_IMAGE_REQUEST, payload: { params } });
export const uploadImageSuccess = result => ({ type: UPLOAD_IMAGE_SUCCESS, payload: result.data });
export const uploadImageError = error => ({
  type: UPLOAD_IMAGE_ERROR,
  payload: error,
  error: true,
});

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

// Images return imageId which we need to map with previously generated temporary id
export function uploadImage(actionPayload) {
  return ({ status: "Uploaded" });
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

export const updateEvent = actionPayload => {
  return (dispatch, getState, sdk) => {
    dispatch(updateProfileRequest());

    const queryParams = {
      expand: true,
      include: ['profileImage'],
      'fields.image': ['variants.square-small', 'variants.square-small2x'],
    };

    return sdk.currentUser
      .updateProfile(actionPayload, queryParams)
      .then(response => {
        dispatch(updateProfileSuccess(response));

        const entities = denormalisedResponseEntities(response);
        if (entities.length !== 1) {
          throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
        }
        const currentUser = entities[0];

        // Update current user in state.user.currentUser through user.duck.js
        dispatch(currentUserShowSuccess(currentUser));
      })
      .catch(e => dispatch(updateProfileError(storableError(e))));
  };
};

export const updateSellers = actionPayload => {
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
    .catch(() => console.log("Could not update database"));
};

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
    .then(data => {
      return(data.body)
    })
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
        dispatch(eventInfoSuccess(payload[0]))
      });
    })
    .catch((e) => console.log(e));
};
