import React from 'react';
import { Translate, translate } from 'react-jhipster';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { Table, Input as StrapInput } from 'reactstrap';
import ButtonPill from '../../shared/button-pill';
import { sendReferrals, unreferRecord } from 'app/modules/provider/provider-record.reducer';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import Select from 'react-select';
import { DESKTOP_WIDTH_BREAKPOINT, GA_ACTIONS, MOBILE_WIDTH_BREAKPOINT, selectStyle } from 'app/config/constants';
import { toast } from 'react-toastify';
import MediaQuery from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mediaQueryWrapper from 'app/shared/util/media-query-wrapper';
import { sendAction } from 'app/shared/util/analytics';

export interface IReferralTabProps extends StateProps, DispatchProps {
  isMobile: boolean;
  handleClose: any;
}

export interface IReferralTabState {
  phoneNumber: string;
  beneficiaryId: string;
  cbo: any;
  fromLocation: any;
  orgLocations: any;
  missingLocations: any;
  isBeneficiaryValid: boolean;
  isReferFromValid: boolean;
  isFromLocationValid: boolean;
  showSummary: boolean;
  referredTo: any;
}

class ReferralTab extends React.Component<IReferralTabProps, IReferralTabState> {
  state: IReferralTabState = {
    phoneNumber: '',
    beneficiaryId: '',
    cbo: null,
    fromLocation: null,
    orgLocations: {},
    missingLocations: [],
    isBeneficiaryValid: true,
    isReferFromValid: true,
    isFromLocationValid: true,
    showSummary: false,
    referredTo: []
  };

  componentDidMount() {
    if (this.props.referredRecords) {
      const orgLocations = {};
      this.props.referredRecords.forEach((record, id) => {
        if (record.locations.length === 1) {
          orgLocations[id] = record.locations[0].id;
        }
      });
      this.setState({ orgLocations });
    }
  }

  componentDidUpdate(prevProps: Readonly<IReferralTabProps>, prevState: Readonly<IReferralTabState>, snapshot?: any) {
    const { referSuccess, error } = this.props;
    if (prevProps.referSuccess !== this.props.referSuccess) {
      if (referSuccess) {
        toast.success(translate('referral.records.referSuccess'));
        this.showSummary();
      } else if (!!error) {
        toast.error(translate('referral.records.referFailure'));
      }
    }
  }

  showSummary() {
    this.setState({ showSummary: true });
  }

  handleClose() {
    this.setState({ showSummary: false }, () => this.props.handleClose());
  }

  setPhone = phoneNumber => {
    this.setState({ phoneNumber, isBeneficiaryValid: isPossiblePhoneNumber(phoneNumber) });
  };

  setBeneficiary = e => {
    this.setState({ beneficiaryId: e.target.value, isBeneficiaryValid: true });
  };

  onSelect = cbo => {
    this.setState({ cbo: cbo.value, isReferFromValid: true, fromLocation: null });
  };

  sendReferrals = () => {
    if (this.validate()) {
      const { phoneNumber, beneficiaryId, cbo, fromLocation, orgLocations } = this.state;
      const { referredRecords, referralOptions, organizations } = this.props;
      // from
      const cboId = referralOptions.length === 1 ? referralOptions[0].value : cbo;
      const fromOrganization = organizations.find(org => org.id === cboId);
      const fromLocationId = fromOrganization && fromOrganization.locations.length === 1 ? fromOrganization.locations[0].id : fromLocation;
      // to
      const orgLocationMap = {};
      referredRecords.forEach((record, id) => {
        orgLocationMap[id] = orgLocations[id] || record.locations[0].id;
      });
      this.setState({ referredTo: referredRecords }, () =>
        this.props.sendReferrals(cboId, orgLocationMap, fromLocationId, phoneNumber, beneficiaryId)
      );
      if (!!phoneNumber) {
        sendAction(GA_ACTIONS.REFERRAL_PHONE);
      } else if (!!beneficiaryId) {
        sendAction(GA_ACTIONS.REFERRAL_SN_ID);
      }
    }
  };

  validate = () => {
    const { phoneNumber, beneficiaryId, cbo, fromLocation } = this.state;
    const { referralOptions } = this.props;

    const isPhoneValid = phoneNumber && isPossiblePhoneNumber(phoneNumber);
    const isBeneficiaryValid = isPhoneValid || beneficiaryId;
    const isReferFromValid = cbo || referralOptions.length <= 1;
    const isFromLocationValid = fromLocation || this.locationOptions().length === 1 || referralOptions.length <= 1;
    const missingLocations = this.validateLocations();

    this.setState({ isBeneficiaryValid, isReferFromValid, missingLocations, isFromLocationValid });
    return isBeneficiaryValid && isReferFromValid && missingLocations.length === 0 && isFromLocationValid;
  };

  validateLocations = () => {
    const { orgLocations } = this.state;
    const { referredRecords } = this.props;

    const missingLocations = [];
    referredRecords.forEach((record, id) => {
      if (!orgLocations[id]) {
        missingLocations.push(id);
      }
    });
    return missingLocations;
  };

  locationOptions = () =>
    this.state.cbo
      ? _.map(_.get(this.props.organizations.find(org => org.id === this.state.cbo), 'locations'), loc => ({
          value: loc.id,
          label: loc.name
        }))
      : [];

  onFromLocationSelect = evt => {
    this.setState({ fromLocation: evt.value, isFromLocationValid: true });
  };

  recordLocationOptions = record =>
    _.map(record.locations, loc => ({
      value: loc.id,
      label: loc.name
    }));

