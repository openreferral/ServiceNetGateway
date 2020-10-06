import React from 'react';
import AllRecordsView from 'app/modules/conflicts/all/all-records-view';
import { Details as DetailClass } from 'app/modules/conflicts/single/details';
import { commonProps } from '../shared/data';
import activity from '../shared/data/activity.json';
import { wrapper } from '../shared/wrapper';

describe('Multiple record view', () => {
  let mountedWrapper;

  const props = {
    ...commonProps,
    match: { params: { orgId: activity.organization.id } },
    matchNumber: 0,
    showDismissModal: false,
    showSuccessModal: false,
    dismissError: false,
    locationMatches: DetailClass.getLocationMatches(commonProps.matches),
    selectedLocation: null,
    locationsHaveMatch: true,
    matchingLocation: null,
    selectedMatch: null,
    fieldSettingsExpanded: false,
    tooltipOpen: false
  };

  it('renders correctly', () => {
    mountedWrapper = wrapper(mountedWrapper, <AllRecordsView {...props} />);
    // the created snapshot must be committed to source control
    expect(mountedWrapper).toMatchSnapshot();
  });
});
