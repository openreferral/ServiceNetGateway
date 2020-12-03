import 'filepond/dist/filepond.min.css';
import './multiple-record-view.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Jumbotron, Button, Tooltip, Label } from 'reactstrap';
import Details from '../shared/components/details';
import { getBaseRecord, getPartnerRecord, getNotHiddenMatchesByOrg } from '../shared/shared-record-view.reducer';
import {
  getSystemAccountEntities as getSettings,
  updateSelectedSettings
} from 'app/entities/fields-display-settings/fields-display-settings.reducer';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Translate, TextFormat, translate } from 'react-jhipster';
import ReactGA from 'react-ga';
import axios from 'axios';
import HideRecordButton from 'app/shared/layout/hide-record-button';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { APP_DATE_FORMAT, SYSTEM_ACCOUNTS } from 'app/config/constants';
import DismissModal from '../shared/components/dismiss-modal';
import SuccessModal from '../shared/components/success-modal';
import FieldsDisplaySettingsPanel from './fields-display-settings-panel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { Details as DetailClass } from '../single/details';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';
import IconSpan from 'app/shared/layout/icon-span';
import OwnerInfo from 'app/shared/layout/owner-info';

export interface IMultipleRecordViewProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export interface IMultipleRecordViewState {
  match: any;
  matchNumber: number;
  showDismissModal: boolean;
  showSuccessModal: boolean;
  dismissError: boolean;
  locationMatches: any;
  selectedLocation: any;
  locationsHaveMatch: boolean;
  matchingLocation: any;
  fieldSettingsExpanded: boolean;
  tooltipOpen: boolean;
  selectedSettings: any;
  loadingPartner: boolean;
}

export class MultipleRecordView extends React.Component<IMultipleRecordViewProp, IMultipleRecordViewState> {
  state: IMultipleRecordViewState = {
    match: null,
    matchNumber: 0,
    showDismissModal: false,
    showSuccessModal: false,
    dismissError: false,
    locationMatches: [],
    selectedLocation: null,
    locationsHaveMatch: true,
    matchingLocation: null,
    fieldSettingsExpanded: false,
    tooltipOpen: false,
    selectedSettings: {},
    loadingPartner: false
  };
  private settingsBtnRef = React.createRef() as React.LegacyRef<HTMLDivElement>;

  componentDidMount() {
    this.props.getBaseRecord(this.props.orgId);
    this.props.getSettings();
    this.getMatches(0, this.props.partnerId);
  }

  getMatches(matchNumberOffset: number, initialPartnerId?: string) {
    this.setState({
      loadingPartner: true
    });
    Promise.all([this.props.getNotHiddenMatchesByOrg(this.props.orgId)]).then(() => {
      this.setState({
        loadingPartner: false
      });
      if (this.props.matches.length > 0) {
        const { matches } = this.props;
        let matchNumber = this.getMatchNumber(matchNumberOffset);
        if (initialPartnerId) {
          const partnerIdx = matches.findIndex(match => match.partnerVersionId === initialPartnerId);
          if (partnerIdx >= 0) {
            matchNumber = partnerIdx;
            this.setState({
              matchNumber
            });
          }
        }
        const id = matches[matchNumber].partnerVersionId;
        this.replacePartnerId(id);
        this.props.getPartnerRecord(id);
      } else {
        this.props.history.replace(`/single-record-view/${this.props.orgId}`);
      }
    });
  }

  replacePartnerId = id => {
    this.props.history.replace(
      location.hash
        .replace(this.props.partnerId, '')
        .replace('#', '')
        .replace(/\/$/, '') + `/${id}`
    );
  };

  componentDidUpdate(prevProps) {
    if (prevProps.partnerId !== this.props.partnerId) {
      const partnerId = this.props.partnerId;
      if (partnerId) {
        const partnerIdx = this.props.matches.findIndex(match => match.partnerVersionId === partnerId);
        const matchNumber = partnerIdx > 0 ? partnerIdx : 0;
        if (this.state.matchNumber !== matchNumber) {
          this.setState({
            matchNumber
          });
        }
      }
    }
    if (prevProps.partnerRecord !== this.props.partnerRecord) {
      this.setState({
        loadingPartner: false
      });
    }
  }

  handleDismissModalClose = () => {
    this.setState({ showDismissModal: false, dismissError: false });
  };

  handleSuccessModalClose = () => {
    this.setState({ showSuccessModal: false });
  };

