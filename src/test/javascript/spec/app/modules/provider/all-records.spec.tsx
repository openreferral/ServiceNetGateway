import React from 'react';
import AllRecords from 'app/modules/provider/all-records';
import { store } from './shared/data';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

describe('All records', () => {
  let mountedWrapper;

  it('renders correctly', () => {
    mountedWrapper = mount(
      <Provider store={store}>
        <AllRecords />
      </Provider>
    );
    expect(mountedWrapper).toMatchSnapshot();
  });
});
