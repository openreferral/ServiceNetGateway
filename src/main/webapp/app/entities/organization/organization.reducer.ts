import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IOrganization, defaultValue } from 'app/shared/model/organization.model';
import { SERVICENET_API_URL, SERVICENET_PUBLIC_API_URL } from 'app/shared/util/service-url.constants';
import { ISimpleOrganization, defaultSimpleOrganization } from 'app/shared/model/simple-organization.model';
import { IOrganizationOption } from 'app/shared/model/organization-option.model';

export const ACTION_TYPES = {
  FETCH_ORGANIZATION_LIST: 'organization/FETCH_ORGANIZATION_LIST',
  FETCH_ORGANIZATION_OPTIONS: 'organization/FETCH_ORGANIZATION_OPTIONS',
  FETCH_ORGANIZATION: 'organization/FETCH_ORGANIZATION',
  FETCH_SIMPLE_ORGANIZATION: 'organization/FETCH_SIMPLE_ORGANIZATION',
  CREATE_ORGANIZATION: 'organization/CREATE_ORGANIZATION',
  UPDATE_ORGANIZATION: 'organization/UPDATE_ORGANIZATION',
  DELETE_ORGANIZATION: 'organization/DELETE_ORGANIZATION',
  DEACTIVATE_ORGANIZATION: 'organization/DEACTIVATE_ORGANIZATION',
  SET_BLOB: 'organization/SET_BLOB',
  RESET: 'organization/RESET',
  CLAIM_RECORDS: 'organization/CLAIM_RECORDS',
  UNCLAIM_RECORDS: 'organization/UNCLAIM_RECORDS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IOrganization>,
  entity: defaultValue,
  providersEntity: defaultSimpleOrganization,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  options: [] as ReadonlyArray<IOrganizationOption>,
  claimSuccess: false
};

export type OrganizationState = Readonly<typeof initialState>;
// Reducer

export default (state: OrganizationState = initialState, action): OrganizationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ORGANIZATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ORGANIZATION):
    case REQUEST(ACTION_TYPES.FETCH_SIMPLE_ORGANIZATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_ORGANIZATION):
    case REQUEST(ACTION_TYPES.UPDATE_ORGANIZATION):
    case REQUEST(ACTION_TYPES.DELETE_ORGANIZATION):
    case REQUEST(ACTION_TYPES.DEACTIVATE_ORGANIZATION):
    case REQUEST(ACTION_TYPES.CLAIM_RECORDS):
    case REQUEST(ACTION_TYPES.UNCLAIM_RECORDS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
        claimSuccess: false
      };
    case FAILURE(ACTION_TYPES.FETCH_ORGANIZATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ORGANIZATION):
    case FAILURE(ACTION_TYPES.FETCH_SIMPLE_ORGANIZATION):
    case FAILURE(ACTION_TYPES.CREATE_ORGANIZATION):
    case FAILURE(ACTION_TYPES.UPDATE_ORGANIZATION):
    case FAILURE(ACTION_TYPES.DELETE_ORGANIZATION):
    case FAILURE(ACTION_TYPES.DEACTIVATE_ORGANIZATION):
    case FAILURE(ACTION_TYPES.CLAIM_RECORDS):
    case FAILURE(ACTION_TYPES.UNCLAIM_RECORDS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
        claimSuccess: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_ORGANIZATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: action.payload.headers['x-total-count']
      };
    case SUCCESS(ACTION_TYPES.FETCH_ORGANIZATION_OPTIONS):
      return {
        ...state,
        options: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ORGANIZATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SIMPLE_ORGANIZATION):
      return {
        ...state,
        loading: false,
        providersEntity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_ORGANIZATION):
    case SUCCESS(ACTION_TYPES.UPDATE_ORGANIZATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_ORGANIZATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case SUCCESS(ACTION_TYPES.DEACTIVATE_ORGANIZATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case SUCCESS(ACTION_TYPES.CLAIM_RECORDS):
    case SUCCESS(ACTION_TYPES.UNCLAIM_RECORDS):
      return {
        ...state,
        updating: false,
        claimSuccess: true
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

const apiUrl = SERVICENET_API_URL + '/organizations';
const optionApiUrl = SERVICENET_API_URL + '/organization-options';
const providerOptionApiUrl = SERVICENET_PUBLIC_API_URL + '/provider-organization-options';

// Actions

export const getEntities: ICrudGetAllAction<IOrganization> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ORGANIZATION_LIST,
    payload: axios.get<IOrganization>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getOrganizationOptions: ICrudGetAllAction<IOrganizationOption> = () => ({
  type: ACTION_TYPES.FETCH_ORGANIZATION_OPTIONS,
  payload: axios.get<IOrganizationOption>(optionApiUrl)
});

export const getProviderOrganizationOptions: ICrudGetAllAction<IOrganizationOption> = () => ({
  type: ACTION_TYPES.FETCH_ORGANIZATION_OPTIONS,
  payload: axios.get<IOrganizationOption>(providerOptionApiUrl)
});

export const getEntity: ICrudGetAction<IOrganization> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ORGANIZATION,
    payload: axios.get<IOrganization>(requestUrl)
  };
};

export const getProviderEntity = (id, siloName = '') => {
  const baseUrl = siloName ? SERVICENET_PUBLIC_API_URL : SERVICENET_API_URL;
  const requestUrl = `${baseUrl}/provider-organization/${id}?siloName=${siloName}`;
  return {
    type: ACTION_TYPES.FETCH_SIMPLE_ORGANIZATION,
    payload: axios.get<ISimpleOrganization>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IOrganization> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ORGANIZATION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const createUserOwnedEntity: ICrudPutAction<IOrganization> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ORGANIZATION,
    payload: axios.post(`${apiUrl}/user-owned`, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateUserOwnedEntity: ICrudPutAction<IOrganization> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ORGANIZATION,
    payload: axios.put(`${apiUrl}/user-owned`, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IOrganization> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ORGANIZATION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IOrganization> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ORGANIZATION,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const deactivateEntity: ICrudDeleteAction<IOrganization> = id => async dispatch => {
  const requestUrl = `${apiUrl}/deactivate/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DEACTIVATE_ORGANIZATION,
    payload: axios.post(requestUrl)
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

export const claimEntities = listOfIds => async dispatch => {
  const requestUrl = `${SERVICENET_API_URL}/claim-records`;
  const result = await dispatch({
    type: ACTION_TYPES.CLAIM_RECORDS,
    payload: axios.post(requestUrl, listOfIds)
  });
  dispatch(getEntities());
  return result;
};

export const unclaimEntity = recordId => async dispatch => {
  const requestUrl = `${SERVICENET_API_URL}/unclaim-record?recordId=${recordId}`;
  const result = await dispatch({
    type: ACTION_TYPES.UNCLAIM_RECORDS,
    payload: axios.post(requestUrl)
  });
  dispatch(getEntities());
  return result;
};
