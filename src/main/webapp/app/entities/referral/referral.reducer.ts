import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IReferral, defaultValue } from 'app/shared/model/ServiceNet/referral.model';
import { MAX_PAGE_SIZE } from 'app/config/constants';

export const ACTION_TYPES = {
  FETCH_REFERRAL_LIST: 'referral/FETCH_REFERRAL_LIST',
  FETCH_REFERRAL: 'referral/FETCH_REFERRAL',
  CREATE_REFERRAL: 'referral/CREATE_REFERRAL',
  UPDATE_REFERRAL: 'referral/UPDATE_REFERRAL',
  DELETE_REFERRAL: 'referral/DELETE_REFERRAL',
  RESET: 'referral/RESET',
  SEARCH_REFERRALS: 'referral/SEARCH_REFERRALS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IReferral>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  referrals: [] as any[]
};

export type ReferralState = Readonly<typeof initialState>;

// Reducer

export default (state: ReferralState = initialState, action): ReferralState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REFERRAL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_REFERRAL):
    case REQUEST(ACTION_TYPES.SEARCH_REFERRALS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_REFERRAL):
    case REQUEST(ACTION_TYPES.UPDATE_REFERRAL):
    case REQUEST(ACTION_TYPES.DELETE_REFERRAL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_REFERRAL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_REFERRAL):
    case FAILURE(ACTION_TYPES.CREATE_REFERRAL):
    case FAILURE(ACTION_TYPES.UPDATE_REFERRAL):
    case FAILURE(ACTION_TYPES.DELETE_REFERRAL):
    case FAILURE(ACTION_TYPES.SEARCH_REFERRALS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_REFERRAL_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_REFERRAL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_REFERRAL):
    case SUCCESS(ACTION_TYPES.UPDATE_REFERRAL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_REFERRAL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case SUCCESS(ACTION_TYPES.SEARCH_REFERRALS): {
      return {
        ...state,
        loading: false,
        referrals: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'services/servicenet/api/referrals';

// Actions

export const getEntities: ICrudGetAllAction<IReferral> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_REFERRAL_LIST,
    payload: axios.get<IReferral>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IReferral> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_REFERRAL,
    payload: axios.get<IReferral>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IReferral> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REFERRAL,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const updateEntity: ICrudPutAction<IReferral> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REFERRAL,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IReferral> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REFERRAL,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});

export const searchReferrals = (since = '', status = '', page = 0, size = MAX_PAGE_SIZE, order = '', sort = '') => {
  const pageableUrl = `${apiUrl}/search?page=${page}&size=${size}&sort=${sort},${order}${since ? '&since=' + since : ''}${status ? '&status=' + status : ''}`;
  return {
    type: ACTION_TYPES.SEARCH_REFERRALS,
    payload: axios.get(pageableUrl)
  };
};
