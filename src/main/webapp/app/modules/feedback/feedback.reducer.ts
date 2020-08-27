import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_PUBLIC_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  SEND_MAIL: 'feedback/SEND_FEEDBACK'
};

export const initialState = {
  errorMessage: null
};

export type FeedbackState = Readonly<typeof initialState>;

export default (state: FeedbackState = initialState, action): FeedbackState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEND_MAIL):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.SEND_MAIL):
      return {
        ...state,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEND_MAIL):
      return {
        ...state
      };
    default:
      return state;
  }
};

const url = SERVICENET_PUBLIC_API_URL + '/';
const feedbackApiUrl = url + 'feedback/';

export const sendMail = (data, callback) => dispatch => {
  dispatch({
    type: ACTION_TYPES.SEND_MAIL,
    payload: axios.post(feedbackApiUrl, data)
  });
  if (callback) {
    callback();
  }
};
