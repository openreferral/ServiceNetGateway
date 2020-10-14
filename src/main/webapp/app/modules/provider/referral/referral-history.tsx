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

const REFERRAL_HISTORY_TAB = 'referral-history';
const NUMBER_OF_REFERRALS_TAB = 'number-of-referrals';

export interface IReferralHistoryProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IReferralHistoryState {
  activeTab: string;
}

class ReferralHistory extends React.Component<IReferralHistoryProp, IReferralHistoryState> {
  state: IReferralHistoryState = {
    activeTab: REFERRAL_HISTORY_TAB
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
              className={`text-nowrap ${activeTab === REFERRAL_HISTORY_TAB ? 'active' : ''}`}
              onClick={() => this.toggle(REFERRAL_HISTORY_TAB)}
            >
              <span className="d-inline">
                <Translate contentKey="referral.tabs.referralHistory" />
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={`text-nowrap ${activeTab === NUMBER_OF_REFERRALS_TAB ? 'active' : ''}`} onClick={() => this.toggle(NUMBER_OF_REFERRALS_TAB)}>
              <span className="d-inline">
                <Translate contentKey="referral.tabs.numberOfReferrals" />
              </span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={REFERRAL_HISTORY_TAB}>
            <ReferralHistoryTab location={this.props.location} />
          </TabPane>
          <TabPane tabId={NUMBER_OF_REFERRALS_TAB}>
            <NumberOfReferralsTab />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = ({ referral }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralHistory);
