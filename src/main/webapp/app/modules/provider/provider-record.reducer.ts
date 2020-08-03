import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL, SERVICENET_PUBLIC_API_URL } from 'app/shared/util/service-url.constants';
import _ from 'lodash';

export const ACTION_TYPES = {
  FETCH_RECORDS: 'records/FETCH_RECORDS',
  FETCH_ALL_RECORDS: 'records/FETCH_ALL_RECORDS',
  FETCH_ALL_RECORDS_FOR_MAP: 'records/FETCH_ALL_RECORDS_FOR_MAP',
  SELECT_RECORD: 'records/SELECT_RECORD'
};

const initialState = {
  loading: false,
  errorMessage: null,
  updating: false,
  updateSuccess: false,
  records: [] as any[],
  allRecords: [] as any[],
  allRecordsForMap: [] as any[],
  allRecordsTotal: 0,
  selectedRecord: null
};

export type ProviderRecordsState = Readonly<typeof initialState>;

// Reducer
export default (state: ProviderRecordsState = initialState, action): ProviderRecordsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RECORDS):
    case REQUEST(ACTION_TYPES.FETCH_ALL_RECORDS):
    case REQUEST(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
      return {
        ...state,
        selectedRecord: null
      };
    case REQUEST(ACTION_TYPES.SELECT_RECORD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_RECORDS):
    case FAILURE(ACTION_TYPES.FETCH_ALL_RECORDS):
    case FAILURE(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
    case FAILURE(ACTION_TYPES.SELECT_RECORD):
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
    case SUCCESS(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        allRecordsForMap: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SELECT_RECORD):
      return {
        ...state,
        selectedRecord: action.payload.data
      };
    default:
      return state;
  }
};

const userRecordApiUrl = SERVICENET_API_URL + '/provider-records';
const allRecordApiUrl = SERVICENET_API_URL + '/all-provider-records';
const allRecordPublicApiUrl = SERVICENET_PUBLIC_API_URL + '/all-provider-records';
const allRecordForMapApiUrl = SERVICENET_API_URL + '/all-provider-records-map';
const selectRecordApiUrl = SERVICENET_API_URL + '/select-record';
const allRecordForMapPublicApiUrl = SERVICENET_PUBLIC_API_URL + '/all-provider-records-map';
const selectRecordPublicApiUrl = SERVICENET_PUBLIC_API_URL + '/select-record';

// Actions

export const getProviderRecords = () => ({
  type: ACTION_TYPES.FETCH_RECORDS,
  payload: axios.get(userRecordApiUrl)
});

export const getAllProviderRecords = (page, itemsPerPage, sort, filter, search, isInitLoading = true) => {
  const pageableUrl = `${allRecordApiUrl}?search=${search ? search : ''}&page=${page}&size=${itemsPerPage}&sort=${sort}`;
  return {
    type: ACTION_TYPES.FETCH_ALL_RECORDS,
    payload: axios.post(pageableUrl, clearFilter(filter)),
    meta: {
      isInitLoading
    }
  };
};

export const getAllProviderRecordsPublic = (silo, page, itemsPerPage, sort, filter, search, isInitLoading = true) => {
  const pageableUrl = `${allRecordPublicApiUrl}/${silo}?search=${search ? search : ''}&page=${page}&size=${itemsPerPage}&sort=${sort}`;
  return {
    type: ACTION_TYPES.FETCH_ALL_RECORDS,
    payload: axios.post(pageableUrl, clearFilter(filter)),
    meta: {
      isInitLoading
    }
  };
};

export const getAllProviderRecordsForMap = (siloName = '', providerFilter, search) => {
  const params = `search=${search ? search : ''}`;
  const baseUrl = siloName ? `${allRecordForMapPublicApiUrl}?siloName=${siloName}&params` : `${allRecordForMapApiUrl}?${params}`;
  return {
    type: ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP,
    payload: axios.post(baseUrl, clearFilter(providerFilter))
  };
};

export const selectRecord = (id, siloName = '') => {
  const baseUrl = siloName ? selectRecordPublicApiUrl : selectRecordApiUrl;
  return {
    type: ACTION_TYPES.SELECT_RECORD,
    payload: axios.get(`${baseUrl}/${id}?siloName=${siloName}`)
  };
};

const clearFilter = filter => ({
  ...filter,
  serviceTypes: _.map(filter.serviceTypes, s => s.value)
});
