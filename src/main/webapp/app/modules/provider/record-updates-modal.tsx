import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Spinner } from 'reactstrap';
import { Translate } from 'react-jhipster';
import ButtonPill from './shared/button-pill';
import { useMediaQuery } from 'react-responsive';

import './all-records.scss';
import { isIOS } from 'react-device-detect';
import { MOBILE_WIDTH_BREAKPOINT } from 'app/config/constants';
import { applyUpdates, discardUpdates, getProviderEntityUpdates } from 'app/entities/organization/organization.reducer';
import _ from 'lodash';

const IOS_MODAL_MARGIN = 15;

export interface IRecordUpdatesModalProps extends StateProps, DispatchProps {
  orgId: string;
  modalOpen: boolean;
  toggleModalOpen: Function;
  openRecord: Function;
}

export class RecordUpdatesModal extends React.Component<IRecordUpdatesModalProps, {}> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { orgId } = this.props;
    this.loadRecord(orgId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.orgId !== this.props.orgId) {
      this.loadRecord(this.props.orgId);
    }
  }

  loadRecord = orgId => {
    if (!!orgId) {
      this.props.getProviderEntityUpdates(orgId);
    }
  };

  isMobile = () => useMediaQuery({ maxWidth: MOBILE_WIDTH_BREAKPOINT });

  updateList = () => {
    const { updates } = this.props.record;
    let rows = [];
    if (!!updates) {
      rows = _.map(updates, update => (
        <Row>
          <Col md={6}>
            <Translate contentKey="providerSite.yourRecordSays" />
            <br />
            {update.currentValue}
          </Col>
          <Col md={6}>
            {update.partnerName} <Translate contentKey="providerSite.updatedItTo" />:
            <br />
            {update.offeredValue}
          </Col>
        </Row>
      ));
    }
    return rows;
  };

  applyUpdates = () => {
    this.props.applyUpdates(this.props.orgId);
    this.props.toggleModalOpen();
  };

  discardUpdates = () => {
    this.props.discardUpdates(this.props.orgId);
    this.props.toggleModalOpen();
  };

  getPartnerName = record => {
    if (record && !!record.updates) {
      return record.updates[0].partnerName;
    }
    return '';
  }

  modalContent = () => {
    const { loading, record } = this.props;
    return (
      <>
        <div className={'d-flex flex-column justify-content-between align-items-center claim-record-modal-container p-1'}>
          <div className="d-flex flex-column align-items-center w-100 pt-4 pt-sm-3 pb-2">
            <span className="claim-modal-title">
              <Translate contentKey="providerSite.title.update" interpolate={{ name: this.getPartnerName(record) }} />:
              <br />
              {record ? record.name : ''}
            </span>
          </div>
          <div id="claim-record-modal-content" className="pt-3 claim-record-modal-body">
            {loading || !record ? <Spinner key={0} color="primary" /> : this.updateList()}
          </div>
          <div className="flex-grow-1" />
          <div className="d-flex align-items-center justify-content-center my-3">
            <Translate contentKey="providerSite.updateQuestion" />
            <ButtonPill className="button-pill mx-2" onClick={this.applyUpdates}>
              <Translate contentKey="providerSite.yes" />
            </ButtonPill>
            <ButtonPill className="button-pill mx-2" onClick={this.discardUpdates}>
              <Translate contentKey="providerSite.no" />
            </ButtonPill>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { modalOpen } = this.props;
    const modalHeight = document.documentElement ? document.documentElement.clientHeight : window.innerHeight;
    return (
      <div>
        <Modal
          isOpen={modalOpen}
          centered
          toggle={this.props.toggleModalOpen}
          className={'claiming claim-record-modal'}
          backdrop="static"
          keyboard={false}
          style={isIOS ? { height: modalHeight - IOS_MODAL_MARGIN, minHeight: modalHeight - IOS_MODAL_MARGIN } : {}}
          contentClassName={isIOS ? 'ios modal-content' : 'modal-content'}
        >
          <this.modalContent />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.authentication.account,
  loading: state.organization.loading,
  record: state.organization.providersEntityWithUpdates
});

const mapDispatchToProps = {
  getProviderEntityUpdates,
  applyUpdates,
  discardUpdates
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordUpdatesModal);
