import React from 'react';
import RecordEdit from 'app/modules/provider/record/record-edit';
import { store } from './shared/data';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

describe('Record edit', () => {
  let mountedWrapper;

  it('renders correctly', () => {
    const props = {
      match: {
        params: {
          id: 123
        }
      }
    };
    mountedWrapper = mount(
      <Provider store={store}>
        <Router>
          // @ts-ignore
          <RecordEdit {...props} />
        </Router>
      </Provider>
    );
    expect(mountedWrapper).toMatchSnapshot();
  });
});
