import './referral-shared.scss';
import './referral-modal.scss';

import React from 'react';
import { TabContent, TabPane, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Translate } from 'react-jhipster';
import BeneficiaryCheckInTab from './components/benefeciary-check-in-tab';
import ReferralTab from './components/referral-tab';
import _ from 'lodash';
import { getProviderOptions } from 'app/modules/provider/provider-record.reducer';

export const BENEFICIARY_CHECK_IN_TAB = 'check_in';
export const REFERRAL_TAB = 'referral';

export interface IReferralModalProp extends StateProps, DispatchProps {
  openTab: string;
  handleClose: any;
}

export interface IReferralModalState {
  activeTab: string;
}

class ReferralModal extends React.Component<IReferralModalProp, IReferralModalState> {
  state: IReferralModalState = {
    activeTab: BENEFICIARY_CHECK_IN_TAB
  };

  componentDidMount() {
    const { referredRecords, openTab } = this.props;
    this.props.getProviderOptions();
    if (!_.isEmpty(referredRecords)) {
      this.setState({ activeTab: openTab });
    }
  }

  componentDidUpdate(prevProps: Readonly<IReferralModalProp>, prevState: Readonly<IReferralModalState>, snapshot?: any) {
    if (prevProps.openTab !== this.props.openTab && this.props.openTab != null) {
      this.setState({
        activeTab: this.props.openTab
      });
    }
  }

  toggle(activeTab) {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  }

  render() {
    const { openTab, handleClose } = this.props;
    const { activeTab } = this.state;

    return (
      <Modal
        isOpen={openTab != null}
        centered
        backdrop="static"
        id="referral-modal"
        autoFocus={false}
        toggle={handleClose}
        className="col-12 col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1"
      >
        <ModalHeader toggle={handleClose}>
          <div className="content-title">
            {activeTab === BENEFICIARY_CHECK_IN_TAB ? (
              <Translate contentKey="referral.title.check_in" />
            ) : (
              <Translate contentKey="referral.title.referrals" />
            )}
          </div>
        </ModalHeader>
        <ModalBody id="serviceNetApp.referral.modal">
          <div className="background referral referral-page">
            <TabContent activeTab={activeTab}>
              <TabPane tabId={BENEFICIARY_CHECK_IN_TAB}>
                <BeneficiaryCheckInTab handleClose={this.props.handleClose} />
              </TabPane>
              <TabPane tabId={REFERRAL_TAB}>
                <ReferralTab handleClose={this.props.handleClose} />
              </TabPane>
            </TabContent>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = ({ providerRecord }: IRootState) => ({
  referredRecords: providerRecord.referredRecords
});

const mapDispatchToProps = {
  getProviderOptions
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralModal);
