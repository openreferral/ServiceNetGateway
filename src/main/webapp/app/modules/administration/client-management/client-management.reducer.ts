import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IClient, defaultValue } from 'app/shared/model/client.model';
import { AUTH_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  FETCH_ROLES: 'ClientManagement/FETCH_ROLES',
  FETCH_SYSTEM_ACCOUNTS: 'ClientManagement/FETCH_SYSTEM_ACCOUNTS',
  FETCH_CLIENTS: 'ClientManagement/FETCH_CLIENTS',
  FETCH_CLIENT: 'ClientManagement/FETCH_CLIENT',
  CREATE_CLIENT: 'ClientManagement/CREATE_CLIENT',
  UPDATE_CLIENT: 'ClientManagement/UPDATE_CLIENT',
  DELETE_CLIENT: 'ClientManagement/DELETE_CLIENT',
  RESET: 'ClientManagement/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  clients: [] as ReadonlyArray<IClient>,
  client: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0
};

export type ClientManagementState = Readonly<typeof initialState>;

// Reducer
export default (state: ClientManagementState = initialState, action): ClientManagementState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CLIENTS):
    case REQUEST(ACTION_TYPES.FETCH_CLIENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CLIENT):
    case REQUEST(ACTION_TYPES.UPDATE_CLIENT):
    case REQUEST(ACTION_TYPES.DELETE_CLIENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CLIENTS):
    case FAILURE(ACTION_TYPES.FETCH_CLIENT):
    case FAILURE(ACTION_TYPES.CREATE_CLIENT):
    case FAILURE(ACTION_TYPES.UPDATE_CLIENT):
    case FAILURE(ACTION_TYPES.DELETE_CLIENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CLIENTS):
      return {
        ...state,
        loading: false,
        clients: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_CLIENT):
      return {
        ...state,
        loading: false,
        client: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CLIENT):
    case SUCCESS(ACTION_TYPES.UPDATE_CLIENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        client: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CLIENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        client: defaultValue
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const clientApiUrl = AUTH_API_URL + '/clients';
// Actions
export const getClients: ICrudGetAllAction<IClient> = (page, size, sort) => {
  const requestUrl = `${clientApiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&itemsPerPage=${size}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CLIENTS,
    payload: axios.get<IClient>(requestUrl)
  };
};

export const getClient: ICrudGetAction<IClient> = id => {
  const requestUrl = `${clientApiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CLIENT,
    payload: axios.get<IClient>(requestUrl)
  };
};

export const createClient: ICrudPutAction<IClient> = client => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CLIENT,
    payload: axios.post(clientApiUrl, client)
  });
  dispatch(getClients());
  return result;
};

export const updateClient: ICrudPutAction<IClient> = client => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CLIENT,
    payload: axios.put(clientApiUrl, client)
  });
  dispatch(getClients());
  return result;
};

export const deleteClient: ICrudDeleteAction<IClient> = id => async dispatch => {
  const requestUrl = `${clientApiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CLIENT,
    payload: axios.delete(requestUrl)
  });
  dispatch(getClients());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
