const KEY = process.env.REACT_APP_API_KEY;
const ENV = process.env.REACT_APP_ENV === "production" ? "prd" : "dev";
const BASE_URL = process.env.REACT_APP_API_EMAIL;
// ================ Action types ================ //

export const CLEAR_UPDATED_FORM = 'app/ContactPage/CLEAR_UPDATED_FORM';

export const SEND_EMAIL_REQUEST = 'app/ContactPage/SEND_EMAIL_REQUEST';
export const SEND_EMAIL_SUCCESS = 'app/ContactPage/SEND_EMAIL_SUCCESS';
export const SEND_EMAIL_ERROR = 'app/ContactPage/SEND_EMAIL_ERROR';

// ================ Reducer ================ //

const initialState = {
    sendingInProgress: false,
    sendEmailError: null,
    sendingSuccess: false
};

export default function reducer(state = initialState, action = {}) {
    const { 
        type, 
        // payload 
    } = action;
    switch (type) {
        case SEND_EMAIL_REQUEST:
            return {
                ...state,
                sendingInProgress: true,
                sendingEmailError: null,
                sendingSuccess: false
            };
        case SEND_EMAIL_SUCCESS:
            return {
                ...state,
                sendingInProgress: false,
                sendingEmailError: false,
                sendingSuccess: true
            };
        case SEND_EMAIL_ERROR:
            return {
                ...state,
                sendingInProgress: false,
                sendingEmailError: true,
                sendingSuccess: false
            };

        case CLEAR_UPDATED_FORM:
            return { ...state, sendingEmailError: null, sendingInProgress: null, sendingSuccess: null };

        default:
            return state;
    }
}

// ================ Selectors ================ //

// ================ Action creators ================ //

export const clearUpdatedForm = () => ({
    type: CLEAR_UPDATED_FORM,
});

export const sendEmailRequest = params => ({
    type: SEND_EMAIL_REQUEST,
    payload: { params },
});
export const sendEmailSuccess = result => ({
    type: SEND_EMAIL_SUCCESS,
    payload: { result },
});
export const sendEmailError = error => ({
    type: SEND_EMAIL_ERROR,
    payload: error,
    error: true,
});

// ================ Thunk ================ //

export const sendEmail = (values) => {
    return (dispatch, getState, sdk) => {
        const url = BASE_URL + ENV;
        const bodyRequest = {
            email: values.email,
            first: values.firstName,
            last: values.lastName,
            subject: values.subject,
            message: values.message,
            isCurrentUser: values.isCurrentUser
        }
        const options = {
          method: 'POST',
          withCredentials: false,
          body: JSON.stringify(bodyRequest),
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": KEY,
          }
        }
        dispatch(sendEmailRequest());
        fetch(url, options)
          .then(response => {
              dispatch(sendEmailSuccess())
          })
          .catch(e => dispatch(sendEmailError(e)));
    }
};