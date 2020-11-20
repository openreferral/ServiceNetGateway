import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { Input as StrapInput } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import ButtonPill from '../../shared/button-pill';
import { Link } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import Select from 'react-select';
import { checkIn, resetCheckedIn } from '../../provider-record.reducer';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { selectStyle } from 'app/config/constants';

export interface IBeneficiaryCheckInTabState {
  phoneNumber: String;
  beneficiaryId: String;
  cbo: any;
  location: any;
  isBeneficiaryValid: boolean;
  isCboValid: boolean;
  isLocationValid: boolean;
}

export interface IBeneficiaryCheckInTabProps extends StateProps, DispatchProps {}

class BeneficiaryCheckInTab extends React.Component<IBeneficiaryCheckInTabProps, IBeneficiaryCheckInTabState> {
  state: IBeneficiaryCheckInTabState = {
    phoneNumber: '',
    beneficiaryId: '',
    cbo: null,
    location: null,
    isBeneficiaryValid: true,
    isCboValid: true,
    isLocationValid: true
  };

  setPhone = phoneNumber => {
    this.setState({ phoneNumber, isBeneficiaryValid: isPossiblePhoneNumber(phoneNumber) });
  };

  setBeneficiary = evt => {
    this.setState({ beneficiaryId: evt.target.value, isBeneficiaryValid: true });
  };

  checkIn = () => {
    const { phoneNumber, beneficiaryId, cbo, location } = this.state;
    const { referralOptions, organizations } = this.props;
    if (this.validate()) {
      const orgId = referralOptions.length === 1 ? referralOptions[0].value : cbo;
      const organization = organizations.find(org => org.id === orgId);
      const locId = organization.locations.length === 1 ? organization.locations[0].id : location;
      this.props.checkIn(phoneNumber, beneficiaryId, orgId, locId);
    }
  };

  close = () => {
    this.setState({ phoneNumber: '', beneficiaryId: '', cbo: null, location: null });
    this.props.resetCheckedIn();
  };

  onSelect = evt => {
    this.setState({ cbo: evt.value, isCboValid: true, location: null, isLocationValid: false });
  };

  onLocationSelect = evt => {
    this.setState({ location: evt.value, isLocationValid: true });
  };

  validate = () => {
    const { phoneNumber, beneficiaryId, cbo, location } = this.state;
    const { referralOptions } = this.props;
    const selected = (cbo || referralOptions.length === 1) && (location || this.locationOptions().length === 1);

    const isPhoneValid = phoneNumber && isPossiblePhoneNumber(phoneNumber);
    const isBeneficiaryValid = isPhoneValid || beneficiaryId;
    const isCboValid = cbo || referralOptions.length === 1;
    const isLocationValid = location || this.locationOptions().length === 1;

    this.setState({ isBeneficiaryValid, isCboValid, isLocationValid });
    return isBeneficiaryValid && isCboValid && isLocationValid;
  };

  locationOptions = () => {
    if (this.state.cbo) {
      return _.map(_.get(this.props.organizations.find(org => org.id === this.state.cbo), 'locations'), loc => ({
        value: loc.id,
        label: loc.name
      }));
    } else if (this.props.referralOptions.length === 1) {
      return _.map(this.props.organizations[0].locations, loc => ({
        value: loc.id,
        label: loc.name
      }));
    } else {
      return [];
    }
  };

  render() {
    const { phoneNumber, cbo, location, isBeneficiaryValid, isCboValid, isLocationValid } = this.state;
    const { checkedIn, referralOptions } = this.props;
    const locationOptions = this.locationOptions();
    const commonClass = 'd-flex flex-column justify-content-center align-items-center';

    return (
      <div className="col-12 col-md-4 offset-md-4">
        <div className="content-title  my-3 my-md-5">
          <Translate contentKey="referral.title.check_in" />
        </div>
        {!checkedIn ? (
          <div className={commonClass}>
            <div className={`${commonClass} w-100 beneficiary-data ${isBeneficiaryValid ? '' : 'required'}`}>
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
            </div>
            {referralOptions.length > 1 ? (
              <Select
                className={`my-2 full-width refer-to ${isCboValid ? '' : 'required'}`}
                name="cbo"
                id="cbo"
                value={cbo ? cbo.id : null}
                options={referralOptions}
                onChange={this.onSelect}
                inputId="cboSelect"
                placeholder={translate('referral.placeholder.cbo')}
                styles={selectStyle()}
              />
            ) : null}
            {cbo != null && locationOptions.length > 1 ? (
              <Select
                className={`my-2 full-width refer-to ${isLocationValid ? '' : 'required'}`}
                name="location"
                id="location"
                value={location ? location.id : null}
                options={locationOptions}
                onChange={this.onLocationSelect}
                inputId="locationSelect"
                placeholder={translate('referral.placeholder.location')}
                styles={selectStyle()}
              />
            ) : null}
            <ButtonPill className="button-pill-green my-2" style={{ width: '100px' }} onClick={this.checkIn}>
              <Translate contentKey="referral.labels.send" />
            </ButtonPill>
          </div>
        ) : (
          <div className={commonClass}>
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
  organizations: providerRecord.providerOptions,
  referralOptions: _.map(providerRecord.providerOptions, org => ({
    value: org.id,
    label: org.name
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
