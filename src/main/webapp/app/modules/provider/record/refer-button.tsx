import './refer-button.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { referRecord, unreferRecord } from '../provider-record.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

export interface IReferButtonProp extends StateProps, DispatchProps {
  recordId: any;
}

export class ReferButton extends React.Component<IReferButtonProp, {}> {
  render() {
    const { userName, recordId, referredRecords } = this.props;

    if (_.includes(referredRecords, recordId)) {
      return (
        <div className="refer-button green" onClick={() => this.props.unreferRecord(recordId, userName)}>
          <b className="d-flex align-items-center">
            <Translate contentKey="recordCard.referred" />
            &nbsp;
            <FontAwesomeIcon icon="check" />
          </b>
        </div>
      );
    } else {
      return (
        <div className="refer-button" onClick={() => this.props.referRecord(recordId, userName)}>
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
