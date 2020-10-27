import './refer-button.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { referRecord, unreferRecord } from '../provider-record.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

export interface IReferButtonProp extends StateProps, DispatchProps {
  record: any;
}

export class ReferButton extends React.Component<IReferButtonProp, {}> {
  render() {
    const { userName, record, referredRecords, isReferralEnabled } = this.props;
    if (!isReferralEnabled) {
      return null;
    }
    if (referredRecords.has(record.organization.id)) {
      return (
        <div className="refer-button green" onClick={() => this.props.unreferRecord(record, userName)}>
          <b className="d-flex align-items-center">
            <Translate contentKey="recordCard.referred" />
            &nbsp;
            <FontAwesomeIcon icon="check" />
          </b>
        </div>
      );
    } else {
      return (
        <div className="refer-button" onClick={() => this.props.referRecord(record, userName)}>
          <b>
            <Translate contentKey="recordCard.refer" />
          </b>
        </div>
      );
    }
  }
}

const mapStateToProps = ({ authentication, providerRecord }: IRootState) => ({
  referredRecords: providerRecord.referredRecords,
  userName: authentication.account.login,
  isReferralEnabled: authentication.account.siloIsReferralEnabled
});

const mapDispatchToProps = {
  referRecord,
  unreferRecord
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferButton);
