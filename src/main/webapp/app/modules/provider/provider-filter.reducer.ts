export const ACTION_TYPES = {
  UPDATE_FILTER: 'providerFilter/UPDATE_FILTER',
  RESET_FILTER: 'providerFilter/RESET_FILTER',
  CHECK_FILTERS_CHANGED: 'providerFilter/SET_FILTERS_CHANGED',
  UNCHECK_FILTERS_CHANGED: 'providerFilter/UNCHECK_FILTERS_CHANGED'
};

const FILTER_DEFAULT = {
  city: '',
  region: '',
  zip: '',
  serviceTypes: [] as any[]
};

const initialState = {
  filter: {
    ...FILTER_DEFAULT
  },
  defaultFilter: FILTER_DEFAULT,
  filtersChanged: false
};

export type ProviderFilterState = Readonly<typeof initialState>;

export default (state: ProviderFilterState = initialState, action): ProviderFilterState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload
        }
      };
    case ACTION_TYPES.RESET_FILTER:
      return {
        ...state,
        filter: { ...FILTER_DEFAULT }
      };
    case ACTION_TYPES.CHECK_FILTERS_CHANGED:
      return {
        ...state,
        filtersChanged: true
      };
    case ACTION_TYPES.UNCHECK_FILTERS_CHANGED:
      return {
        ...state,
        filtersChanged: false
      };
    default:
      return state;
  }
};

export const updateFilter = filter => ({
  type: ACTION_TYPES.UPDATE_FILTER,
  payload: filter
});

export const reset = () => ({
  type: ACTION_TYPES.RESET_FILTER
});

export const checkFiltersChanged = () => ({
  type: ACTION_TYPES.CHECK_FILTERS_CHANGED
});

export const uncheckFiltersChanged = () => ({
  type: ACTION_TYPES.UNCHECK_FILTERS_CHANGED
});
