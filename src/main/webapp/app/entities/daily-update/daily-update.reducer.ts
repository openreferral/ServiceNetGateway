import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDailyUpdate, defaultValue } from 'app/shared/model/ServiceNet/daily-update.model';

export const ACTION_TYPES = {
  FETCH_DAILYUPDATE_LIST: 'dailyUpdate/FETCH_DAILYUPDATE_LIST',
  FETCH_DAILYUPDATE: 'dailyUpdate/FETCH_DAILYUPDATE',
  CREATE_DAILYUPDATE: 'dailyUpdate/CREATE_DAILYUPDATE',
  UPDATE_DAILYUPDATE: 'dailyUpdate/UPDATE_DAILYUPDATE',
  DELETE_DAILYUPDATE: 'dailyUpdate/DELETE_DAILYUPDATE',
  SET_BLOB: 'dailyUpdate/SET_BLOB',
  RESET: 'dailyUpdate/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDailyUpdate>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type DailyUpdateState = Readonly<typeof initialState>;

// Reducer

export default (state: DailyUpdateState = initialState, action): DailyUpdateState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DAILYUPDATE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DAILYUPDATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_DAILYUPDATE):
    case REQUEST(ACTION_TYPES.UPDATE_DAILYUPDATE):
    case REQUEST(ACTION_TYPES.DELETE_DAILYUPDATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_DAILYUPDATE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DAILYUPDATE):
    case FAILURE(ACTION_TYPES.CREATE_DAILYUPDATE):
    case FAILURE(ACTION_TYPES.UPDATE_DAILYUPDATE):
    case FAILURE(ACTION_TYPES.DELETE_DAILYUPDATE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_DAILYUPDATE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_DAILYUPDATE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_DAILYUPDATE):
    case SUCCESS(ACTION_TYPES.UPDATE_DAILYUPDATE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_DAILYUPDATE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
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

const apiUrl = 'services/servicenet/api/daily-updates';

// Actions

export const getEntities: ICrudGetAllAction<IDailyUpdate> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_DAILYUPDATE_LIST,
    payload: axios.get<IDailyUpdate>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IDailyUpdate> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DAILYUPDATE,
    payload: axios.get<IDailyUpdate>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IDailyUpdate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DAILYUPDATE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDailyUpdate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DAILYUPDATE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDailyUpdate> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DAILYUPDATE,
    payload: axios.delete(requestUrl)
  });
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