  handleDismiss = dismissParams => {
    const { orgId } = this.props;
    const matchId = this.props.matches[this.state.matchNumber].id;
    this.setState({
      loadingPartner: true
    });
    axios
      .post(`${SERVICENET_API_URL}/organization-matches/${matchId}/dismiss`, dismissParams)
      .then(() => {
        this.setState({ showDismissModal: false, showSuccessModal: true, matchNumber: 0 });
        Promise.all([this.props.getNotHiddenMatchesByOrg(this.props.orgId)]).then(() => {
          this.setState({
            loadingPartner: false
          });
          if (this.props.matches.length > 0) {
            const id = this.props.matches[0].partnerVersionId;
            this.props.getPartnerRecord(id);
            this.replacePartnerId(id);
          } else {
            this.props.history.replace(`/single-record-view/${orgId}`);
          }
        });
      })
      .catch(() => {
        this.setState({ loadingPartner: false, dismissError: true });
      });
  };

  showDismissModal = () => {
    this.setState({ showDismissModal: true });
  };

  changeRecord = offset => () => {
    const matchNumber = this.getMatchNumber(offset);
    this.setState({ matchNumber, loadingPartner: true });

    ReactGA.event({ category: 'UserActions', action: 'Clicking "See Another Match" on side by side view' });
    const id = this.props.matches[matchNumber].partnerVersionId;
    this.props.getPartnerRecord(id);
    this.replacePartnerId(id);
  };

  getMatchNumber = offset => {
    const offsetMatchNumber = this.state.matchNumber + offset;
    let matchNumber = 0;
    if (offsetMatchNumber < 0) {
      matchNumber = this.props.matches.length - 1;
    } else if (offsetMatchNumber < this.props.matches.length) {
      matchNumber = offsetMatchNumber;
    }
    return matchNumber;
  };

  denyMatch = () => {
    ReactGA.event({ category: 'UserActions', action: 'Deny Match Button' });
  };

  hideActivity = event => {
    const { matches, partnerRecord, orgId } = this.props;

    const match = _.find(matches, m => m.partnerVersionId === partnerRecord.organization.id);
    const matchId = match && match.id ? match.id : '';
    event.preventDefault();
    if (matchId) {
      this.setState({
        loadingPartner: true
      });
      axios
        .post(`${SERVICENET_API_URL}/organization-matches/${matchId}/hide`)
        .then(() => {
          this.setState({
            loadingPartner: false
          });
          toast.success(translate('hiddenMatches.hiddenSuccessfully'));
          if (matches.length === 1) {
            this.props.history.replace(`/single-record-view/${orgId}`);
          } else if (matches.length > 1) {
            this.getMatches(this.state.matchNumber > 0 ? -1 : 0);
          } else {
            this.props.history.replace(`/`);
          }
        })
        .catch(() => {
          this.setState({
            loadingPartner: false
          });
          toast.error(translate('hiddenMatches.hidingError'));
        });
    }
  };

  selectLocation = location => {
    if (!!location) {
      const selectedLocation = location.location.id;
      const matchingLocation = this.findMatchingLocation(selectedLocation);
      this.setState({
        selectedLocation,
        matchingLocation
      });
    }
  };

  findMatchingLocation = selectedLocation => {
    const { matches, partnerRecord } = this.props;
    const match = partnerRecord && _.find(matches, m => m.partnerVersionId === partnerRecord.organization.id);
    if (match && match.locationMatches) {
      if (selectedLocation in match.locationMatches) {
        const matchesSortedBySimilarity = _.orderBy(match.locationMatches[selectedLocation], ['similarity'], ['desc']);
        return matchesSortedBySimilarity[0].matchingLocation;
      }
      // return inverted match if any
      const revertedMatches = [];
      _.forEach(match.locationMatches, matchList => {
        _.forEach(matchList, matchItem => {
          if (matchItem.matchingLocation === selectedLocation) {
            revertedMatches.push({ match: matchItem.location, similarity: matchItem.similarity });
          }
        });
      });
      const revertedMatchesSortedBySimilarity = _.orderBy(revertedMatches, ['similarity'], ['desc']);
      return _.get(revertedMatchesSortedBySimilarity[0], 'match');
    }
  };

  toggleMatchLocations = () => {
    this.setState({
      locationsHaveMatch: !this.state.locationsHaveMatch
    });
  };

