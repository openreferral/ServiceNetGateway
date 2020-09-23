import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import reducer, {
  ACTION_TYPES,
  initialState,
  getPostalCodeList,
  getRegionList,
  getCityList,
  getPostalCodeListForServiceProviders,
  getRegionListForServiceProviders,
  getCityListForServiceProviders,
  getPartnerList,
  getTaxonomyMap,
  updateActivityFilter,
  getSavedFilters,
  resetActivityFilter
} from 'app/modules/home/filter-activity.reducer';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { getDefaultSearchFieldOptions, ORGANIZATION } from 'app/modules/home/filter.constants';
import axios from 'axios';

describe('Filter activity reducer', () => {
  function isEmpty(element) {
    if (element instanceof Array) {
      return element.length === 0;
    } else {
      return Object.keys(element).length === 0;
    }
  }

  function testInitialState(state) {
    expect(state).toMatchObject(initialState);
    expect(isEmpty(state.postalCodeList));
    expect(isEmpty(state.cityList));
    expect(isEmpty(state.savedFilters));
    expect(isEmpty(state.activityFilter.citiesFilterList));
    expect(isEmpty(state.activityFilter.regionFilterList));
    expect(isEmpty(state.activityFilter.postalCodesFilterList));
  }

  function testMultipleTypes(types, payload, testFunction) {
    types.forEach(e => {
      testFunction(reducer(undefined, { type: e, payload }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(reducer(undefined, {}));
    });

    it('should reset the activityFilter state', () => {
      expect(
        reducer(
          {
            ...initialState,
            activityFilter: {
              ...initialState.activityFilter,
              showOnlyHighlyMatched: true
            }
          },
          {
            type: ACTION_TYPES.RESET_ACTIVITY_FILTER
          }
        )
      ).toEqual({
        ...initialState
      });
    });
  });

  describe('Failures', () => {
    it('should set a message in errorMessage', () => {
      testMultipleTypes(
        [
          FAILURE(ACTION_TYPES.FETCH_POSTAL_CODE_LIST),
          FAILURE(ACTION_TYPES.FETCH_REGION_LIST),
          FAILURE(ACTION_TYPES.FETCH_CITY_LIST),
          FAILURE(ACTION_TYPES.FETCH_PARTNER_LIST),
          FAILURE(ACTION_TYPES.FETCH_TAXONOMY_LIST),
          FAILURE(ACTION_TYPES.FETCH_SAVED_FILTERS)
        ],
        'error message',
        state => {
          expect(state).toMatchObject({
            loading: false,
            errorMessage: 'error message'
          });
        }
      );
    });
  });

  describe('Requests', () => {
    it('should set a message in errorMessage', () => {
      testMultipleTypes(
        [
          REQUEST(ACTION_TYPES.DELETE_ACTIVITY_FILTER),
          REQUEST(ACTION_TYPES.FETCH_POSTAL_CODE_LIST),
          REQUEST(ACTION_TYPES.FETCH_REGION_LIST),
          REQUEST(ACTION_TYPES.FETCH_CITY_LIST),
          REQUEST(ACTION_TYPES.FETCH_PARTNER_LIST),
          REQUEST(ACTION_TYPES.FETCH_TAXONOMY_LIST),
          REQUEST(ACTION_TYPES.FETCH_SAVED_FILTERS)
        ],
        'error message',
        state => {
          expect(state).toMatchObject({
            errorMessage: null,
            loading: true
          });
        }
      );
    });
  });

  describe('Successes', () => {
    it('should fetch all cities', () => {
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }], headers: { 'x-total-count': 123 } };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_CITY_LIST),
          payload
        })
      ).toEqual({
        ...initialState,
        cityList: payload.data,
        loading: false
      });
    });

    it('should fetch all regions', () => {
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }], headers: { 'x-total-count': 123 } };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_REGION_LIST),
          payload
        })
      ).toEqual({
        ...initialState,
        regionList: payload.data,
        loading: false
      });
    });

    it('should fetch all saved filters', () => {
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }], headers: { 'x-total-count': 123 } };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_SAVED_FILTERS),
          payload
        })
      ).toEqual({
        ...initialState,
        savedFilters: payload.data,
        loading: false
      });
    });

    it('should fetch all partners', () => {
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }] };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_PARTNER_LIST),
          payload,
          meta: {
            'siloName': '',
            'userName': ''
          }
        })
      ).toEqual({
        ...initialState,
        partnerList: payload.data,
        loading: false
      });
    });

    it('should fetch all postal codes', () => {
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }] };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_POSTAL_CODE_LIST),
          payload
        })
      ).toEqual({
        ...initialState,
        postalCodeList: payload.data,
        loading: false
      });
    });

    it('should fetch all taxonomy lists', () => {
      const payload = {
        data: {
          currentProvider: [{ 1: 'fake1' }, { 2: 'fake2' }],
          taxonomiesByProvider: [{ 1: 'fake1' }, { 2: 'fake2' }]
        }
      };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_TAXONOMY_LIST),
          payload,
          meta: {
            'siloName': '',
            'userName': ''
          }
        })
      ).toEqual({
        ...initialState,
        taxonomyMap: payload.data.taxonomiesByProvider,
        currentProvider: payload.data.currentProvider,
        loading: false
      });
    });

    it('should update activity filter', () => {
      const payload = {
        citiesFilterList: [],
        regionFilterList: [],
        postalCodesFilterList: [],
        partnerFilterList: [],
        taxonomiesFilterList: [],
        searchFields: getDefaultSearchFieldOptions().map(o => o.value),
        searchOn: ORGANIZATION,
        dateFilter: null,
        fromDate: '',
        toDate: '',
        hiddenFilter: true,
        showPartner: false,
        showOnlyHighlyMatched: false,
        applyLocationSearch: false,
        latitude: 21.2121,
        longitude: -37.3737,
        radius: 2
      };
      expect(
        reducer(undefined, {
          type: ACTION_TYPES.UPDATE_ACTIVITY_FILTER,
          payload
        })
      ).toEqual({
        ...initialState,
        activityFilter: payload,
        loading: false
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware]);
      store = mockStore({});
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.put = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.delete = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches ACTION_TYPES.FETCH_POSTAL_CODE_LIST actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_POSTAL_CODE_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_POSTAL_CODE_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getPostalCodeList()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.FETCH_REGION_LIST actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_REGION_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_REGION_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getRegionList()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.FETCH_CITY_LIST actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_CITY_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_CITY_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getCityList()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.FETCH_POSTAL_CODE_LIST actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_POSTAL_CODE_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_POSTAL_CODE_LIST),
          payload: resolvedObject
        }
      ];
    });

    it('dispatches ACTION_TYPES.FETCH_PARTNER_LIST actions', async () => {
      const meta = {
        'siloName': '',
        'userName': ''
      };
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_PARTNER_LIST),
          meta
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_PARTNER_LIST),
          payload: resolvedObject,
          meta
        }
      ];
      await store.dispatch(getPartnerList()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.FETCH_TAXONOMY_LIST actions', async () => {
      const meta = {
        'siloName': '',
        'userName': ''
      };
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_TAXONOMY_LIST),
          meta
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_TAXONOMY_LIST),
          payload: resolvedObject,
          meta
        }
      ];
      await store.dispatch(getTaxonomyMap()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.UPDATE_ACTIVITY_FILTER actions', async () => {
      const activityFilter = {
        citiesFilterList: [],
        regionFilterList: [],
        postalCodesFilterList: [],
        partnerFilterList: [],
        taxonomiesFilterList: [],
        searchFields: getDefaultSearchFieldOptions().map(o => o.value),
        searchOn: ORGANIZATION,
        dateFilter: null,
        fromDate: '',
        toDate: '',
        hiddenFilter: false,
        showPartner: false,
        showOnlyHighlyMatched: false,
        applyLocationSearch: false,
        latitude: null,
        longitude: null,
        radius: 2
      };
      const expectedActions = [
        {
          type: ACTION_TYPES.UPDATE_ACTIVITY_FILTER,
          payload: activityFilter
        }
      ];
      await store.dispatch(updateActivityFilter(activityFilter));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches ACTION_TYPES.FETCH_SAVED_FILTERS actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_SAVED_FILTERS)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_SAVED_FILTERS),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getSavedFilters()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.RESET_ACTIVITY_FILTER action', async () => {
      const expectedActions = [
        {
          type: ACTION_TYPES.RESET_ACTIVITY_FILTER
        }
      ];
      await store.dispatch(resetActivityFilter());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches ACTION_TYPES.FETCH_CITY_LIST actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_CITY_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_CITY_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getCityList()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
  });
});
