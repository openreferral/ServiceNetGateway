import './referral-page.scss';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Translate } from 'react-jhipster';
import BeneficiaryCheckInTab from './benefeciary-check-in-tab';
import ReferralTab from './referral-tab';
import BulkUploadTab from './bulk-upload-tab';
import _ from 'lodash';

const BENEFICIARY_CHECK_IN_TAB = 'check_in';
const REFERRAL_TAB = 'referral';
const BULK_UPLOAD_TAB = 'bulk_upload';

export interface IReferralPageProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export interface IReferralPageState {
  activeTab: string;
}

class ReferralPage extends React.Component<IReferralPageProp, IReferralPageState> {
  state: IReferralPageState = {
    activeTab: BENEFICIARY_CHECK_IN_TAB
  };

  componentDidMount() {
    const { referredRecords } = this.props;
    if (!_.isEmpty(referredRecords)) {
      this.setState({ activeTab: REFERRAL_TAB });
    }
  }

  toggle(activeTab) {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div className="background referral-page">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={`text-nowrap ${activeTab === BENEFICIARY_CHECK_IN_TAB ? 'active' : ''}`}
              onClick={() => this.toggle(BENEFICIARY_CHECK_IN_TAB)}
            >
              <span className="d-none d-md-inline">
                <Translate contentKey="referral.tabs.check_in" />
              </span>
              <span className="d-inline d-md-none">
                <Translate contentKey="referral.tabs.check_in_mobile" />
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={`text-nowrap ${activeTab === REFERRAL_TAB ? 'active' : ''}`} onClick={() => this.toggle(REFERRAL_TAB)}>
              <span className="d-none d-md-inline">
                <Translate contentKey="referral.tabs.referral" />
              </span>
              <span className="d-inline d-md-none">
                <Translate contentKey="referral.tabs.referral_mobile" />
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`text-nowrap ${activeTab === BULK_UPLOAD_TAB ? 'active' : ''}`}
              onClick={() => this.toggle(BULK_UPLOAD_TAB)}
            >
              <span className="d-none d-md-inline">
                <Translate contentKey="referral.tabs.bulk_upload" />
              </span>
              <span className="d-inline d-md-none">
                <Translate contentKey="referral.tabs.bulk_upload_mobile" />
              </span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={BENEFICIARY_CHECK_IN_TAB}>
            <BeneficiaryCheckInTab />
          </TabPane>
          <TabPane tabId={REFERRAL_TAB}>
            <ReferralTab />
          </TabPane>
          <TabPane tabId={BULK_UPLOAD_TAB}>
            <BulkUploadTab />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = ({ providerRecord }: IRootState) => ({
  referredRecords: providerRecord.referredRecords
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralPage);
