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
import { IBeneficiary, defaultValue } from 'app/shared/model/ServiceNet/beneficiary.model';

export const ACTION_TYPES = {
  FETCH_BENEFICIARY_LIST: 'beneficiary/FETCH_BENEFICIARY_LIST',
  FETCH_BENEFICIARY: 'beneficiary/FETCH_BENEFICIARY',
  CREATE_BENEFICIARY: 'beneficiary/CREATE_BENEFICIARY',
  UPDATE_BENEFICIARY: 'beneficiary/UPDATE_BENEFICIARY',
  DELETE_BENEFICIARY: 'beneficiary/DELETE_BENEFICIARY',
  RESET: 'beneficiary/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBeneficiary>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type BeneficiaryState = Readonly<typeof initialState>;

// Reducer

export default (state: BeneficiaryState = initialState, action): BeneficiaryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BENEFICIARY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BENEFICIARY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BENEFICIARY):
    case REQUEST(ACTION_TYPES.UPDATE_BENEFICIARY):
    case REQUEST(ACTION_TYPES.DELETE_BENEFICIARY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BENEFICIARY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BENEFICIARY):
    case FAILURE(ACTION_TYPES.CREATE_BENEFICIARY):
    case FAILURE(ACTION_TYPES.UPDATE_BENEFICIARY):
    case FAILURE(ACTION_TYPES.DELETE_BENEFICIARY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BENEFICIARY_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_BENEFICIARY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BENEFICIARY):
    case SUCCESS(ACTION_TYPES.UPDATE_BENEFICIARY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BENEFICIARY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'services/servicenet/api/beneficiaries';

// Actions

export const getEntities: ICrudGetAllAction<IBeneficiary> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_BENEFICIARY_LIST,
    payload: axios.get<IBeneficiary>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IBeneficiary> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BENEFICIARY,
    payload: axios.get<IBeneficiary>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IBeneficiary> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BENEFICIARY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const updateEntity: ICrudPutAction<IBeneficiary> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BENEFICIARY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBeneficiary> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BENEFICIARY,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
