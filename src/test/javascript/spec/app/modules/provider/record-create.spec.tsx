import React from 'react';
import RecordCreate from 'app/modules/provider/record/record-create';
import { store } from './shared/data';
import { Provider } from 'react-redux';
import { wrapper } from '../conflicts/shared/wrapper';
import { HashRouter as Router } from 'react-router-dom';

describe('Record create', () => {
  let mountedWrapper;

  it('renders correctly ', () => {
    mountedWrapper = wrapper(
      mountedWrapper,
      <Provider store={store}>
        <Router>
          // @ts-ignore
          <RecordCreate />
        </Router>
      </Provider>
    );
    expect(mountedWrapper).toMatchSnapshot();
  });
});
