import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { Input as StrapInput } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import ButtonPill from '../shared/button-pill';
import { Link } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import Select from 'react-select';
import { checkIn, resetCheckedIn } from '../provider-record.reducer';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { selectStyle } from 'app/config/constants';

export interface IBeneficiaryCheckInTabState {
  phoneNumber: String;
  beneficiaryId: String;
  cbo: any;
}

export interface IBeneficiaryCheckInTabProps extends StateProps, DispatchProps {}

class BeneficiaryCheckInTab extends React.Component<IBeneficiaryCheckInTabProps, IBeneficiaryCheckInTabState> {
  state: IBeneficiaryCheckInTabState = {
    phoneNumber: '',
    beneficiaryId: '',
    cbo: null
  };

  setPhone = phoneNumber => {
    this.setState({ phoneNumber });
  };

  setBeneficiary = evt => {
    this.setState({ beneficiaryId: evt.target.value });
  };

  sendReferral = () => {
    const { phoneNumber, beneficiaryId, cbo } = this.state;
    const { referralOptions } = this.props;
    const cboId = referralOptions.length === 1 ? referralOptions[0].value : cbo;
    this.props.checkIn(phoneNumber, beneficiaryId, cboId);
  };

  close = () => {
    this.setState({ phoneNumber: '', beneficiaryId: '', cbo: null });
    this.props.resetCheckedIn();
  };

  onSelect = cbo => {
    this.setState({ cbo: cbo.value });
  };

  canBeSent = () => {
    const { phoneNumber, beneficiaryId, cbo } = this.state;
    const { referralOptions } = this.props;

    if (phoneNumber && isPossiblePhoneNumber(phoneNumber) && (cbo || referralOptions.length === 1)) {
      return true;
    } else if (!phoneNumber && beneficiaryId && (cbo || referralOptions.length === 1)) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { phoneNumber, cbo } = this.state;
    const { checkedIn, referralOptions } = this.props;

    return (
      <div className="col-12 col-md-4 offset-md-4">
        <div className="content-title my-5">
          <Translate contentKey="referral.title.check_in" />
        </div>
        {!checkedIn ? (
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
              name="beneficiary"
              id="beneficiary"
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
              className={`button-pill-green my-2 ${this.canBeSent() ? '' : 'disabled'}`}
              style={{ width: '100px' }}
              onClick={this.canBeSent() ? this.sendReferral : null}
            >
              <Translate contentKey="referral.labels.send" />
            </ButtonPill>
          </div>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="my-2">
              <Translate contentKey="referral.labels.sent" />
            </div>
            <ButtonPill className="button-pill-green my-2" style={{ width: '200px' }} onClick={this.close}>
              <Translate contentKey="referral.labels.close" />
            </ButtonPill>
            <Link to="/">
              <ButtonPill className="button-pill-green my-2" style={{ width: '200px' }}>
                <Translate contentKey="referral.labels.homePage" />
              </ButtonPill>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ providerRecord }: IRootState) => ({
  referralOptions: _.map(providerRecord.records, record => ({
    value: record.organization.id,
    label: record.organization.name
  })),
  checkedIn: providerRecord.checkedIn
});

const mapDispatchToProps = {
  checkIn,
  resetCheckedIn
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BeneficiaryCheckInTab);
