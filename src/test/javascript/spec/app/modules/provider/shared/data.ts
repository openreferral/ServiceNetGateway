import configureStore from 'redux-mock-store';
import allRecords from './data/allRecords.json';
import allRecordsForMap from './data/allRecordsForMap.json';
import account from '../../conflicts/shared/data/account.json';
import { initialState as providerFilterState } from 'app/modules/provider/provider-filter.reducer';

const mockStore = configureStore([]);

export const store = mockStore({
  providerRecord: {
    allRecords,
    allRecordsTotal: 12,
    allRecordsForMap,
    selectedRecord: null,
    filtersChanged: false
  },
  authentication: {
    account
  },
  providerFilter: providerFilterState,
  search: {
    text: ''
  },
  location: {
    entities: []
  },
  organization: {
    updating: true,
    updateSuccess: true,
    providersEntity: {
      id: '123',
      name: 'fakeName',
      description: 'fakeDesc',
      email: 'fakeEmail',
      url: 'fakeUrl',
      updatedAt: 'fakeDate',
      locations: [],
      services: [],
      dailyUpdates: []
    }
  },
  taxonomy: {
    providerTaxonomies: []
  },
  filterActivity: {
    providersPostalCodeList: [],
    providersRegionList: [],
    providersCityList: [],
    partnerList: [],
    selectedCity: [],
    selectedCounty: [],
    selectedZip: [],
    selectedTaxonomy: [],
    selectedSearchFields: [],
    activityFilter: {
      citiesFilterList: [],
      regionFilterList: [],
      postalCodesFilterList: [],
      taxonomiesFilterList: [],
      searchFields: [],
      showPartner: false
    }
  }
});

export const commonProps = {};
