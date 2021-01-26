import React from 'react';
import { getRecordsAvailableToClaim } from './provider-record.reducer';
import { claimEntities, resetRecordsToClaim } from 'app/entities/organization/organization.reducer';
import { connect } from 'react-redux';
import { Row, Modal, Spinner, Progress, Button, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import RecordCard from 'app/modules/provider/record/record-card';
import { IPaginationBaseState, Translate } from 'react-jhipster';
import { getSearchPreferences } from 'app/shared/util/search-utils';
import ButtonPill from './shared/button-pill';
import SingleRecordView from 'app/modules/provider/record/single-record-view';
import { setTextModal, resetTextModal } from 'app/modules/provider/shared/search.reducer';
import SearchBar from './shared/search-bar';
import { useMediaQuery } from 'react-responsive';

import './all-records.scss';
import InfiniteScroll from 'react-infinite-scroller';
import { isIOS } from 'react-device-detect';
import { GA_ACTIONS, MOBILE_WIDTH_BREAKPOINT } from 'app/config/constants';
import { sendAction } from 'app/shared/util/analytics';
const IOS_MODAL_MARGIN = 15;

export interface IClaimRecordsModalProps extends StateProps, DispatchProps {
  urlBase: string;
  claimRecordsOpened: boolean;
  closeClaiming: Function;
  toggleClaimRecordsOpened: Function;
}

export interface IClaimRecordsModalState extends IPaginationBaseState {
  claimModalActivePage: number;
  doneClaiming: boolean;
  singleRecordTab: boolean;
  orgId: string;
}

const INITIAL_STATE = {
  claimModalActivePage: 0,
  doneClaiming: false
};

export class ClaimRecordsModal extends React.Component<IClaimRecordsModalProps, IClaimRecordsModalState> {
  constructor(props) {
    super(props);
    const { providerSearchPreferences } = this.props.account ? getSearchPreferences(this.props.account.login) : null;
    this.state = {
      ...INITIAL_STATE,
      singleRecordTab: false,
      orgId: null,
      ...providerSearchPreferences
    };
  }

  componentDidMount() {
    const { account, isAuthenticated, claimRecordsOpened } = this.props;
    if (!claimRecordsOpened && isAuthenticated && account && !account.hasClaimedRecords) {
      setTimeout(() => {
        this.props.toggleClaimRecordsOpened();
        this.setState({ claimModalActivePage: 0, doneClaiming: false });
      }, 5000);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      const { searchTerm } = this.props;
      this.setState({ claimModalActivePage: 0 }, () => this.props.getRecordsAvailableToClaim(0, 9, true, searchTerm));
    }
    if (!prevProps.claimRecordsOpened && this.props.claimRecordsOpened) {
      // reset the state of the modal when opened
      this.setState({
        ...INITIAL_STATE
      });
    }
  }

  handleLoadMoreClaimModal = hasReachedMaxItems => {
    const { searchTerm } = this.props;
    if (!hasReachedMaxItems) {
      this.setState({ claimModalActivePage: this.state.claimModalActivePage + 1 }, () =>
        this.props.getRecordsAvailableToClaim(this.state.claimModalActivePage, 9, false, searchTerm)
      );
    }
  };

  claimRecords = () => {
    const { recordsToClaim } = this.props;
    this.setState(
      {
        doneClaiming: true,
        claimModalActivePage: 0
      },
      () => this.props.claimEntities([...recordsToClaim])
    );
  };

  claimMore = () => {
    const { searchTerm } = this.props;
    this.setState({ doneClaiming: false }, () => {
      this.props.resetRecordsToClaim();
      this.props.getRecordsAvailableToClaim(0, 9, true, searchTerm);
    });

    sendAction(GA_ACTIONS.CLAIM_RECORDS_CLAIM_MORE_RECORDS_POP_UP_YES);
  };

  organizationNameOnClick = orgId => () => {
    this.setState({ singleRecordTab: true, orgId });
  };

  mapRecordsForClaimModal = ({ records }) => {
    const { urlBase } = this.props;
    return _.map(records, record => (
      <div key={record.organization.id} className="col-12 col-lg-4 col-md-6">
        <div className="mb-4">
          <RecordCard
            fullWidth={false}
            record={record}
            link={`${urlBase ? `${urlBase}/` : ''}single-record-view/${record.organization.id}`}
            referring={false}
            claiming
            onNameClick={this.organizationNameOnClick(record.organization.id)}
          />
        </div>
      </div>
    ));
  };

  onBackClick = () => {
    this.setState({ singleRecordTab: false, orgId: '' });
  };

  closeClaiming = () => {
    this.props.closeClaiming();
    sendAction(GA_ACTIONS.CLAIM_RECORDS_CLAIM_MORE_RECORDS_POP_UP_NO);
  };

  searchBar = () => (
    <Row className={`search my-2 w-75 w-${this.isMobile() ? '100' : 75}`}>
      <Col className="height-fluid">
        <SearchBar onSearch={this.props.setTextModal} onReset={this.props.resetTextModal} initialValue={this.props.searchTerm} />
      </Col>
    </Row>
  );

  isMobile = () => useMediaQuery({ maxWidth: MOBILE_WIDTH_BREAKPOINT });

  claimRecordsPage = () => {
    const {
      availableRecordsToClaim,
      loading,
      recordsAvailableToClaimTotal,
      recordsToClaim,
      claimRecordsOpened,
      claimingProgress
    } = this.props;
    const { claimModalActivePage, doneClaiming } = this.state;
    const hasReachedMaxItemsClaimModal =
      availableRecordsToClaim && availableRecordsToClaim.length === parseInt(recordsAvailableToClaimTotal, 10);
    return doneClaiming || !claimRecordsOpened ? (
      <div className="d-flex flex-column justify-content-between align-items-center p-2 claim-modal-title">
        {claimingProgress !== '100' &&
          recordsToClaim.length !== 0 && (
            <>
              <span className="m-3">
                <Translate contentKey="providerSite.claimingInfo" />
              </span>
              <Progress value={claimingProgress} max="100" min="0" style={{ width: '75%' }} className="m-3" />
            </>
          )}
        {(claimingProgress === '100' || recordsToClaim.length === 0) && (
          <div className="d-flex flex-column justify-content-between align-items-center">
            <span className="pt-4 claim-modal-title">
              <Translate contentKey="providerSite.succesfullClaim" interpolate={{ count: recordsToClaim.length || 0 }} />
            </span>
            <br />
            <span className="claim-modal-subtitle">
              <Translate contentKey="providerSite.claimMore" />
            </span>
            <div className="d-flex w-100 justify-content-center py-4">
              <ButtonPill onClick={() => this.claimMore()}>
                <Translate contentKey="recordCard.yes" />
              </ButtonPill>
              &nbsp;
              <ButtonPill onClick={() => this.closeClaiming()}>
                <Translate contentKey="recordCard.no" />
              </ButtonPill>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="d-flex flex-column justify-content-between align-items-center claim-record-modal-container p-1">
        <div className="d-flex flex-column align-items-center w-100 pt-4 pt-sm-3 pb-2">
          <span className="claim-modal-title">
            <Translate contentKey="providerSite.claimTitle" />
          </span>
          <br />
          <span className="claim-modal-subtitle">
            <Translate contentKey="providerSite.claimSubtitle" />
          </span>
          <this.searchBar />
        </div>
        <div id="claim-record-modal-content" className="pt-3 claim-record-modal-body">
          {claimRecordsOpened && (
            <InfiniteScroll
              pageStart={claimModalActivePage}
              loadMore={() => this.handleLoadMoreClaimModal(hasReachedMaxItemsClaimModal)}
              hasMore={!hasReachedMaxItemsClaimModal}
              loader={loading ? <Spinner key={0} color="primary" /> : null}
              threshold={0}
              initialLoad={false}
              useWindow={false}
              getScrollParent={() => document.getElementById('claim-record-modal-content')}
            >
              <Row noGutters>{this.mapRecordsForClaimModal({ records: availableRecordsToClaim })}</Row>
            </InfiniteScroll>
          )}
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center justify-content-center">
          <ButtonPill className="button-pill-green my-2" style={{ width: '120px' }} onClick={this.claimRecords}>
            <Translate contentKey="recordCard.done" />
          </ButtonPill>
        </div>
      </div>
    );
  };

  singleRecordView = () => {
    const { orgId } = this.state;
    return (
      <div className="d-flex flex-column justify-content-between align-items-center claim-record-modal-container p-1">
        <div className="d-flex flex-column justify-content-between align-items-center w-100 pt-4">
          <span className="claim-modal-title mb-2">
            <Translate contentKey="singleRecordView.details.recordDetails" />
          </span>
          <Button color="" className="position-absolute ml-2" style={{ left: 0, marginTop: '-0.25rem' }} onClick={this.onBackClick}>
            <FontAwesomeIcon icon="angle-left" />
            &nbsp;
            <Translate contentKey="global.goBack" />
          </Button>
        </div>
        <div id="claim-record-modal-content" className="pt-3 claim-record-modal-body single-record">
          <SingleRecordView orgId={orgId} />
        </div>
      </div>
    );
  };

  render() {
    const { claimRecordsOpened } = this.props;
    const { doneClaiming, singleRecordTab } = this.state;
    const modalHeight = document.documentElement ? document.documentElement.clientHeight : window.innerHeight;
    return (
      <div>
        <Modal
          isOpen={claimRecordsOpened}
          centered
          toggle={this.props.toggleClaimRecordsOpened}
          className={doneClaiming ? 'done' : 'claiming' + ' claim-record-modal'}
          backdrop="static"
          keyboard={false}
          style={isIOS ? { height: modalHeight - IOS_MODAL_MARGIN, minHeight: modalHeight - IOS_MODAL_MARGIN } : {}}
          contentClassName={isIOS ? 'ios modal-content' : 'modal-content'}
        >
          {singleRecordTab ? <this.singleRecordView /> : <this.claimRecordsPage />}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.authentication.account,
  loading: state.providerRecord.loading,
  availableRecordsToClaim: state.providerRecord.recordsAvailableToClaim,
  recordsAvailableToClaimTotal: state.providerRecord.recordsAvailableToClaimTotal,
  recordsToClaim: state.organization.recordsToClaim,
  isAuthenticated: state.authentication.isAuthenticated,
  leftToClaim: state.organization.leftToClaim,
  claimingProgress: state.organization.claimingProgress,
  searchTerm: state.search.textModal
});

const mapDispatchToProps = {
  getRecordsAvailableToClaim,
  claimEntities,
  resetRecordsToClaim,
  setTextModal,
  resetTextModal
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimRecordsModal);
