import {
  defaultSearchPreferences,
  getSearchPreferences,
  resetSearchPreferences,
  setProviderSort,
  setSearchPhrase,
  setShelterSearchPhrase,
  setShelterSort,
  setSort
} from 'app/shared/util/search-utils';
import { Storage } from 'react-jhipster';
import _ from 'lodash';

describe('Search utils', () => {
  const USERNAME_WITH_MODIFIED_PREFERENCES = 'userWithModifiedPreferences';
  const USERNAME_WITH_NO_PREFERENCES = 'userWithNoPreferences';
  const USERNAME_WITH_CORRUPTED_PREFERENCES = 'userWithCorruptedPreferences';
  const USERNAME_WITH_DEFAULT_PREFERENCES = 'userWithDefaultPreferences';
  const SORT = 'sort example';
  const ORDER = 'some order';
  const SEARCH_PHRASE = 'some search phrase';

  describe('getSearchPreferences', () => {
    it('should return default preferences if no username provided', () => {
      expect(getSearchPreferences(null)).toEqual(defaultSearchPreferences);
    });
    it('should return default preferences if there are no preferences for given username', () => {
      Storage.local.remove(USERNAME_WITH_NO_PREFERENCES);
      expect(getSearchPreferences(USERNAME_WITH_NO_PREFERENCES)).toEqual(defaultSearchPreferences);
    });
    it('should reset and return default preferences if users preferences are corrupted', () => {
      let corruptedPreferences = _.cloneDeep(defaultSearchPreferences);
      delete corruptedPreferences['shelterSearchPreferences'];
      Storage.local.set(USERNAME_WITH_CORRUPTED_PREFERENCES, corruptedPreferences);
      expect(getSearchPreferences(USERNAME_WITH_CORRUPTED_PREFERENCES)).toEqual(defaultSearchPreferences);
      expect(Storage.local.get(USERNAME_WITH_CORRUPTED_PREFERENCES)).toEqual(defaultSearchPreferences);

      corruptedPreferences = _.cloneDeep(defaultSearchPreferences);
      delete corruptedPreferences['providerSearchPreferences'];
      Storage.local.set(USERNAME_WITH_CORRUPTED_PREFERENCES, corruptedPreferences);
      expect(getSearchPreferences(USERNAME_WITH_CORRUPTED_PREFERENCES)).toEqual(defaultSearchPreferences);
      expect(Storage.local.get(USERNAME_WITH_CORRUPTED_PREFERENCES)).toEqual(defaultSearchPreferences);
    });
    it('should return users preferences', () => {
      const modifiedPreferences = _.cloneDeep(defaultSearchPreferences);
      modifiedPreferences.order = ORDER;
      expect(getSearchPreferences(USERNAME_WITH_MODIFIED_PREFERENCES)).not.toEqual(modifiedPreferences);
      Storage.local.set(USERNAME_WITH_MODIFIED_PREFERENCES, modifiedPreferences);
      expect(getSearchPreferences(USERNAME_WITH_MODIFIED_PREFERENCES)).toEqual(modifiedPreferences);
    });
  });

  describe('resetSearchPreferences', () => {
    it('should reset users preferences', () => {
      const modifiedPreferences = _.cloneDeep(defaultSearchPreferences);
      modifiedPreferences.order = ORDER;
      Storage.local.set(USERNAME_WITH_MODIFIED_PREFERENCES, modifiedPreferences);
      expect(getSearchPreferences(USERNAME_WITH_MODIFIED_PREFERENCES)).not.toEqual(defaultSearchPreferences);
      resetSearchPreferences(USERNAME_WITH_MODIFIED_PREFERENCES);
      expect(getSearchPreferences(USERNAME_WITH_MODIFIED_PREFERENCES)).toEqual(defaultSearchPreferences);
    });
  });

  describe('setSort', () => {
    it('should set sort and order properties', () => {
      Storage.local.set(USERNAME_WITH_DEFAULT_PREFERENCES, defaultSearchPreferences);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).sort).not.toEqual(SORT);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).order).not.toEqual(ORDER);
      setSort(USERNAME_WITH_DEFAULT_PREFERENCES, SORT, ORDER);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).sort).toEqual(SORT);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).order).toEqual(ORDER);
    });
  });

  describe('setSearchPhrase', () => {
    it('should set search phrase', () => {
      Storage.local.set(USERNAME_WITH_DEFAULT_PREFERENCES, defaultSearchPreferences);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).searchPhrase).not.toEqual(SEARCH_PHRASE);
      setSearchPhrase(USERNAME_WITH_DEFAULT_PREFERENCES, SEARCH_PHRASE);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).searchPhrase).toEqual(SEARCH_PHRASE);
    });
  });

  describe('setShelterSort', () => {
    it('should set shelter sort', () => {
      Storage.local.set(USERNAME_WITH_DEFAULT_PREFERENCES, defaultSearchPreferences);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).shelterSearchPreferences.sort).not.toEqual(SORT);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).shelterSearchPreferences.order).not.toEqual(ORDER);
      setShelterSort(USERNAME_WITH_DEFAULT_PREFERENCES, SORT, ORDER);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).shelterSearchPreferences.sort).toEqual(SORT);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).shelterSearchPreferences.order).toEqual(ORDER);
    });
  });

  describe('setProviderSort', () => {
    it('should set provider sort and order properties', () => {
      Storage.local.set(USERNAME_WITH_DEFAULT_PREFERENCES, defaultSearchPreferences);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).providerSearchPreferences.sort).not.toEqual(SORT);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).providerSearchPreferences.order).not.toEqual(ORDER);
      setProviderSort(USERNAME_WITH_DEFAULT_PREFERENCES, SORT, ORDER);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).providerSearchPreferences.sort).toEqual(SORT);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).providerSearchPreferences.order).toEqual(ORDER);
    });
  });

  describe('setShelterSearchPhrase', () => {
    it('should set shelter search phrase', () => {
      Storage.local.set(USERNAME_WITH_DEFAULT_PREFERENCES, defaultSearchPreferences);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).shelterSearchPreferences.searchPhrase).not.toEqual(SEARCH_PHRASE);
      setShelterSearchPhrase(USERNAME_WITH_DEFAULT_PREFERENCES, SEARCH_PHRASE);
      expect(getSearchPreferences(USERNAME_WITH_DEFAULT_PREFERENCES).shelterSearchPreferences.searchPhrase).toEqual(SEARCH_PHRASE);
    });
  });
});
