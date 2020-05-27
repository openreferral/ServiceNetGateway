import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  FETCH_DEACTIVATED_RECORDS: 'deactivatedRecords/FETCH_DEACTIVATED_RECORDS',
  REACTIVATE_RECORD: 'deactivatedRecords/REACTIVATE_RECORD'
};

const initialState = {
  loading: false,
  errorMessage: null,
  updating: false,
  updateSuccess: false,
  deactivatedRecords: [] as any[]
};

export type DeactivatedRecordsState = Readonly<typeof initialState>;

export default (state: DeactivatedRecordsState = initialState, action): DeactivatedRecordsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DEACTIVATED_RECORDS):
    case REQUEST(ACTION_TYPES.REACTIVATE_RECORD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_DEACTIVATED_RECORDS):
    case FAILURE(ACTION_TYPES.REACTIVATE_RECORD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_DEACTIVATED_RECORDS):
    case SUCCESS(ACTION_TYPES.REACTIVATE_RECORD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        deactivatedRecords: action.payload.data
      };
    default:
      return state;
  }
};

const deactivatedRecordApiUrl = SERVICENET_API_URL + '/deactivated-provider-records';
const reactivateRecordUrl = SERVICENET_API_URL + '/organizations/reactivate/';

export const getDeactivatedProviderRecords = () => ({
  type: ACTION_TYPES.FETCH_DEACTIVATED_RECORDS,
  payload: axios.get(deactivatedRecordApiUrl)
});

export const reactivateRecord = id => ({
  type: ACTION_TYPES.FETCH_DEACTIVATED_RECORDS,
  payload: axios.post(`${reactivateRecordUrl}/${id}`)
});
