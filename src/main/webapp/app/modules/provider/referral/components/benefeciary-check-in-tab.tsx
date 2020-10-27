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
}

export interface IBeneficiaryCheckInTabProps extends StateProps, DispatchProps {}

class BeneficiaryCheckInTab extends React.Component<IBeneficiaryCheckInTabProps, IBeneficiaryCheckInTabState> {
  state: IBeneficiaryCheckInTabState = {
    phoneNumber: '',
    beneficiaryId: '',
    cbo: null,
    location: null
  };

  setPhone = phoneNumber => {
    this.setState({ phoneNumber });
  };

  setBeneficiary = evt => {
    this.setState({ beneficiaryId: evt.target.value });
  };

  checkIn = () => {
    const { phoneNumber, beneficiaryId, cbo, location } = this.state;
    const { referralOptions, organizations } = this.props;
    const orgId = referralOptions.length === 1 ? referralOptions[0].value : cbo;
    const organization = organizations.find(org => org.id === cbo);
    const locId = organization.locations.length === 1 ? organization.locations[0].id : location;
    this.props.checkIn(phoneNumber, beneficiaryId, orgId, locId);
  };

  close = () => {
    this.setState({ phoneNumber: '', beneficiaryId: '', cbo: null, location: null });
    this.props.resetCheckedIn();
  };

  onSelect = evt => {
    this.setState({ cbo: evt.value });
  };

  onLocationSelect = evt => {
    this.setState({ location: evt.value });
  };

  canBeSent = () => {
    const { phoneNumber, beneficiaryId, cbo, location } = this.state;
    const { referralOptions } = this.props;
    const selected = (cbo || referralOptions.length === 1)
      && (location || this.locationOptions().length === 1);

    if (phoneNumber && isPossiblePhoneNumber(phoneNumber) && selected) {
      return true;
    } else return !!(!phoneNumber && beneficiaryId && selected);
  };

  locationOptions = () => this.state.cbo ? _.map(
    _.get(this.props.organizations.find(org => org.id === this.state.cbo), 'locations'),
    loc => ({
      value: loc.id,
      label: loc.name
    })
  ) : [];

  render() {
    const { phoneNumber, cbo, location } = this.state;
    const { checkedIn, referralOptions } = this.props;
    const locationOptions = this.locationOptions();

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
                className="my-2 full-width"
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
                className="my-2 full-width"
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
            <ButtonPill
              className={`button-pill-green my-2 ${this.canBeSent() ? '' : 'disabled'}`}
              style={{ width: '100px' }}
              onClick={this.canBeSent() ? this.checkIn : null}
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
