import React from 'react';
import SingleRecordView from 'app/modules/provider/record/single-record-view';
import { store } from './shared/data';
import { HashRouter as Router } from 'react-router-dom';
import { wrapper } from '../conflicts/shared/wrapper';

describe('Single record view on service provider page', () => {
  let mountedWrapper;

  it('renders correctly', () => {
    const props = {
      match: {
        params: {
          orgId: 123
        }
      }
    };
    mountedWrapper = wrapper(
      mountedWrapper,
      <Router>
        // @ts-ignore
        <SingleRecordView {...props} />
      </Router>,
      store
    );
    expect(mountedWrapper).toMatchSnapshot();
  });
});
