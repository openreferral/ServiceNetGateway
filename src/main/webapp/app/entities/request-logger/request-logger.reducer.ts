import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IRequestLogger, defaultValue } from 'app/shared/model/request-logger.model';

export const ACTION_TYPES = {
  FETCH_REQUESTLOGGER_LIST: 'requestLogger/FETCH_REQUESTLOGGER_LIST',
  FETCH_REQUESTLOGGER: 'requestLogger/FETCH_REQUESTLOGGER',
  CREATE_REQUESTLOGGER: 'requestLogger/CREATE_REQUESTLOGGER',
  UPDATE_REQUESTLOGGER: 'requestLogger/UPDATE_REQUESTLOGGER',
  DELETE_REQUESTLOGGER: 'requestLogger/DELETE_REQUESTLOGGER',
  SET_BLOB: 'requestLogger/SET_BLOB',
  RESET: 'requestLogger/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IRequestLogger>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type RequestLoggerState = Readonly<typeof initialState>;

// Reducer

export default (state: RequestLoggerState = initialState, action): RequestLoggerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REQUESTLOGGER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_REQUESTLOGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_REQUESTLOGGER):
    case REQUEST(ACTION_TYPES.UPDATE_REQUESTLOGGER):
    case REQUEST(ACTION_TYPES.DELETE_REQUESTLOGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_REQUESTLOGGER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_REQUESTLOGGER):
    case FAILURE(ACTION_TYPES.CREATE_REQUESTLOGGER):
    case FAILURE(ACTION_TYPES.UPDATE_REQUESTLOGGER):
    case FAILURE(ACTION_TYPES.DELETE_REQUESTLOGGER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_REQUESTLOGGER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_REQUESTLOGGER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_REQUESTLOGGER):
    case SUCCESS(ACTION_TYPES.UPDATE_REQUESTLOGGER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_REQUESTLOGGER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB:
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = '/api/request-logger';

// Actions

export const getEntities: ICrudGetAllAction<IRequestLogger> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_REQUESTLOGGER_LIST,
    payload: axios.get<IRequestLogger>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IRequestLogger> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_REQUESTLOGGER,
    payload: axios.get<IRequestLogger>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IRequestLogger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REQUESTLOGGER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IRequestLogger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REQUESTLOGGER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IRequestLogger> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REQUESTLOGGER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
