import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Spinner } from 'reactstrap';
import { translate, Translate } from 'react-jhipster';
import ButtonPill from './shared/button-pill';
import { useMediaQuery } from 'react-responsive';

import './provider-shared.scss';
import './record-updates-modal.scss';
import { isIOS } from 'react-device-detect';
import { MOBILE_WIDTH_BREAKPOINT } from 'app/config/constants';
import { applyUpdates, discardUpdates, getProviderEntityUpdates } from 'app/entities/organization/organization.reducer';
import _ from 'lodash';
import { toast } from 'react-toastify';

const IOS_MODAL_MARGIN = 15;

export interface IRecordUpdatesModalProps extends StateProps, DispatchProps {
  orgId: string;
  modalOpen: boolean;
  toggleModalOpen: Function;
  openAnotherRecord: Function;
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
    if (!prevProps.discardSuccess && this.props.discardSuccess) {
      // open another record if exists, close the modal otherwise
      toast.success(translate('providerSite.recordDiscarded'));
      this.props.openAnotherRecord(this.props.orgId);
    }
  }

  loadRecord = orgId => {
    if (!!orgId) {
      this.props.getProviderEntityUpdates(orgId);
    }
  };

  isMobile = () => useMediaQuery({ maxWidth: MOBILE_WIDTH_BREAKPOINT });

  cell = fieldValue => {
    const { updateSuccess } = this.props;
    const className = updateSuccess ? 'cell success' : 'cell';
    if (fieldValue && fieldValue.indexOf('\n') !== -1) {
      return <textarea value={fieldValue} disabled className={className} />;
    } else {
      return <input value={fieldValue} disabled className={className} />;
    }
  };

  fieldUpdate = update => {
    const { updateSuccess } = this.props;
    return updateSuccess ? (
      <Col md={12} className="record">
        <div className="field-value">
          <Translate contentKey="providerSite.yourRecordNowSays" />:<br />
          {this.cell(update.offeredValue)}
        </div>
      </Col>
    ) : (
      <>
        <Col md={6} className="record separator-right">
          <div className="field-value">
            <Translate contentKey="providerSite.yourRecordSays" />:<br />
            {this.cell(update.currentValue)}
          </div>
        </Col>
        <Col md={6} className="record">
          <div className="field-value">
            {update.partnerName} <Translate contentKey="providerSite.updatedItTo" />:<br />
            {this.cell(update.offeredValue)}
          </div>
        </Col>
      </>
    );
  };

  updateList = () => {
    const { updates } = this.props.record;
    let rows = [];
    if (!!updates) {
      rows = _.map(updates, update => (
        <>
          <Col md={12} className="field-updated">
            <span className="field-updated-label">
              <Translate contentKey="providerSite.fieldUpdated" />:{' '}
            </span>
            {update.fieldName ? translate(`providerSite.fieldLabels.${update.fieldName}`) : null}
          </Col>
          <Row className="mx-3 update">{this.fieldUpdate(update)}</Row>
        </>
      ));
    }
    return rows;
  };

  applyUpdates = () => {
    this.props.applyUpdates(this.props.orgId);
  };

  discardUpdates = () => {
    this.props.discardUpdates(this.props.orgId);
  };

  getPartnerName = record => {
    if (record && !!record.updates) {
      return record.updates[0] && record.updates[0].partnerName;
    }
    return '';
  };

  done = () => {
    this.props.openAnotherRecord(this.props.orgId);
  };

  modalTitle = () => {
    const { updateSuccess, record } = this.props;
    return updateSuccess ? (
      <Translate contentKey="providerSite.title.success" />
    ) : (
      <>
        <Translate contentKey="providerSite.title.update" interpolate={{ name: this.getPartnerName(record) }} />:<br />
        <div className="record-name">{record ? record.name : ''}</div>
      </>
    );
  };

  modalBody = () => {
    const { loading, record } = this.props;
    return loading || !record ? <Spinner key={0} color="primary" /> : this.updateList();
  };

  modalFooter = () => {
    const { updateSuccess } = this.props;
    return updateSuccess ? (
      <ButtonPill className="button-pill ml-2" onClick={this.done}>
        <Translate contentKey="providerSite.done" />
      </ButtonPill>
    ) : (
      <>
        <Translate contentKey="providerSite.updateQuestion" />
        <div className="d-inline-flex">
          <ButtonPill className="button-pill ml-2" onClick={this.applyUpdates}>
            <Translate contentKey="providerSite.yes" />
          </ButtonPill>
          <ButtonPill className="button-pill ml-2" onClick={this.discardUpdates}>
            <Translate contentKey="providerSite.no" />
          </ButtonPill>
        </div>
      </>
    );
  };

  modalContent = () => {
    const { loading, updating, record } = this.props;
    if (loading || updating || !record) {
      return (
        <div className="p-4">
          {' '}
          <Spinner key={0} color="primary" />
        </div>
      );
    }
    return (
      <>
        <div className={'d-flex flex-column justify-content-between align-items-center p-1'}>
          <div className="d-flex flex-column align-items-center w-100 pt-4 pt-sm-3 pb-2">
            <div className="modal-title">{this.modalTitle()}</div>
          </div>
          <div className="modal-body">{this.modalBody()}</div>
          <div className="flex-grow-1" />
          <div className="d-flex align-items-center justify-content-center mb-3 modal-footer">{this.modalFooter()}</div>
        </div>
      </>
    );
  };

  render() {
    const { modalOpen, updateSuccess } = this.props;
    const modalHeight = document.documentElement ? document.documentElement.clientHeight : window.innerHeight;
    let contentClassName = 'modal-content';
    if (isIOS) {
      contentClassName += ' ios';
    }
    if (updateSuccess) {
      contentClassName += ' success';
    }
    return (
      <div>
        <Modal
          isOpen={modalOpen}
          centered
          toggle={this.props.toggleModalOpen}
          className={'record-updates-modal'}
          backdrop="static"
          keyboard={false}
          style={isIOS ? { height: modalHeight - IOS_MODAL_MARGIN, minHeight: modalHeight - IOS_MODAL_MARGIN } : {}}
          contentClassName={contentClassName}
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
  updating: state.organization.updating,
  record: state.organization.providersEntityWithUpdates,
  updateSuccess: state.organization.updateSuccess,
  discardSuccess: state.organization.discardSuccess
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
