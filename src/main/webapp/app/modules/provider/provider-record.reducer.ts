import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL, SERVICENET_PUBLIC_API_URL } from 'app/shared/util/service-url.constants';
import _ from 'lodash';

export const ACTION_TYPES = {
  FETCH_RECORDS: 'records/FETCH_RECORDS',
  FETCH_ALL_RECORDS: 'records/FETCH_ALL_RECORDS',
  FETCH_ALL_RECORDS_FOR_MAP: 'records/FETCH_ALL_RECORDS_FOR_MAP',
  SELECT_RECORD: 'records/SELECT_RECORD',
  REFER_RECORD: 'records/REFER_RECORD',
  UNREFER_RECORD: 'records/UNREFER_RECORD',
  CLEAN_REFERRED_RECORDS: 'records/CLEAN_REFERRED_RECORDS',
  CHECK_IN: 'records/CHECK_IN',
  RESET_REFERRAL_SENT: 'records/RESET_REFERRAL_SENT'
};

const initialState = {
  loading: false,
  errorMessage: null,
  updating: false,
  updateSuccess: false,
  records: [] as any[],
  recordsByIndex: {},
  recordsTotal: 0,
  allRecords: [] as any[],
  allRecordsForMap: [] as any[],
  allRecordsTotal: 0,
  selectedRecord: null,
  referredRecords: [] as any[],
  userName: '',
  referralSent: false
};

const DEFAULT_RECORDS_SORT = 'updatedAt,desc';

export type ProviderRecordsState = Readonly<typeof initialState>;

const addPage = (records, page) => {
  _.forEach(page.content, (record, i) => {
    records[page.size * page.number + i] = record;
  });
  return { ...records };
};

// Reducer
export default (state: ProviderRecordsState = initialState, action): ProviderRecordsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RECORDS):
    case REQUEST(ACTION_TYPES.FETCH_ALL_RECORDS):
    case REQUEST(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
      return {
        ...state,
        selectedRecord: null,
        loading: true
      };
    case REQUEST(ACTION_TYPES.SELECT_RECORD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case REQUEST(ACTION_TYPES.CHECK_IN):
      return {
        ...state,
        referralSent: false
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
    case FAILURE(ACTION_TYPES.CHECK_IN):
      return {
        ...state,
        referralSent: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECORDS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        records: action.payload.data.content,
        recordsByIndex: addPage(state.recordsByIndex, action.payload.data),
        recordsTotal: action.payload.data.totalElements,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_ALL_RECORDS):
      const { isInitLoading } = action.meta;
      const payload = isInitLoading ? action.payload.data : [...state.allRecords, ...action.payload.data];
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        allRecords: payload,
        allRecordsTotal: action.payload.headers['x-total-count'],
        loading: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        allRecordsForMap: action.payload.data,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.SELECT_RECORD):
      return {
        ...state,
        selectedRecord: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CHECK_IN):
      return {
        ...state,
        referralSent: true
      };
    case ACTION_TYPES.REFER_RECORD:
      return {
        ...state,
        referredRecords: [...state.referredRecords, action.payload],
        userName: action.meta.userName
      };
    case ACTION_TYPES.UNREFER_RECORD:
      return {
        ...state,
        referredRecords: _.remove(state.referredRecords, record => record !== action.payload),
        userName: action.meta.userName
      };
    case ACTION_TYPES.CLEAN_REFERRED_RECORDS:
      return {
        ...state,
        referredRecords: [],
        userName: ''
      };
    case ACTION_TYPES.RESET_REFERRAL_SENT:
      return {
        ...state,
        referralSent: false
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
const checkInApiUrl = SERVICENET_API_URL + '/beneficiaries/check-in';

// Actions

export const getProviderRecords = (page, itemsPerPage, sort = DEFAULT_RECORDS_SORT) => {
  const pageableUrl = `${userRecordApiUrl}?page=${page}&size=${itemsPerPage}&sort=${sort}`;
  return {
    type: ACTION_TYPES.FETCH_RECORDS,
    payload: axios.get(pageableUrl)
  };
};

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

export const getProviderRecordsForMap = (siloName = '', providerFilter, search, boundaries, itemsPerPage) => {
  const params = `size=${itemsPerPage}&search=${search ? search : ''}&boundaries=${boundaries ? boundaries.toUrlValue() : ''}`;
  const baseUrl = siloName ? `${allRecordForMapPublicApiUrl}?siloName=${siloName}&${params}` : `${allRecordForMapApiUrl}?${params}`;
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

export const referRecord = (recordId, userName = '') => ({
  type: ACTION_TYPES.REFER_RECORD,
  payload: recordId,
  meta: { userName }
});

export const unreferRecord = (recordId, userName = '') => ({
  type: ACTION_TYPES.UNREFER_RECORD,
  payload: recordId,
  meta: { userName }
});

export const cleanReferredRecords = () => ({
  type: ACTION_TYPES.CLEAN_REFERRED_RECORDS
});

export const checkIn = (phoneNumber, beneficiaryId, cboId) => ({
  payload: axios.post(checkInApiUrl, { phoneNumber, beneficiaryId, cboId }),
  type: ACTION_TYPES.CHECK_IN
});

export const resetReferralSent = () => ({
  type: ACTION_TYPES.RESET_REFERRAL_SENT
});