  toggleFieldSettings = () => {
    if (this.state.fieldSettingsExpanded) {
      this.props.getSettings();
    }
    this.setState({
      fieldSettingsExpanded: !this.state.fieldSettingsExpanded
    });
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  handleSettingsChange = selectedSettings => {
    this.setState({ selectedSettings });
    this.props.updateSelectedSettings(selectedSettings);
  };

  render() {
    const { baseRecord, partnerRecord, systemAccountName, matches } = this.props;
    const { loadingPartner, matchNumber } = this.state;
    const baseProviderName = baseRecord ? baseRecord.organization.accountName : null;
    const locationMatches = DetailClass.getLocationMatches(matches);
    const match = matches[matchNumber];
    const loadingComponent = (
      <Col>
        <h2>Loading...</h2>
      </Col>
    );

    const seeAnotherMatch =
      matches.length > 1 ? (
        <div className="see-another-match">
          <h4>
            <span role="button" onClick={this.changeRecord(-1)} className="text-blue">
              〈
            </span>
            <span role="button" onClick={this.changeRecord(1)}>
              <Translate contentKey="multiRecordView.seeAnotherMatch" />
              <span className="text-blue">{` (${this.state.matchNumber + 1}/${matches.length}) 〉`}</span>
            </span>
          </h4>
        </div>
      ) : null;

    let pageBody = null;
    if (this.state.fieldSettingsExpanded) {
      pageBody = (
        <Row>
          <Col md="12">
            <FieldsDisplaySettingsPanel />
          </Col>
        </Row>
      );
    } else {
      pageBody = (
        <Row>
          {baseRecord ? (
            <Col sm="6">
              <IconSpan iconSize="1.5rem" visible={baseProviderName === SYSTEM_ACCOUNTS.SERVICE_PROVIDER}>
                <h2>{baseRecord.organization.name}</h2>
              </IconSpan>
              <h4 className="from">
                {systemAccountName === baseProviderName ? (
                  <Translate contentKey="multiRecordView.yourData" />
                ) : (
                  <div>
                    <Translate contentKey="multiRecordView.from" />
                    {baseProviderName === SYSTEM_ACCOUNTS.SERVICE_PROVIDER ? (
                      <OwnerInfo owner={baseRecord.owner} direction="right" />
                    ) : (
                      baseProviderName
                    )}
                  </div>
                )}
              </h4>
              <h5>
                <Translate contentKey="multiRecordView.lastCompleteReview" />
                {baseRecord.organization.lastVerifiedOn ? (
                  <TextFormat value={baseRecord.organization.lastVerifiedOn} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                ) : (
                  <Translate contentKey="multiRecordView.unknown" />
                )}
              </h5>
              <h5>
                <Translate contentKey="multiRecordView.lastUpdated" />
                {baseRecord.lastUpdated ? (
                  <TextFormat value={baseRecord.lastUpdated} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                ) : (
                  <Translate contentKey="multiRecordView.unknown" />
                )}
              </h5>
              <Details
                activity={baseRecord}
                {...this.props}
                exclusions={baseRecord.exclusions}
                isBaseRecord
                showClipboard={false}
                selectLocation={this.selectLocation}
                locationsHaveMatch={this.state.locationsHaveMatch}
                matchingLocation={this.state.matchingLocation}
                toggleMatchLocations={this.toggleMatchLocations}
                settings={this.props.selectedSettings}
                serviceMatches={match && match.serviceMatches}
                locationMatches={match && locationMatches}
              />
            </Col>
          ) : (
            loadingComponent
          )}
          {partnerRecord ? (
            <Col sm="6">
              <div style={{ top: '-10px', right: '5px', position: 'absolute', zIndex: 5000 }}>
                <HideRecordButton id={`hide-${partnerRecord.organization.id}`} handleHide={this.hideActivity} />
              </div>
              <div style={{ top: '-45px', right: '5px', position: 'absolute' }}>
                <h5>
                  <Translate contentKey="multiRecordView.matchSimilarity" />
                  {match ? (match.similarity * 100).toFixed(2) : 0}%
                </h5>
              </div>
              {seeAnotherMatch}
              {loadingPartner ? (
                loadingComponent
              ) : (
                <>
                  <Row>
                    <Col>
                      <div className="mr-4">
                        <IconSpan iconSize="1.5rem" visible={partnerRecord.organization.accountName === SYSTEM_ACCOUNTS.SERVICE_PROVIDER}>
                          <h2>{partnerRecord.organization.name}</h2>
                        </IconSpan>
                      </div>
                      <h4 className="from">
                        <Translate contentKey="multiRecordView.from" />
                        {partnerRecord.organization.accountName === SYSTEM_ACCOUNTS.SERVICE_PROVIDER ? (
                          <OwnerInfo owner={partnerRecord.owner} direction="right" />
                        ) : (
                          partnerRecord.organization.accountName
                        )}
                      </h4>
                      <h5>
                        <Translate contentKey="multiRecordView.lastCompleteReview" />
                        {partnerRecord.organization.lastVerifiedOn ? (
                          <TextFormat
                            value={partnerRecord.organization.lastVerifiedOn}
                            type="date"
                            format={APP_DATE_FORMAT}
                            blankOnInvalid
                          />
                        ) : (
                          <Translate contentKey="multiRecordView.unknown" />
                        )}
                      </h5>
                      <h5>
                        <Translate contentKey="multiRecordView.lastUpdated" />
                        {partnerRecord.lastUpdated ? (
                          <TextFormat value={partnerRecord.lastUpdated} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                        ) : (
                          <Translate contentKey="multiRecordView.unknown" />
                        )}
                      </h5>
                    </Col>
                  </Row>
                  <Details
                    activity={partnerRecord}
                    {...this.props}
                    exclusions={[]}
                    isBaseRecord={false}
                    showClipboard
                    selectLocation={this.selectLocation}
                    locationsHaveMatch={this.state.locationsHaveMatch}
                    matchingLocation={this.state.matchingLocation}
                    settings={this.props.selectedSettings}
                    serviceMatches={match && match.serviceMatches}
                    locationMatches={match && locationMatches}
                  />
                  <Jumbotron className="same-record-question-container">
                    <div className="same-record-question">
                      <h4>
                        <Translate contentKey="multiRecordView.sameRecord.question" />
                      </h4>
                    </div>
                    <div className="same-record-question-buttons">
                      <div>
                        {!this.props.dismissedMatches.length ? null : (
                          <Link to={`/dismissed-matches/${this.props.orgId}`}>
                            <Translate contentKey="multiRecordView.sameRecord.viewDismissedMatches" />
                          </Link>
                        )}
                      </div>
                      <Button color="danger" size="lg" onClick={this.showDismissModal}>
                        <Translate contentKey="multiRecordView.sameRecord.deny" />
                      </Button>
                    </div>
                  </Jumbotron>
                </>
              )}
            </Col>
          ) : (
            loadingComponent
          )}
        </Row>
      );
    }

    return (
      <div className="multiple-record-view shared-record-view">
        <SuccessModal showModal={this.state.showSuccessModal} handleClose={this.handleSuccessModalClose} />
        <DismissModal
          showModal={this.state.showDismissModal}
          dismissError={this.state.dismissError}
          handleClose={this.handleDismissModalClose}
          handleDismiss={this.handleDismiss}
        />
        <div
          className={this.state.fieldSettingsExpanded ? 'fields-display-settings-btn-return' : 'fields-display-settings-btn'}
          onClick={this.toggleFieldSettings}
          id="fields-display-settings-btn"
          ref={this.settingsBtnRef}
        >
          {this.state.fieldSettingsExpanded ? (
            <FontAwesomeIcon icon="undo-alt" size="lg" />
          ) : (
            <span>
              <Translate contentKey="multiRecordView.showLessFields" /> <FontAwesomeIcon icon="cogs" size="lg" />
            </span>
          )}
        </div>
        <Label className="sr-only" for="settings">
          <Translate contentKey="multiRecordView.showLessFields" />
        </Label>
        <Select
          options={this.props.fieldsDisplaySettingsOptions}
          onChange={this.handleSettingsChange}
          value={this.props.selectedSettings}
          className="fields-display-settings-selector"
          isDisabled={this.state.fieldSettingsExpanded}
          inputId="settings"
        />
        <Tooltip
          placement="bottom"
          innerClassName="tooltip-clip-inner"
          className="tooltip-clip"
          isOpen={this.state.tooltipOpen}
          target={this.settingsBtnRef}
          toggle={this.toggleTooltip}
          autohide
        >
          <Translate contentKey="global.menu.entities.fieldsDisplaySettings" />
        </Tooltip>
        {pageBody}
      </div>
    );
  }
}

const mapStateToProps = (storeState, { match }: IMultipleRecordViewState) => ({
  orgId: match.params.orgId,
  partnerId: match.params.partnerId,
  baseRecord: storeState.sharedRecordView.baseRecord,
  partnerRecord: storeState.sharedRecordView.partnerRecord,
  matches: storeState.sharedRecordView.matches,
  dismissedMatches: storeState.sharedRecordView.dismissedMatches,
  systemAccountName: storeState.authentication.account.systemAccountName,
  fieldsDisplaySettingsOptions: _.union(
    [{ value: null, label: 'All fields' }],
    storeState.fieldsDisplaySettings.entities.map(o => ({ ...o, value: o.id, label: o.name }))
  ),
  selectedSettings: storeState.fieldsDisplaySettings.selectedSettings
});

const mapDispatchToProps = { getBaseRecord, getPartnerRecord, getNotHiddenMatchesByOrg, getSettings, updateSelectedSettings };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleRecordView);
