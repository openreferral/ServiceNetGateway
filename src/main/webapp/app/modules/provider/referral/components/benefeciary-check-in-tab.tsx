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
import mediaQueryWrapper from 'app/shared/util/media-query-wrapper';
import { toast } from 'react-toastify';
import { IReferralTabProps, IReferralTabState } from 'app/modules/provider/referral/components/referral-tab';

export interface IBeneficiaryCheckInTabState {
  phoneNumber: String;
  beneficiaryId: String;
  cbo: any;
  location: any;
  isBeneficiaryValid: boolean;
  isCboValid: boolean;
  isLocationValid: boolean;
  showSummary: boolean;
}

export interface IBeneficiaryCheckInTabProps extends StateProps, DispatchProps {
  isMobile: boolean;
  handleClose: any;
}

class BeneficiaryCheckInTab extends React.Component<IBeneficiaryCheckInTabProps, IBeneficiaryCheckInTabState> {
  state: IBeneficiaryCheckInTabState = {
    phoneNumber: '',
    beneficiaryId: '',
    cbo: null,
    location: null,
    isBeneficiaryValid: true,
    isCboValid: true,
    isLocationValid: true,
    showSummary: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { checkedIn } = this.props;
    if (prevProps.checkedIn !== checkedIn && checkedIn) {
      toast.success(translate('referral.labels.sent'));
      this.showSummary();
    }
  }

  showSummary() {
    this.setState({ showSummary: true });
  }

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
    this.props.handleClose();
  };

  onSelect = evt => {
    this.setState({ cbo: evt.value, isCboValid: true, location: null });
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
    const { phoneNumber, beneficiaryId, cbo, location, isBeneficiaryValid, isCboValid, isLocationValid, showSummary } = this.state;
    const { referralOptions, isMobile } = this.props;
    const locationOptions = this.locationOptions();
    const commonClass = 'd-flex justify-content-center align-items-center';

    return (
      <div className="col-12">
        {!showSummary ? (
          <div className={`${commonClass} flex-column`}>
            <div className={`mt-2 w-100 referral-label ${isBeneficiaryValid ? '' : 'required'}`}>
              <Translate contentKey="referral.labels.beneficiaryInformation" />
            </div>
            <div className={`${commonClass} w-100 beneficiary-data ${isBeneficiaryValid ? '' : 'required'}`}>
              <Input
                className="my-2 form-control"
                type="text"
                name="phone"
                id="phone"
                placeholder={isMobile ? translate('referral.placeholder.phoneMobile') : translate('referral.placeholder.phone')}
                onChange={this.setPhone}
                value={phoneNumber}
                country="US"
              />
              &nbsp;
              <Translate contentKey="referral.labels.or" />
              &nbsp;
              <StrapInput
                className="my-2"
                type="text"
                name="beneficiary"
                id="beneficiary"
                placeholder={isMobile ? translate('referral.placeholder.beneficiaryMobile') : translate('referral.placeholder.beneficiary')}
                onChange={this.setBeneficiary}
              />
            </div>
            {phoneNumber &&
              !isPossiblePhoneNumber(phoneNumber) && (
                <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
              )}
            {referralOptions.length > 1 ? (
              <>
                <div className={`mt-2 w-100 referral-label ${isCboValid ? '' : 'required'}`}>
                  <Translate contentKey="referral.labels.organization" />
                </div>
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
              </>
            ) : null}
            {cbo != null && locationOptions.length > 1 ? (
              <>
                <div className={`mt-2 w-100 referral-label ${isLocationValid ? '' : 'required'}`}>
                  <Translate contentKey="referral.labels.location" />
                </div>
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
              </>
            ) : null}
            <ButtonPill className="button-pill-green my-2" style={{ width: '100px' }} onClick={this.checkIn}>
              <Translate contentKey="referral.labels.send" />
            </ButtonPill>
          </div>
        ) : (
          <div className={`${commonClass} flex-column checked-in-label`}>
            <Translate
              contentKey="referral.successfullyCheckedIn"
              interpolate={{
                beneficiary: phoneNumber || beneficiaryId,
                orgName: referralOptions.length === 1 ? referralOptions[0].label : _.find(referralOptions, opt => opt.value === cbo).label
              }}
            />
            <ButtonPill className="button-pill-green my-2" style={{ width: '110px' }} onClick={this.props.handleClose}>
              <Translate contentKey="referral.labels.close" />
            </ButtonPill>
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
)(mediaQueryWrapper(BeneficiaryCheckInTab));
