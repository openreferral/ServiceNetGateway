import React from 'react';
import { Button, Col, Label, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { locales, languages } from 'app/config/translation';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { saveAccountSettings, reset } from './settings.reducer';
import { RouteComponentProps } from 'react-router-dom';

export interface IUserSettingsProps extends StateProps, DispatchProps, RouteComponentProps {}

export interface IUserSettingsState {
  account: any;
  phoneNumber: string;
}

export class SettingsPage extends React.Component<IUserSettingsProps, IUserSettingsState> {
  state: IUserSettingsState = {
    account: this.props.account,
    phoneNumber: this.props.account.phoneNumber
  };

  componentDidMount() {
    this.props.getSession();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  componentDidUpdate(prevProps) {
    if (this.props.account && prevProps.account && this.props.account.phoneNumber !== prevProps.account.phoneNumber) {
      this.setState({ phoneNumber: this.props.account.phoneNumber });
    }
  }

  handleValidSubmit = (event, values) => {
    if (this.state.phoneNumber && !isPossiblePhoneNumber(this.state.phoneNumber)) {
      return;
    }
    const account = {
      ...this.props.account,
      ...values,
      phoneNumber: this.state.phoneNumber
    };

    this.props.saveAccountSettings(account);
    event.persist();
    this.props.history.push(`/`);
  };

  setPhoneNumber = phoneNumber => {
    this.setState({ phoneNumber });
  };

  render() {
    const { account } = this.props;
    const { phoneNumber } = this.state;

    return (
      <div className="m-3">
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="settings-title">
              <Translate contentKey="settings.title" interpolate={{ username: account.login }}>
                User settings for {account.login}
              </Translate>
            </h2>
            <AvForm id="settings-form" onValidSubmit={this.handleValidSubmit}>
              {/* First name */}
              <AvField
                className="form-control"
                name="firstName"
                label={translate('settings.form.firstname')}
                id="firstName"
                placeholder={translate('settings.form.firstname.placeholder')}
                validate={{
                  required: { value: true, errorMessage: translate('settings.messages.validate.firstname.required') },
                  minLength: { value: 1, errorMessage: translate('settings.messages.validate.firstname.minlength') },
                  maxLength: { value: 50, errorMessage: translate('settings.messages.validate.firstname.maxlength') }
                }}
                value={account.firstName}
              />
              {/* Last name */}
              <AvField
                className="form-control"
                name="lastName"
                label={translate('settings.form.lastname')}
                id="lastName"
                placeholder={translate('settings.form.lastname.placeholder')}
                validate={{
                  required: { value: true, errorMessage: translate('settings.messages.validate.lastname.required') },
                  minLength: { value: 1, errorMessage: translate('settings.messages.validate.lastname.minlength') },
                  maxLength: { value: 50, errorMessage: translate('settings.messages.validate.lastname.maxlength') }
                }}
                value={account.lastName}
              />
              {/* Email */}
              <AvField
                name="email"
                label={translate('global.form.email')}
                placeholder={translate('global.form.email.placeholder')}
                type="email"
                validate={{
                  required: { value: true, errorMessage: translate('global.messages.validate.email.required') },
                  minLength: { value: 5, errorMessage: translate('global.messages.validate.email.minlength') },
                  maxLength: { value: 254, errorMessage: translate('global.messages.validate.email.maxlength') }
                }}
                value={account.email}
              />
              {/* Organization Name */}
              <AvField
                name="organizationName"
                label={translate('userManagement.organizationName')}
                placeholder={translate('userManagement.organizationName.placeholder')}
                type="text"
                validate={{
                  required: {
                    value: true,
                    errorMessage: translate('register.messages.validate.organizationName.required')
                  }
                }}
                value={account.organizationName}
              />
              {/* Organization URL */}
              <AvField
                name="organizationUrl"
                label={translate('userManagement.organizationUrl')}
                placeholder={translate('userManagement.organizationUrl.placeholder')}
                type="text"
                validate={{
                  maxLength: {
                    value: 254,
                    errorMessage: translate('register.messages.validate.organizationUrl.maxlength')
                  },
                  pattern: {
                    value: '^((http|https)://)?(www.)?[0-9a-zA-Z\\-]+\\..+$',
                    errorMessage: translate('register.messages.validate.organizationUrl.pattern')
                  }
                }}
                value={account.organizationUrl}
              />
              {/* Phone Number */}
              <AvGroup className="form-group">
                <Label for="phoneNumber" className={`${phoneNumber && !isPossiblePhoneNumber(phoneNumber) ? 'text-danger' : ''}`}>
                  <Translate contentKey="userManagement.phoneNumber">Phone Number</Translate>
                </Label>
                <Input
                  className="form-control"
                  name="phoneNumber"
                  label={translate('userManagement.phoneNumber')}
                  placeholder={translate('userManagement.phoneNumber.placeholder')}
                  country="US"
                  value={phoneNumber}
                  onChange={this.setPhoneNumber}
                />
                {phoneNumber &&
                  !isPossiblePhoneNumber(phoneNumber) && (
                    <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
                  )}
              </AvGroup>
              {/* Language key */}
              <AvField
                type="select"
                id="langKey"
                name="langKey"
                className="form-control"
                label={translate('settings.form.language')}
                value={account.langKey}
              >
                {locales.map(locale => (
                  <option value={locale} key={locale}>
                    {languages[locale].name}
                  </option>
                ))}
              </AvField>
              <Button color="primary" type="submit">
                <Translate contentKey="settings.form.button">Save</Translate>
              </Button>
            </AvForm>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = { getSession, saveAccountSettings, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage);
