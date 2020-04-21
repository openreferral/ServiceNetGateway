import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IClient, defaultValue } from 'app/shared/model/client.model';
import { AUTH_API_URL, SERVICENET_API_URL } from 'app/shared/util/service-url.constants';

export const ACTION_TYPES = {
  FETCH_ROLES: 'ClientManagement/FETCH_ROLES',
  FETCH_SYSTEM_ACCOUNTS: 'ClientManagement/FETCH_SYSTEM_ACCOUNTS',
  FETCH_CLIENTS: 'ClientManagement/FETCH_CLIENTS',
  FETCH_CLIENT: 'ClientManagement/FETCH_CLIENT',
  CREATE_CLIENT: 'ClientManagement/CREATE_CLIENT',
  UPDATE_CLIENT: 'ClientManagement/UPDATE_CLIENT',
  DELETE_CLIENT: 'ClientManagement/DELETE_CLIENT',
  RESET: 'ClientManagement/RESET',
  CREATE_CLIENT_PROFILE: 'CREATE_CLIENT_PROFILE',
  UPDATE_CLIENT_PROFILE: 'UPDATE_CLIENT_PROFILE',
  DELETE_CLIENT_PROFILE: 'DELETE_CLIENT_PROFILE',
  READ_CLIENT_PROFILE: 'READ_CLIENT_PROFILE',
  READ_ALL_CLIENT_PROFILE: 'READ_ALL_CLIENT_PROFILE',
  RESET_CLIENT_PROFILE: 'RESET_CLIENT_PROFILE'
};

const initialState = {
  loading: false,
  errorMessage: null,
  clients: [] as ReadonlyArray<IClient>,
  client: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
  clientProfile: {},
  clientProfiles: []
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
    case REQUEST(ACTION_TYPES.CREATE_CLIENT_PROFILE):
    case REQUEST(ACTION_TYPES.UPDATE_CLIENT_PROFILE):
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
    case FAILURE(ACTION_TYPES.CREATE_CLIENT_PROFILE):
    case FAILURE(ACTION_TYPES.UPDATE_CLIENT_PROFILE):
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
    case SUCCESS(ACTION_TYPES.CREATE_CLIENT_PROFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_CLIENT_PROFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true
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
    case SUCCESS(ACTION_TYPES.READ_CLIENT_PROFILE):
      return {
        ...state,
        clientProfile: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.READ_ALL_CLIENT_PROFILE):
      return {
        ...state,
        clientProfiles: action.payload.data
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.RESET_CLIENT_PROFILE:
      return {
        ...state,
        clientProfile: {}
      };
    default:
      return state;
  }
};

const clientApiUrl = AUTH_API_URL + '/clients';
const clientProfileUrl = SERVICENET_API_URL + '/client-profiles';

// Actions
export const getClients: ICrudGetAllAction<IClient> = (page, size, sort) => dispatch => {
  sort = sort === 'id' ? 'clientId' : sort;
  const requestUrl = `${clientApiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&itemsPerPage=${size}` : ''}`;
  const result = dispatch({
    type: ACTION_TYPES.FETCH_CLIENTS,
    payload: axios.get<IClient>(requestUrl)
  }).then(res => {
    dispatch(readAllClientProfiles());
  });
  return result;
};

export const getClient: (id) => (dispatch) => Promise<any> = id => async dispatch => {
  dispatch({
    type: ACTION_TYPES.RESET_CLIENT_PROFILE
  });
  const requestUrl = `${clientApiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.FETCH_CLIENT,
    payload: axios.get<IClient>(requestUrl)
  }).then(res => {
    dispatch(readClientProfile(id));
  });
  return result;
};

export const createClient: ICrudPutAction<IClient> = client => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CLIENT,
    payload: axios.post(clientApiUrl, client)
  }).then(res => {
    dispatch(
      createClientProfile({
        clientId: client.clientId,
        systemAccount: client.systemAccountId
      })
    );
  });
  dispatch(getClients());
  return result;
};

export const updateClient: ICrudPutAction<IClient> = client => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CLIENT,
    payload: axios.put(clientApiUrl, client)
  }).then(res => {
    dispatch(
      updateClientProfile({
        clientId: client.clientId,
        systemAccount: client.systemAccountId
      })
    );
  });
  dispatch(getClients());
  return result;
};

export const deleteClient: ICrudDeleteAction<IClient> = id => async dispatch => {
  const requestUrl = `${clientApiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CLIENT,
    payload: axios.delete(requestUrl)
  }).then(res => {
    dispatch(deleteClientProfile(id));
  });
  dispatch(getClients());
  return result;
};

export const createClientProfile = clientProfile => ({
  type: ACTION_TYPES.CREATE_CLIENT_PROFILE,
  payload: axios.post(clientProfileUrl, clientProfile)
});

export const updateClientProfile = clientProfile => ({
  type: ACTION_TYPES.UPDATE_CLIENT_PROFILE,
  payload: axios.put(clientProfileUrl, clientProfile)
});

export const deleteClientProfile = clientProfileId => {
  const url = `${clientProfileUrl}/${clientProfileId}`;
  return {
    type: ACTION_TYPES.DELETE_CLIENT_PROFILE,
    payload: axios.delete(url)
  };
};

export const readClientProfile = clientProfileId => {
  const url = `${clientProfileUrl}/${clientProfileId}`;
  return {
    type: ACTION_TYPES.READ_CLIENT_PROFILE,
    payload: axios.get(url)
  };
};

export const readAllClientProfiles = () => ({
  type: ACTION_TYPES.READ_ALL_CLIENT_PROFILE,
  payload: axios.get(clientProfileUrl)
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
