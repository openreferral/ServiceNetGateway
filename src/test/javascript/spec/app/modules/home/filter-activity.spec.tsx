import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { Button, Col } from 'reactstrap';
import Select from 'react-select';

import FilterActivity from 'app/modules/home/filter-activity';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import axios from 'axios';
import { Provider } from 'react-redux';
import reducer from 'app/shared/reducers';
import { createStore } from 'redux';

const DATE_RANGE = 'DATE_RANGE';
const LAST_7_DAYS = 'LAST_7_DAYS';

describe('Filter Activity', () => {
  let mountedWrapper;
  let store;

  const fakeState: any = {
    filterActivity: {
      postalCodeList: [1, 2, 3, 4],
      regionList: ['fake1', 'fake2'],
      cityList: ['fake1', 'fake2'],
      partnerList: ['fake1', 'fake2'],
      selectedCity: ['fake1', 'fake2'],
      selectedCounty: ['fake1', 'fake2'],
      selectedZip: ['fake1', 'fake2'],
      selectedTaxonomy: ['fake1', 'fake2'],
      selectedSearchFields: ['fake1', 'fake2'],
      activityFilter: {
        citiesFilterList: ['fake1', 'fake2'],
        regionFilterList: ['fake1', 'fake2'],
        postalCodesFilterList: ['fake1', 'fake2'],
        taxonomiesFilterList: ['fake1', 'fake2'],
        searchFields: ['fake1', 'fake2'],
        showPartner: false
      }
    },
    authentication: {
      loggingOut: false
    }
  };

  const getFilterActivity = (activityFilter, realStore?) => {
    const mockStore = configureStore([thunk, promiseMiddleware]);
    store = mockStore({
      ...fakeState,
      filterActivity: {
        ...fakeState.filterActivity,
        activityFilter: {
          ...fakeState.filterActivity.activityFilter,
          ...activityFilter
        }
      }
    });
    mountedWrapper = mount(
      <Provider store={realStore ? realStore : store}>
        <FilterActivity key="abc" filterCollapseExpanded getActivityEntities={() => {}} resetActivityFilter={() => {}} />
      </Provider>
    );
    return mountedWrapper;
  };

  beforeEach(() => {
    const resolvedObject = { value: 'whatever' };
    mountedWrapper = undefined;
    const mockStore = configureStore([thunk, promiseMiddleware]);
    store = mockStore({});
    axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
    axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
    axios.put = sinon.stub().returns(Promise.resolve(resolvedObject));
    axios.delete = sinon.stub().returns(Promise.resolve(resolvedObject));
  });

  // All tests will go here

  it('renders a select with only matching taxonomies', () => {
    const wrapper = getFilterActivity({ showPartner: false });
    const selects = wrapper.find(Select).findWhere(node => node.key() === 'taxonomy-select-only-show-matching');
    expect(selects).toHaveLength(1);
  });

  it('renders a select with all taxonomies', () => {
    const wrapper = getFilterActivity({ showPartner: true });
    const selects = wrapper.find(Select).findWhere(node => node.key() === 'taxonomy-select');
    expect(selects).toHaveLength(1);
  });

  it('renders date select inputs', () => {
    const wrapper = getFilterActivity({ dateFilter: DATE_RANGE });
    const dateInput = wrapper.find(Col).findWhere(node => node.key() === 'fromDate');
    expect(dateInput).toHaveLength(1);
  });

  it("doesn't render date select inputs", () => {
    const wrapper = getFilterActivity({ dateFilter: LAST_7_DAYS });
    const dateInput = wrapper.find(Col).findWhere(node => node.key() === 'fromDate');
    expect(dateInput).toHaveLength(0);
  });

  it('set location after clicking location button', () => {
    const wrapper = getFilterActivity({ dateFilter: LAST_7_DAYS });
    const mockPosition = {
      coords: {
        latitude: 2,
        longitude: 3
      }
    };
    const mockGeolocation = {
      getCurrentPosition: jest.fn(callback => callback(mockPosition))
    };
    // @ts-ignore
    navigator.geolocation = mockGeolocation;
    const locationButton = wrapper.find(Button).findWhere(node => node.key() === 'location-button');
    locationButton.simulate('click');
    const instance = wrapper
      .find(FilterActivity)
      .childAt(0)
      .instance().state;
    expect(instance.lat).toEqual(mockPosition.coords.latitude);
    expect(instance.lng).toEqual(mockPosition.coords.longitude);
  });

  it('should apply filter', () => {
    const realStore = createStore(reducer, fakeState);
    const wrapper = getFilterActivity({}, realStore);
    expect(
      wrapper
        .find(FilterActivity)
        .childAt(0)
        .instance().props.onlyShowMatching
    ).toEqual(true);
    const showOnlyMatchingCheckbox = wrapper.findWhere(node => node.prop('id') === 'onlyShowMatchingCheckbox');
    showOnlyMatchingCheckbox.simulate('change', { target: { checked: false } });
    wrapper.update();
    const instance = wrapper
      .find(FilterActivity)
      .childAt(0)
      .instance().props;
    expect(instance.onlyShowMatching).toEqual(false);
  });

  it('should reset filter', () => {
    const realStore = createStore(reducer, fakeState);
    const wrapper = getFilterActivity({}, realStore);
    const showOnlyMatchingCheckbox = wrapper.findWhere(node => node.prop('id') === 'onlyShowMatchingCheckbox');
    showOnlyMatchingCheckbox.simulate('change', { target: { checked: false } });
    const instance = wrapper
      .find(FilterActivity)
      .childAt(0)
      .instance().state;
    expect(instance.filtersChanged).toEqual(true);
    expect(
      wrapper
        .find(FilterActivity)
        .childAt(0)
        .instance().props.activityFilter.showPartner
    ).toEqual(true);
    const resetButton = wrapper.findWhere(node => node.key() === 'resetButton');
    resetButton.simulate('click');
    expect(
      wrapper
        .find(FilterActivity)
        .childAt(0)
        .instance().props.activityFilter.showPartner
    ).toEqual(false);
  });

  it('renders correctly', () => {
    const realStore = createStore(reducer, fakeState);
    const wrapper = getFilterActivity({}, realStore);
    expect(wrapper).toMatchSnapshot();
  });
});
