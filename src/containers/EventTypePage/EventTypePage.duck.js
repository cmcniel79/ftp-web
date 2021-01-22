const eventsURL = " https://yxcapgxgcj.execute-api.us-west-1.amazonaws.com/prd/events";

// ================ Action types ================ //

export const EVENTS_REQUEST = 'app/EventTypePage/EVENTS_REQUEST';
export const EVENTS_SUCCESS = 'app/EventTypePage/EVENTS_SUCCESS';
export const EVENTS_ERROR = 'app/EventTypePage/EVENTS_ERROR';

// ================ Reducer ================ //

const initialState = {
  events: [],
  requestInProgress: false,
  requestError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {

    ////////////////  ALL EVENT DETAILS  ////////////////
    case EVENTS_REQUEST:
      return { ...state, requestInProgress: true };
    case EVENTS_SUCCESS:
      return { ...state, requestInProgress: false, events: payload };
    case EVENTS_ERROR:
      return { ...state, requestInProgress: false, requestError: payload};

    default:
      return state;
  }
}

// ================ Selectors ================ //

// ================ Action creators ================ //

// All event details
export const eventsRequest = () => ({ type: EVENTS_REQUEST, payload: {} });
export const eventsSuccess = data => ({ type: EVENTS_SUCCESS, payload: data });
export const eventsError = error => ({ type: EVENTS_ERROR, payload: error });

// ================ Thunk ================ //

const fetchEvents = (type) => (dispatch, getState, sdk) => {
  dispatch(eventsRequest());
  const options = {
    method: 'GET',
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      // "X-Api-Key": KEY,
    }
  }

  fetch(eventsURL + "?type=" + type, options)
    .then(response => response.json())
    .then((res) => dispatch(eventsSuccess(res.body)))
    .catch(() =>  dispatch(eventsError("An error occurred when loading events. Please try refreshing the page")));
}

export const loadData = (type) => (dispatch, getState, sdk) => {
  return Promise.all([
    dispatch(fetchEvents(type)),
  ]);
};