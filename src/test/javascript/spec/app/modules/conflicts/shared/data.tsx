import partnerRecords from './data/partner-activities.json';
import matches from './data/matches.json';
import dismissedMatches from './data/dismissed-matches.json';
import account from './data/account.json';
import fieldDisplaySettings from './data/field-display-settings.json';
import activity from './data/activity.json';
import user from './data/user.json';
import configureStore from 'redux-mock-store';
import _ from 'lodash';

const mockStore = configureStore([]);

const MOCK_CALLBACK = props => ({ type: null, payload: null });

export const store = mockStore({
  sharedRecordView: {
    partnerRecords,
    matches,
    dismissedMatches
  },
  authentication: {
    account
  },
  fieldsDisplaySettings: {
    entities: fieldDisplaySettings,
    selectedSettings: []
  }
});

export const commonProps = {
  matches,
  dismissedMatches,
  account,
  user,
  orgId: activity.organization.id,
  partnerId: partnerRecords[0].organization.id,
  baseRecord: activity,
  partnerRecord: partnerRecords[0],
  systemAccountName: user.systemAccountName,
  selectedSettings: {},
  showClipboard: false,
  fieldsDisplaySettingsOptions: _.union(
    [{ value: null, label: 'All fields' }],
    fieldDisplaySettings.map(o => ({ ...o, value: o.id, label: o.name }))
  ),
  getBaseRecord: MOCK_CALLBACK,
  getMatches: MOCK_CALLBACK,
  getUser: MOCK_CALLBACK,
  getPartnerRecord: MOCK_CALLBACK,
  getNotHiddenMatchesByOrg: MOCK_CALLBACK,
  getSettings: MOCK_CALLBACK,
  updateSelectedSettings: MOCK_CALLBACK,
  history: null,
  location: null,
  match: null,
  loadingPartner: false
};
