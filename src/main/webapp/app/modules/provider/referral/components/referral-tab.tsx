import React from 'react';
import { Translate, translate } from 'react-jhipster';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { Table, Input as StrapInput } from 'reactstrap';
import ButtonPill from '../../shared/button-pill';
import { getProviderOptions, sendReferrals, unreferRecord } from 'app/modules/provider/provider-record.reducer';
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
  fromLocation: any;
  orgLocations: any;
}

class ReferralTab extends React.Component<IReferralTabProps, IReferralTabState> {
  state: IReferralTabState = {
    phoneNumber: '',
    beneficiaryId: '',
    cbo: null,
    fromLocation: null,
    orgLocations: {}
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
    const { phoneNumber, beneficiaryId, cbo, fromLocation, orgLocations } = this.state;
    const { referredRecords, referralOptions, organizations } = this.props;
    // from
    const cboId = referralOptions.length === 1 ? referralOptions[0].value : cbo;
    const fromOrganization = organizations.find(org => org.id === cbo);
    const fromLocationId = fromOrganization.locations.length === 1 ? fromOrganization.locations[0].id : fromLocation;
    // to
    const orgLocationMap = {};
    referredRecords.forEach((record, id) => {
      orgLocationMap[id] = orgLocations[id] || record.locations[0].id;
    });
    this.props.sendReferrals(
      cboId, orgLocationMap, fromLocationId, phoneNumber, beneficiaryId
    );
  }

  validate = () => {
    const { phoneNumber, beneficiaryId, cbo } = this.state;
    const { referralOptions } = this.props;

    if (phoneNumber && isPossiblePhoneNumber(phoneNumber) && (cbo || referralOptions.length === 1)) {
      return true;
    } else return !!(!phoneNumber && beneficiaryId && (cbo || referralOptions.length === 1));
  };

  locationOptions = () => this.state.cbo ? _.map(
    _.get(this.props.organizations.find(org => org.id === this.state.cbo), 'locations'),
    loc => ({
      value: loc.id,
      label: loc.name
    })
  ) : [];

  onFromLocationSelect = evt => {
    this.setState({ fromLocation: evt.value });
  };

  recordLocationOptions = record => _.map(record.locations, loc => ({
    value: loc.id,
    label: loc.name
  }));

  onToLocationSelect = id => evt => {
    const orgLocations = this.state;
    orgLocations[id] = evt.value;
    this.setState({ orgLocations });
  };

  content = () => {
    const { phoneNumber, cbo, fromLocation, orgLocations } = this.state;
    const { referralOptions } = this.props;
    const referralTableBody = [];
    const locationOptions = this.locationOptions();
    this.props.referredRecords.forEach((record, id) => {
      referralTableBody.push(
        <tr key={`org-${id}`}>
          <td>
            <div>{record.organization.name}</div>
          </td>
          <td className="d-flex">
            <Select
              className="full-width"
              value={orgLocations[id] ? orgLocations[id].id : null}
              options={this.recordLocationOptions(record)}
              onChange={this.onToLocationSelect(id)}
              styles={selectStyle()}
            />
          </td>
          <td>
            <ButtonPill className="button-pill-danger pull-right" onClick={() => this.props.unreferRecord(record, this.props.userName)}>
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
            <th>
              <Translate contentKey="referral.records.location">Location</Translate>
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
            className="my-2 full-width"
            name="cbo"
            id="cbo"
            value={cbo ? cbo.id : null}
            options={referralOptions}
            onChange={this.onSelect}
            inputId="cbo"
            placeholder={translate('referral.placeholder.referFrom')}
            styles={selectStyle()}
          />
        ) : null}
        {cbo != null && locationOptions.length > 1 ? (
          <Select
            className="my-2 full-width"
            name="fromLocation"
            id="fromLocation"
            value={fromLocation ? fromLocation.id : null}
            options={locationOptions}
            onChange={this.onFromLocationSelect}
            inputId="fromLocationSelect"
            placeholder={translate('referral.placeholder.fromLocation')}
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
      <div className="col-12 col-md-6 offset-md-3">
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
)(ReferralTab);
