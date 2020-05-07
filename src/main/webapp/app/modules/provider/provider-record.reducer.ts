import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  FETCH_RECORDS: 'records/FETCH_RECORDS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  updating: false,
  updateSuccess: false,
  records: [] as any[]
};

export type ProviderRecordsState = Readonly<typeof initialState>;

// Reducer
export default (state: ProviderRecordsState = initialState, action): ProviderRecordsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RECORDS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_RECORDS):
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
    default:
      return state;
  }
};

const realClientUrl = SERVICENET_API_URL + '/provider-records';

// Actions

export const getProviderRecords = () => ({
  type: ACTION_TYPES.FETCH_RECORDS,
  payload: axios.get(realClientUrl)
});
