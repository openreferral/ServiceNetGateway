import axios from 'axios';
import { ICrudGetAction, ICrudPutAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

import { defaultValue, IOrganization } from 'app/shared/model/organization.model';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';
import { IUser } from 'app/shared/model/user.model';

export const ACTION_TYPES = {
  SEARCH_ORGANIZATIONS: 'users-organizations/SEARCH_ORGANIZATIONS',
  SEARCH_USERS: 'users-organizations/SEARCH_USERS',
  FETCH_ORGANIZATION: 'users-organizations/FETCH_ORGANIZATION',
  UPDATE_ORGANIZATION: 'users-organizations/UPDATE_ORGANIZATION'
};

const initialState = {
  loading: false,
  loadingUsers: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IOrganization>,
  users: [] as ReadonlyArray<IUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type UsersOrganizationsState = Readonly<typeof initialState>;
// Reducer

export default (state: UsersOrganizationsState = initialState, action): UsersOrganizationsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_ORGANIZATIONS):
    case REQUEST(ACTION_TYPES.FETCH_ORGANIZATION):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case REQUEST(ACTION_TYPES.UPDATE_ORGANIZATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case REQUEST(ACTION_TYPES.SEARCH_USERS):
      return {
        ...state,
        errorMessage: null,
        loadingUsers: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_ORGANIZATIONS):
    case FAILURE(ACTION_TYPES.FETCH_ORGANIZATION):
    case FAILURE(ACTION_TYPES.UPDATE_ORGANIZATION):
    case FAILURE(ACTION_TYPES.SEARCH_USERS):
      return {
        ...state,
        loading: false,
        updating: false,
        loadingUsers: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_ORGANIZATIONS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: action.payload.headers['x-total-count']
      };
    case SUCCESS(ACTION_TYPES.FETCH_ORGANIZATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SEARCH_USERS):
      return {
        ...state,
        loadingUsers: false,
        users: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.UPDATE_ORGANIZATION):
      return {
        ...state,
        updating: false,
        loading: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    default:
      return state;
  }
};

const orgApiUrl = SERVICENET_API_URL + '/organizations';
const userApiUrl = SERVICENET_API_URL + '/users';

// Actions

export const searchOrganizations = (name, systemAccount, page, size, sort) => {
  const requestUrl = `${orgApiUrl}/search/${sort ? `?name=${name}&systemAccount=${systemAccount}&page=${page}&size=${size}&sort=${sort}`
    : `?name=${name}&systemAccount=${systemAccount}`}`;
  return {
    type: ACTION_TYPES.SEARCH_ORGANIZATIONS,
    payload: axios.get<IOrganization>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getOrganization: ICrudGetAction<IOrganization> = id => {
  const requestUrl = `${orgApiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ORGANIZATION,
    payload: axios.get<IOrganization>(requestUrl)
  };
};

export const searchUsers = systemAccount => {
  const requestUrl = `${userApiUrl}/search/?systemAccount=${systemAccount}`;
  return {
    type: ACTION_TYPES.SEARCH_USERS,
    payload: axios.get<IUser>(`${requestUrl}&cacheBuster=${new Date().getTime()}`)
  };
};

export const updateOrganization: ICrudPutAction<IOrganization> = entity => async dispatch => dispatch({
  type: ACTION_TYPES.UPDATE_ORGANIZATION,
  payload: axios.put(`${orgApiUrl}`, cleanEntity(entity))
});
