import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';
import { IDataStatus } from 'app/shared/model/data-status.model';

export const ACTION_TYPES = {
  FETCH_DATA_STATUSES: 'dataStatus/FETCH_DATA_STATUSES'
};

export const initialState = {
  errorMessage: null,
  dataStatus: [] as ReadonlyArray<IDataStatus>,
  totalItems: 0
};

export type DataStatusState = Readonly<typeof initialState>;

export default (state: DataStatusState = initialState, action): DataStatusState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DATA_STATUSES):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.FETCH_DATA_STATUSES):
      return {
        ...state,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATA_STATUSES):
      return {
        ...state,
        dataStatus: action.payload.data,
        totalItems: action.payload.headers['x-total-count']
      };
    default:
      return state;
  }
};

const url = SERVICENET_API_URL + '/';
const dataStatusApiUrl = url + 'data-status/';

export const fetchDataStatus = (page, itemsPerPage) => dispatch => {
  const pageableUrl = `${dataStatusApiUrl}?page=${page}&size=${itemsPerPage}`;
  dispatch({
    type: ACTION_TYPES.FETCH_DATA_STATUSES,
    payload: axios.get(pageableUrl)
  });
};
