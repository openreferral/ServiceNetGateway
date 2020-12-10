import './refer-button.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { referRecord, unreferRecord } from '../provider-record.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import ButtonPill from '../shared/button-pill';

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
        <ButtonPill className="refer-button button-pill-referred" onClick={() => this.props.unreferRecord(record, userName)}>
          <b className="d-flex align-items-center justify-content-center">
            <Translate contentKey="recordCard.referred" />
            &nbsp;
            <FontAwesomeIcon icon="check" />
          </b>
        </ButtonPill>
      );
    } else {
      return (
        <ButtonPill className="refer-button button-pill-refer" onClick={() => this.props.referRecord(record, userName)}>
          <b className="d-flex align-items-center justify-content-center">
            <Translate contentKey="recordCard.refer" />
          </b>
        </ButtonPill>
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
