export const ACTION_TYPES = {
  UPDATE_FILTER: 'providerFilter/UPDATE_FILTER',
  RESET_FILTER: 'providerFilter/RESET_FILTER'
};

const initialState = {
  filter: {
    city: '',
    region: '',
    zip: '',
    serviceTypes: [] as any[]
  }
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
      return initialState;
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
