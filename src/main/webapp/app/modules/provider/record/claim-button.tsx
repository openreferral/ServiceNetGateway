import './claim-button.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { markRecordToClaim, unmarkRecordToClaim } from 'app/entities/organization/organization.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import ButtonPill from '../shared/button-pill';

export interface IClaimButtonProp extends StateProps, DispatchProps {
  record: any;
}

export class ClaimButton extends React.Component<IClaimButtonProp, {}> {
  render() {
    const { record, claimedRecords } = this.props;
    if (claimedRecords && claimedRecords.indexOf(record.organization.id) > -1) {
      return (
        <ButtonPill className="claim-button button-pill-referred" onClick={() => this.props.unmarkRecordToClaim(record.organization.id)}>
          <b className="d-flex align-items-center justify-content-center h-100">
            <Translate contentKey="recordCard.claimed" />
            &nbsp;
            <FontAwesomeIcon icon="check" />
          </b>
        </ButtonPill>
      );
    } else {
      return (
        <ButtonPill className="claim-button button-pill-refer" onClick={() => this.props.markRecordToClaim(record.organization.id)}>
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
