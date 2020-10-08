import React from 'react';
import { Input } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import ButtonPill from '../shared/button-pill';

export interface IBeneficiaryCheckInTabState {
  phone: String;
  beneficiary: String;
}

class BeneficiaryCheckInTab extends React.Component<{}, IBeneficiaryCheckInTabState> {
  state: IBeneficiaryCheckInTabState = {
    phone: '',
    beneficiary: ''
  };

  setPhone = phone => {
    this.setState({ phone });
  };

  setBeneficiary = beneficiary => {
    this.setState({ beneficiary });
  };

  render() {
    return (
      <div className="col-12 col-md-4 offset-md-4">
        <div className="content-title my-5">
          <Translate contentKey="referral.title.check_in" />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Input
            className="my-2"
            type="text"
            name="phone"
            id="phone"
            placeholder={translate('referral.placeholder.phone')}
            onChange={this.setPhone}
          />
          <Translate contentKey="referral.labels.or" />
          <Input
            className="my-2"
            type="text"
            name="beneficiary"
            id="beneficiary"
            placeholder={translate('referral.placeholder.beneficiary')}
            onChange={this.setBeneficiary}
          />
          <ButtonPill className="button-pill-green my-2" style={{ width: '100px' }}>
            <Translate contentKey="referral.labels.send" />
          </ButtonPill>
        </div>
      </div>
    );
  }
}

export default BeneficiaryCheckInTab;
