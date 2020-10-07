import './refer-button.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { referRecord, unreferRecord } from '../provider-record.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { ISimpleOrganization } from 'app/shared/model/simple-organization.model';

export interface IReferButtonProp extends StateProps, DispatchProps {
  organization: ISimpleOrganization;
}

export class ReferButton extends React.Component<IReferButtonProp, {}> {
  render() {
    const { userName, organization, referredRecords } = this.props;

    if (referredRecords.has(organization.id)) {
      return (
        <div className="refer-button green" onClick={() => this.props.unreferRecord(organization, userName)}>
          <b className="d-flex align-items-center">
            <Translate contentKey="recordCard.referred" />
            &nbsp;
            <FontAwesomeIcon icon="check" />
          </b>
        </div>
      );
    } else {
      return (
        <div className="refer-button" onClick={() => this.props.referRecord(organization, userName)}>
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
  userName: authentication.account.login
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
