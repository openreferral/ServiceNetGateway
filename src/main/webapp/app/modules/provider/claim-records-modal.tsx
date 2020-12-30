import React from 'react';
import { getRecordsAvailableToClaim } from './provider-record.reducer';
import { claimEntities, resetRecordsToClaim } from 'app/entities/organization/organization.reducer';
import { connect } from 'react-redux';
import { Row, Modal, Spinner, Progress } from 'reactstrap';
import _ from 'lodash';
import RecordCard from 'app/modules/provider/record/record-card';
import { IPaginationBaseState, Translate } from 'react-jhipster';
import { getSearchPreferences } from 'app/shared/util/search-utils';
import ButtonPill from './shared/button-pill';

import './all-records.scss';
import InfiniteScroll from 'react-infinite-scroller';
import { isIOS } from "react-device-detect";
const IOS_MODAL_MARGIN = 15;

export interface IClaimRecordsModalProps extends StateProps, DispatchProps {
  urlBase: string;
  claimRecordsOpened: boolean;
  closeClaiminging: Function;
  toggleClaimRecordsOpened: Function;
}

export interface IClaimRecordsModalState extends IPaginationBaseState {
  claimModalActivePage: number;
  doneClaiming: boolean;
}

export class ClaimRecordsModal extends React.Component<IClaimRecordsModalProps, IClaimRecordsModalState> {
  constructor(props) {
    super(props);
    const { providerSearchPreferences } = this.props.account ? getSearchPreferences(this.props.account.login) : null;
    this.state = {
      claimModalActivePage: 0,
      doneClaiming: false,
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

  handleLoadMoreClaimModal = hasReachedMaxItems => {
    if (!hasReachedMaxItems) {
      this.setState({ claimModalActivePage: this.state.claimModalActivePage + 1 }, () =>
        this.props.getRecordsAvailableToClaim(this.state.claimModalActivePage, 9, false)
      );
    }
  };

  claimRecords = () => {
    this.setState({ doneClaiming: true, claimModalActivePage: 0 }, () => this.props.claimEntities(this.props.recordsToClaim));
  };

  claimMore = () => {
    this.setState({ doneClaiming: false }, () => {
      this.props.resetRecordsToClaim();
      this.props.getRecordsAvailableToClaim(0, 9, true);
    });
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
          />
        </div>
      </div>
    ));
  };

  closeClaiminging = () => {
    this.props.closeClaiminging();
    this.setState({ doneClaiming: false });
  };

  render() {
    const {
      availableRecordsToClaim,
      loading,
      recordsAvailableToClaimTotal,
      recordsToClaim,
      claimingProgress,
      claimRecordsOpened
    } = this.props;
    const { doneClaiming, claimModalActivePage } = this.state;
    const hasReachedMaxItemsClaimModal =
      availableRecordsToClaim && availableRecordsToClaim.length === parseInt(recordsAvailableToClaimTotal, 10);
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
          {doneClaiming ? (
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
                    <ButtonPill onClick={() => this.closeClaiminging()}>
                      <Translate contentKey="recordCard.no" />
                    </ButtonPill>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-between align-items-center claim-record-modal-container p-1">
              <div className="d-flex flex-column justify-content-between align-items-center w-100 pt-4 pt-sm-3 pb-2">
                  <span className="claim-modal-title">
                    <Translate contentKey="providerSite.claimTitle" />
                  </span>
                <br />
                <span className="claim-modal-subtitle">
                    <Translate contentKey="providerSite.claimSubtitle" />
                  </span>
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
              <div className="d-flex align-items-center justify-content-center">
                <ButtonPill className="button-pill-green my-2" style={{ width: '120px' }} onClick={this.claimRecords}>
                  <Translate contentKey="recordCard.done" />
                </ButtonPill>
              </div>
            </div>
          )}
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
  recordsToClaim: state.providerRecord.recordsToClaim,
  isAuthenticated: state.authentication.isAuthenticated,
  leftToClaim: state.organization.leftToClaim,
  claimingProgress: state.organization.claimingProgress,
});

const mapDispatchToProps = {
  getRecordsAvailableToClaim,
  claimEntities,
  resetRecordsToClaim
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimRecordsModal);
