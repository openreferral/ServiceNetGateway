import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  SEND_MAIL: 'feedback/SEND_MAIL'
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

const url = SERVICENET_API_URL + '/';
const mailUrl = url + 'send-mail/';

export const sendMail = (data, callback) => dispatch => {
  dispatch({
    type: ACTION_TYPES.SEND_MAIL,
    payload: axios.post(mailUrl, data)
  });
  if (callback) {
    callback();
  }
};
