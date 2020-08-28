import React from 'react';
import { SingleRecordView } from 'app/modules/conflicts/single/single-record-view';
import { commonProps } from '../shared/data';
import { wrapper } from '../shared/wrapper';

describe('Single record view', () => {
  let mountedWrapper;

  const props = {
    ...commonProps,
    organizationMatches: commonProps.matches,
    activityRecord: commonProps.baseRecord
  };

  it('renders correctly', () => {
    mountedWrapper = wrapper(mountedWrapper, <SingleRecordView {...props} />);
    // the created snapshot must be committed to source control
    expect(mountedWrapper).toMatchSnapshot();
  });
});
