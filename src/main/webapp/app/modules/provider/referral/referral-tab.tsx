import React from 'react';
import { Translate, translate } from 'react-jhipster';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { Table, Input as StrapInput } from 'reactstrap';
import ButtonPill from '../shared/button-pill';
import { sendReferrals, unreferRecord } from 'app/modules/provider/provider-record.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import Select from 'react-select';
import { selectStyle } from 'app/config/constants';
import { toast } from 'react-toastify';

export interface IReferralTabProps extends StateProps, DispatchProps {}

export interface IReferralTabState {
  phoneNumber: string;
  beneficiaryId: string;
  cbo: any;
}

class ReferralTab extends React.Component<IReferralTabProps, IReferralTabState> {
  state: IReferralTabState = {
    phoneNumber: '',
    beneficiaryId: '',
    cbo: null
  };

  componentDidUpdate(prevProps: Readonly<IReferralTabProps>, prevState: Readonly<IReferralTabState>, snapshot?: any) {
    const { referSuccess, error } = this.props;
    if (prevProps.referSuccess !== this.props.referSuccess) {
      if (referSuccess) {
        toast.success(translate('referral.records.referSuccess'));
      } else if (!!error) {
        toast.error(translate('referral.records.referFailure'));
      }
    }
  }

  setPhone = phoneNumber => {
    this.setState({ phoneNumber });
  };

  setBeneficiary = e => {
    this.setState({ beneficiaryId: e.target.value });
  };

  onSelect = cbo => {
    this.setState({ cbo: cbo.value });
  };

  sendReferrals = () => {
    const { phoneNumber, beneficiaryId, cbo } = this.state;
    const { referredRecords, referralOptions } = this.props;
    const cboId = referralOptions.length === 1 ? referralOptions[0].value : cbo;
    this.props.sendReferrals(
      cboId, referredRecords, phoneNumber, beneficiaryId
    );
  }

  validate = () => {
    const { phoneNumber, beneficiaryId, cbo } = this.state;
    const { referralOptions } = this.props;

    if (phoneNumber && isPossiblePhoneNumber(phoneNumber) && (cbo || referralOptions.length === 1)) {
      return true;
    } else return !!(!phoneNumber && beneficiaryId && (cbo || referralOptions.length === 1));
  };

  content = () => {
    const { phoneNumber, cbo } = this.state;
    const { referralOptions } = this.props;
    const referralTableBody = [];
    this.props.referredRecords.forEach((organization, id) => {
      referralTableBody.push(
        <tr key={`org-${id}`}>
          <td>
            <div>{organization.name}</div>
          </td>
          <td className="d-flex pull-right">
            <ButtonPill className="button-pill-danger" onClick={() => this.props.unreferRecord(organization, this.props.userName)}>
              <Translate contentKey="referral.records.remove" />
            </ButtonPill>
          </td>
        </tr>
      );
    });
    return <>
      <div className="d-flex flex-column justify-content-center align-items-center mb-2">
        <Table size="sm">
          <thead>
          <tr>
            <th>
              <Translate contentKey="referral.records.name">Name</Translate>
            </th>
            <th />
          </tr>
          </thead>
          <tbody>
            {referralTableBody}
          </tbody>
        </Table>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Input
          className="my-2 form-control"
          type="text"
          name="phone"
          id="phone"
          placeholder={translate('referral.placeholder.phone')}
          onChange={this.setPhone}
          value={phoneNumber}
          country="US"
        />
        {phoneNumber &&
        !isPossiblePhoneNumber(phoneNumber) && (
          <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
        )}
        <Translate contentKey="referral.labels.or" />
        <StrapInput
          className="my-2"
          type="text"
          name="beneficiaryId"
          id="beneficiaryId"
          placeholder={translate('referral.placeholder.beneficiary')}
          onChange={this.setBeneficiary}
        />
        {referralOptions.length > 1 ? (
          <Select
            className="my-2"
            name="cbo"
            id="cbo"
            value={cbo ? cbo.id : null}
            options={referralOptions}
            onChange={this.onSelect}
            inputId="cityInput"
            placeholder={translate('referral.placeholder.cbo')}
            styles={selectStyle()}
          />
        ) : null}
        <ButtonPill
          className={`button-pill-green my-2 ${this.validate() ? '' : 'disabled'}`}
          style={{ width: '100px' }}
          onClick={this.validate() ? this.sendReferrals : null}>
          <Translate contentKey="referral.labels.send" />
        </ButtonPill>
      </div>
    </>;
  }

  contentEmpty = () => <div>{translate('referral.records.empty')}</div>;

  render() {
    return (
      <div className="col-12 col-md-4 offset-md-4">
        <div className="content-title my-5">
          <Translate contentKey="referral.title.referrals" />
        </div>
        {!_.isEmpty(this.props.referredRecords) ? this.content() : this.contentEmpty()}
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, providerRecord }: IRootState) => ({
  referredRecords: providerRecord.referredRecords,
  userName: authentication.account.login,
  referralOptions: _.map(providerRecord.records, record => ({
    value: record.organization.id,
    label: record.organization.name
  })),
  referSuccess: providerRecord.referSuccess,
  error: providerRecord.errorMessage
});

const mapDispatchToProps = {
  unreferRecord,
  sendReferrals
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralTab);
