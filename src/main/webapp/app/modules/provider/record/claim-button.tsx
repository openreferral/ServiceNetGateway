import './claim-button.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { markRecordToClaim, unmarkRecordToClaim } from 'app/entities/organization/organization.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import ButtonPill from '../shared/button-pill';

export interface IClaimButtonProp extends StateProps, DispatchProps {
  record?: any;
  orgId?: string;
  style?: object;
}

export class ClaimButton extends React.Component<IClaimButtonProp, {}> {
  render() {
    const { record, claimedRecords, orgId, style } = this.props;
    const organizationId = record ? record.organization.id : orgId;
    if (claimedRecords && claimedRecords.indexOf(organizationId) > -1) {
      return (
        <ButtonPill
          className="claim-button button-pill-referred"
          style={style}
          onClick={() => this.props.unmarkRecordToClaim(organizationId)}
        >
          <b className="d-flex align-items-center justify-content-center h-100">
            <Translate contentKey="recordCard.claimed" />
            &nbsp;
            <FontAwesomeIcon icon="check" />
          </b>
        </ButtonPill>
      );
    } else {
      return (
        <ButtonPill className="claim-button button-pill-refer" style={style} onClick={() => this.props.markRecordToClaim(organizationId)}>
          <b className="d-flex align-items-center justify-content-center h-100">
            <Translate contentKey="recordCard.claim" />
          </b>
        </ButtonPill>
      );
    }
  }
}

const mapStateToProps = ({ organization }: IRootState) => ({
  claimedRecords: organization.claimedRecords
});

const mapDispatchToProps = {
  markRecordToClaim,
  unmarkRecordToClaim
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimButton);
