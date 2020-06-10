import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ISilo, defaultValue } from 'app/shared/model/ServiceNet/silo.model';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  FETCH_SILO_LIST: 'silo/FETCH_SILO_LIST',
  FETCH_SILO: 'silo/FETCH_SILO',
  CREATE_SILO: 'silo/CREATE_SILO',
  UPDATE_SILO: 'silo/UPDATE_SILO',
  DELETE_SILO: 'silo/DELETE_SILO',
  FETCH_ALL_SILO: 'silo/FETCH_ALL_SILO',
  RESET: 'silo/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISilo>,
  entity: defaultValue,
  allSilos: [] as ReadonlyArray<ISilo>,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type SiloState = Readonly<typeof initialState>;

// Reducer

export default (state: SiloState = initialState, action): SiloState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SILO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SILO):
    case REQUEST(ACTION_TYPES.FETCH_ALL_SILO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SILO):
    case REQUEST(ACTION_TYPES.UPDATE_SILO):
    case REQUEST(ACTION_TYPES.DELETE_SILO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_SILO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SILO):
    case FAILURE(ACTION_TYPES.CREATE_SILO):
    case FAILURE(ACTION_TYPES.UPDATE_SILO):
    case FAILURE(ACTION_TYPES.FETCH_ALL_SILO):
    case FAILURE(ACTION_TYPES.DELETE_SILO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_SILO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_SILO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SILO):
    case SUCCESS(ACTION_TYPES.UPDATE_SILO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SILO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case SUCCESS(ACTION_TYPES.FETCH_ALL_SILO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        allSilos: action.payload.data
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = SERVICENET_API_URL + '/silos';
const allSilosApiUrl = SERVICENET_API_URL + '/all-silos';

// Actions

export const getEntities: ICrudGetAllAction<ISilo> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SILO_LIST,
    payload: axios.get<ISilo>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ISilo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SILO,
    payload: axios.get<ISilo>(requestUrl)
  };
};

export const getAllSilos = () => ({
  type: ACTION_TYPES.FETCH_ALL_SILO,
  payload: axios.get(allSilosApiUrl)
});

export const createEntity: ICrudPutAction<ISilo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SILO,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISilo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SILO,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISilo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SILO,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
