import './referral-shared.scss';
import './referral-history.scss';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Translate } from 'react-jhipster';
import ReferralHistoryTab from 'app/modules/provider/referral/components/referral-history-tab';
import NumberOfReferralsTab from 'app/modules/provider/referral/components/number-of-referrals-tab';
import { REFERRAL_TYPE } from 'app/entities/referral/referral.reducer';

const INBOUND_REFERRAL_HISTORY_TAB = 'inbound-referral-history';
const OUTBOUND_REFERRAL_HISTORY_TAB = 'outbound-referral-history';
const NUMBER_OF_REFERRALS_TAB = 'number-of-referrals';

export interface IReferralHistoryProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IReferralHistoryState {
  activeTab: string;
}

class ReferralHistory extends React.Component<IReferralHistoryProp, IReferralHistoryState> {
  state: IReferralHistoryState = {
    activeTab: INBOUND_REFERRAL_HISTORY_TAB
  };

  toggle(activeTab) {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div className="background referral referral-history">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={`${activeTab === INBOUND_REFERRAL_HISTORY_TAB ? 'active' : ''}`}
              onClick={() => this.toggle(INBOUND_REFERRAL_HISTORY_TAB)}
            >
              <span className="d-inline">
                <Translate contentKey="referral.tabs.inboundReferralHistory" />
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${activeTab === OUTBOUND_REFERRAL_HISTORY_TAB ? 'active' : ''}`}
              onClick={() => this.toggle(OUTBOUND_REFERRAL_HISTORY_TAB)}
            >
              <span className="d-inline">
                <Translate contentKey="referral.tabs.outboundReferralHistory" />
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${activeTab === NUMBER_OF_REFERRALS_TAB ? 'active' : ''}`}
              onClick={() => this.toggle(NUMBER_OF_REFERRALS_TAB)}
            >
              <span className="d-inline">
                <Translate contentKey="referral.tabs.numberOfReferrals" />
              </span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={INBOUND_REFERRAL_HISTORY_TAB}>
            <ReferralHistoryTab type={REFERRAL_TYPE.INBOUND} location={this.props.location} />
          </TabPane>
          <TabPane tabId={OUTBOUND_REFERRAL_HISTORY_TAB}>
            <ReferralHistoryTab type={REFERRAL_TYPE.OUTBOUND} location={this.props.location} />
          </TabPane>
          <TabPane tabId={NUMBER_OF_REFERRALS_TAB}>
            <NumberOfReferralsTab />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = ({ referral }: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralHistory);
