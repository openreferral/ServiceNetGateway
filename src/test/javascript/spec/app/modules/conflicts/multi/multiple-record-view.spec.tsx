import React from 'react';
import { MultipleRecordView } from 'app/modules/conflicts/multiple/multiple-record-view';
import { commonProps } from '../shared/data';
import { wrapper } from '../shared/wrapper';

describe('Multiple record view', () => {
  let mountedWrapper;

  const props = {
    ...commonProps
  };

  it('renders correctly', () => {
    mountedWrapper = wrapper(mountedWrapper, <MultipleRecordView {...props} />);
    // the created snapshot must be committed to source control
    expect(mountedWrapper).toMatchSnapshot();
  });
});
