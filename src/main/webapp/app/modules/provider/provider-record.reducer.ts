import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  FETCH_RECORDS: 'records/FETCH_RECORDS',
  FETCH_ALL_RECORDS: 'records/FETCH_ALL_RECORDS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  updating: false,
  updateSuccess: false,
  records: [] as any[],
  allRecords: [] as any[],
  allRecordsTotal: 0
};

export type ProviderRecordsState = Readonly<typeof initialState>;

// Reducer
export default (state: ProviderRecordsState = initialState, action): ProviderRecordsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RECORDS):
    case REQUEST(ACTION_TYPES.FETCH_ALL_RECORDS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_RECORDS):
    case FAILURE(ACTION_TYPES.FETCH_ALL_RECORDS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECORDS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        records: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ALL_RECORDS):
      const { isInitLoading } = action.meta;
      const payload = isInitLoading ? action.payload.data : [...state.allRecords, ...action.payload.data];
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        allRecords: payload,
        allRecordsTotal: action.payload.headers['x-total-count']
      };
    default:
      return state;
  }
};

const userRecordApiUrl = SERVICENET_API_URL + '/provider-records';
const allRecordApiUrl = SERVICENET_API_URL + '/all-provider-records';

// Actions

export const getProviderRecords = () => ({
  type: ACTION_TYPES.FETCH_RECORDS,
  payload: axios.get(userRecordApiUrl)
});

export const getAllProviderRecords = (page, itemsPerPage, sort, isInitLoading = true) => {
  const pageableUrl = `${allRecordApiUrl}?page=${page}&size=${itemsPerPage}&sort=${sort}`;
  return {
    type: ACTION_TYPES.FETCH_ALL_RECORDS,
    payload: axios.get(pageableUrl),
    meta: {
      isInitLoading
    }
  };
};
