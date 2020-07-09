export const ACTION_TYPES = {
  UPDATE_SHELTER_FILTER: 'filterShelter/UPDATE_SHELTER_FILTER'
};

export const initialState = {
  loading: false,
  errorMessage: null,
  shelterFilter: {
    definedCoverageAreas: [],
    tags: [],
    showOnlyAvailableBeds: false,
    showPartner: false,
    applyLocationSearch: false,
    latitude: null,
    longitude: null,
    radius: 1
  }
};

export type FilterShelterState = Readonly<typeof initialState>;

export default (state: FilterShelterState = initialState, action): FilterShelterState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_SHELTER_FILTER:
      return {
        ...state,
        shelterFilter: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export const updateShelterFilter = (shelterFilter, callback?) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_SHELTER_FILTER,
    payload: shelterFilter
  });
  if (callback) {
    callback();
  }
};