  onToLocationSelect = id => evt => {
    const { orgLocations, missingLocations } = this.state;
    orgLocations[id] = evt.value;
    if (missingLocations.indexOf(id) >= 0) {
      _.remove(missingLocations, orgId => orgId === id);
    }
    this.setState({ orgLocations, missingLocations });
  };

  content = () => {
    const {
      phoneNumber,
      beneficiaryId,
      cbo,
      fromLocation,
      orgLocations,
      isBeneficiaryValid,
      isReferFromValid,
      missingLocations,
      isFromLocationValid,
      showSummary,
      referredTo
    } = this.state;
    const { isMobile, referralOptions, referredRecords } = this.props;
    const commonClass = 'd-flex justify-content-center align-items-center';
    const referralTableBody = [];
    const locationOptions = this.locationOptions();
    this.props.referredRecords.forEach((record, id) => {
      const recordLocationOptions = this.recordLocationOptions(record);
      const toLocationValue = orgLocations[id] ? _.find(recordLocationOptions, opt => opt.value === orgLocations[id]) : null;
      referralTableBody.push(
        <tr key={`org-${id}`}>
          <td>
            <div>{record.organization.name}</div>
          </td>
          <td>
            <div className="d-flex">
              <Select
                className={`full-width to-location ${missingLocations.indexOf(id) >= 0 ? 'required' : ''}`}
                value={toLocationValue}
                options={recordLocationOptions}
                onChange={this.onToLocationSelect(id)}
                styles={selectStyle()}
              />
            </div>
          </td>
          <td>
            <ButtonPill className="button-pill-danger pull-right" onClick={() => this.props.unreferRecord(record, this.props.userName)}>
              <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
                <FontAwesomeIcon icon="trash" />
              </MediaQuery>
              <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
                <Translate contentKey="referral.records.remove" />
              </MediaQuery>
            </ButtonPill>
          </td>
        </tr>
      );
    });
    const orgNames = [];
    referredTo.forEach((referredRecord, id) => {
      orgNames.push(`${referredRecord.organization.name}`);
    });
    return (
      <>
        {!showSummary ? (
          <>
            <div className={`${commonClass} flex-column mb-2 referral-table`}>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>
                      <Translate contentKey="referral.records.name">Name</Translate>
                    </th>
                    <th>
                      <Translate contentKey="referral.records.location">Location</Translate>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>{referralTableBody}</tbody>
              </Table>
            </div>
            <div className={`${commonClass}  flex-column`}>
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
                  name="beneficiaryId"
                  id="beneficiaryId"
                  placeholder={
                    isMobile ? translate('referral.placeholder.beneficiaryMobile') : translate('referral.placeholder.beneficiary')
                  }
                  onChange={this.setBeneficiary}
                />
              </div>
              {phoneNumber &&
                !isPossiblePhoneNumber(phoneNumber) && (
                  <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
                )}
              {referralOptions.length > 1 ? (
                <>
                  <div className={`mt-2 w-100 referral-label ${isReferFromValid ? '' : 'required'}`}>
                    <Translate contentKey="referral.labels.organization" />
                  </div>
                  <Select
                    className={`my-2 full-width refer-from ${isReferFromValid ? '' : 'required'}`}
                    name="cbo"
                    id="cbo"
                    value={cbo ? cbo.id : null}
                    options={referralOptions}
                    onChange={this.onSelect}
                    inputId="cbo"
                    placeholder={translate('referral.placeholder.referFrom')}
                    styles={selectStyle()}
                  />
                </>
              ) : null}
              {cbo != null && locationOptions.length > 1 ? (
                <>
                  <div className={`mt-2 w-100 referral-label ${isFromLocationValid ? '' : 'required'}`}>
                    <Translate contentKey="referral.labels.location" />
                  </div>
                  <Select
                    className={`my-2 full-width from-location ${isFromLocationValid ? '' : 'required'}`}
                    name="fromLocation"
                    id="fromLocation"
                    value={fromLocation ? fromLocation.id : null}
                    options={locationOptions}
                    onChange={this.onFromLocationSelect}
                    inputId="fromLocationSelect"
                    placeholder={translate('referral.placeholder.fromLocation')}
                    styles={selectStyle()}
                  />
                </>
              ) : null}
              <ButtonPill className="button-pill-green my-2" style={{ width: '100px' }} onClick={this.sendReferrals}>
                <Translate contentKey="referral.labels.send" />
              </ButtonPill>
            </div>
          </>
        ) : (
          <div className={`${commonClass} flex-column referred-label`}>
            <Translate
              contentKey="referral.successfullyReferred"
              interpolate={{
                beneficiary: phoneNumber || beneficiaryId,
                orgNames: orgNames.join('<br>')
              }}
            />
            <ButtonPill className="button-pill-green my-2" style={{ width: '110px' }} onClick={() => this.handleClose()}>
              <Translate contentKey="referral.labels.close" />
            </ButtonPill>
          </div>
        )}
      </>
    );
  };

  contentEmpty = () => <div>{translate('referral.records.empty')}</div>;

  render() {
    return (
      <div className="col-12">
        {!_.isEmpty(this.props.referredRecords) || this.state.showSummary ? this.content() : this.contentEmpty()}
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, providerRecord }: IRootState) => ({
  referredRecords: providerRecord.referredRecords,
  userName: authentication.account.login,
  organizations: providerRecord.providerOptions,
  referralOptions: _.map(providerRecord.providerOptions, org => ({
    value: org.id,
    label: org.name
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
)(mediaQueryWrapper(ReferralTab));
