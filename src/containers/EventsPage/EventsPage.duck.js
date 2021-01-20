import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { currentUserShowSuccess } from '../../ducks/user.duck';

const eventsURL = " https://yxcapgxgcj.execute-api.us-west-1.amazonaws.com/prd/events";

// ================ Action types ================ //

export const EVENTS_REQUEST = 'app/EventsPage/EVENTS_REQUEST';
export const EVENTS_SUCCESS = 'app/EventsPage/EVENTS_SUCCESS';
export const EVENTS_ERROR = 'app/EventsPage/EVENTS_ERROR';

// ================ Reducer ================ //

const initialState = {
  exampleEvents: null,
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
      return { ...state, requestInProgress: false, exampleEvents: payload };
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
export const eventsError = error => ({ type: EVENTS_ERROR, payload: error.body });

// ================ Thunk ================ //

const fetchExampleEvents = () => (dispatch, getState, sdk) => {
  dispatch(eventsRequest());
  const options = {
    method: 'GET',
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      // "X-Api-Key": KEY,
    }
  }

  fetch(eventsURL + "?type=" + "all", options)
    .then(response => response.json())
    .then((res) => {
      console.log(res);
      dispatch(eventsSuccess(res.body[0]));
    })
    .catch(() => console.log("Could not update database"));
}

export const loadData = () => (dispatch, getState, sdk) => {
  return Promise.all([
    dispatch(fetchExampleEvents()),
  ]);
};