import React from 'react';
import RecordCreate from 'app/modules/provider/record/record-create';
import { store } from './shared/data';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';

describe('Record create', () => {
  let mountedWrapper;

  it('renders correctly ', () => {
    const props = {
      isMobile: true
    };
    mountedWrapper = mount(
      <Provider store={store}>
        <Router>
          // @ts-ignore
          <RecordCreate {...props} />
        </Router>
      </Provider>
    );
    expect(mountedWrapper).toMatchSnapshot();
  });
});
