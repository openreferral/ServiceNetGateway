import './register.scss';
import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import { Row, Col, Alert, Button, Label } from 'reactstrap';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { IRootState } from 'app/shared/reducers';
import { handleRegister, handleRegisterWithinSilo, reset } from './register.reducer';
import ButtonPill from 'app/modules/provider/shared/button-pill';
import ReCAPTCHA from 'react-google-recaptcha';
import { getCaptcha, ICaptchaComponent, ICaptchaState } from 'app/shared/auth/captcha';
import { RECAPTCHA_SITE_KEY } from 'app/config/constants';
import { getProviderOrganizationOptions } from 'app/entities/organization/organization.reducer';
import Select from 'react-select';

export interface IRegisterProps extends StateProps, DispatchProps, RouteComponentProps<{ siloName: any }> {}

export interface IRegisterState extends ICaptchaState {
  password: string;
  phoneNumber: string;
  organizationOptions: any[];
}

export class RegisterPage extends React.Component<IRegisterProps, IRegisterState> implements ICaptchaComponent {
  state: IRegisterState = {
    password: '',
    phoneNumber: '',
    captcha: null,
    captchaError: '',
    organizationOptions: []
  };
  recaptchaRef = React.createRef();

  componentDidMount() {
    this.props.getProviderOrganizationOptions();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  onCaptchaChange = captcha => {
    this.setState({
      captcha
    });
  };

  onCaptchaErrored = captchaError => {
    this.setState({
      captchaError
    });
  };

  setPhoneNumber = phoneNumber => {
    this.setState({ phoneNumber });
  };

  handleValidSubmit = (event, values) => {
    if (this.state.phoneNumber && !isPossiblePhoneNumber(this.state.phoneNumber)) {
      return;
    }
    getCaptcha(this, captcha => {
      const organizationIds = this.state.organizationOptions.map(option => option.value);
      if (this.props.match.params.siloName) {
        this.props.handleRegisterWithinSilo(
          this.props.match.params.siloName,
          values.username,
          values.email,
          values.firstPassword,
          values.firstName,
          values.lastName,
          values.organizationName,
          values.organizationUrl,
          this.state.phoneNumber,
          captcha,
          organizationIds,
          values.contactFirstName,
          values.contactLastName,
          values.contactEmail,
          this.props.currentLocale
        );
      } else {
        this.props.handleRegister(
          values.username,
          values.email,
          values.firstPassword,
          values.firstName,
          values.lastName,
          values.organizationName,
          values.organizationUrl,
          this.state.phoneNumber,
          captcha,
          organizationIds,
          values.contactFirstName,
          values.contactLastName,
          values.contactEmail,
          this.props.currentLocale
        );
      }
    });
    event.preventDefault();
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  onOrganizationsChange = organizationOptions => {
    this.setState({
      organizationOptions
    });
  };

  render() {
    const { phoneNumber, captchaError } = this.state;
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h1 id="register-title">
              <Translate contentKey="register.title">Registration</Translate>
            </h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {captchaError ? (
              <Alert color="danger" id="failed-login">
                {captchaError}
              </Alert>
            ) : null}
          </Col>
          <Col md="8">
            <AvForm id="register-form" onValidSubmit={this.handleValidSubmit}>
              <AvField
                name="username"
                autoComplete="username"
                label={translate('global.form.username')}
                placeholder={translate('global.form.username.placeholder')}
                validate={{
                  required: { value: true, errorMessage: translate('register.messages.validate.login.required') },
                  pattern: { value: '^[_.@A-Za-z0-9-]*$', errorMessage: translate('register.messages.validate.login.pattern') },
                  minLength: { value: 1, errorMessage: translate('register.messages.validate.login.minlength') },
                  maxLength: { value: 50, errorMessage: translate('register.messages.validate.login.maxlength') }
                }}
              />
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
              />
              <AvField
                name="firstName"
                label={translate('global.form.firstName')}
                placeholder={translate('global.form.firstName.placeholder')}
              />
              <AvField
                name="lastName"
                label={translate('global.form.lastName')}
                placeholder={translate('global.form.lastName.placeholder')}
              />
              <div className="form-group">
                <Translate contentKey="global.form.organizations" />
                <Label className="sr-only" for="organizationOptions">
                  {translate('global.form.organizations.placeholder')}
                </Label>
                <Select
                  options={this.props.organizationOptions}
                  onChange={this.onOrganizationsChange}
                  defaultValue={[]}
                  isMulti
                  inputId="organizationOptions"
                />
              </div>
              <AvField
                name="organizationName"
                label={translate('global.form.organizationName')}
                placeholder={translate('global.form.organizationName.placeholder')}
                type="text"
                validate={{
                  required: {
                    value: true,
                    errorMessage: translate('register.messages.validate.organizationName.required')
                  }
                }}
              />
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
              />
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
                {this.state.phoneNumber &&
                  !isPossiblePhoneNumber(phoneNumber) && (
                    <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
                  )}
              </AvGroup>
              <Label>
                <Translate contentKey="global.form.contact.label" />
              </Label>
              <div className="d-flex flex-row contact-fields">
                <AvField name="contactFirstName" placeholder={translate('global.form.contactFirstName.placeholder')} className="d-flex" />
                <AvField name="contactLastName" placeholder={translate('global.form.contactLastName.placeholder')} />
                <AvField
                  name="contactEmail"
                  placeholder={translate('global.form.contactEmail.placeholder')}
                  type="email"
                  validate={{
                    minLength: { value: 5, errorMessage: translate('global.messages.validate.email.minlength') },
                    maxLength: { value: 254, errorMessage: translate('global.messages.validate.email.maxlength') }
                  }}
                />
              </div>
              <AvField
                name="firstPassword"
                autoComplete="new-password"
                label={translate('global.form.newpassword')}
                placeholder={translate('global.form.newpassword.placeholder')}
                type="password"
                onChange={this.updatePassword}
                validate={{
                  required: { value: true, errorMessage: translate('global.messages.validate.newpassword.required') },
                  minLength: { value: 4, errorMessage: translate('global.messages.validate.newpassword.minlength') },
                  maxLength: { value: 50, errorMessage: translate('global.messages.validate.newpassword.maxlength') }
                }}
              />
              <PasswordStrengthBar password={this.state.password} />
              <AvField
                name="secondPassword"
                autoComplete="new-password"
                label={translate('global.form.confirmpassword')}
                placeholder={translate('global.form.confirmpassword.placeholder')}
                type="password"
                validate={{
                  required: { value: true, errorMessage: translate('global.messages.validate.confirmpassword.required') },
                  minLength: { value: 4, errorMessage: translate('global.messages.validate.confirmpassword.minlength') },
                  maxLength: { value: 50, errorMessage: translate('global.messages.validate.confirmpassword.maxlength') },
                  match: { value: 'firstPassword', errorMessage: translate('global.messages.error.dontmatch') }
                }}
              />
              <ButtonPill className="button-pill-primary">
                <button id="register-submit" type="submit">
                  <Translate contentKey="register.form.button">Register</Translate>
                </button>
              </ButtonPill>
              <ReCAPTCHA
                ref={this.recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={this.onCaptchaChange}
                onErrored={this.onCaptchaErrored}
                size="invisible"
              />
            </AvForm>
            <p>&nbsp;</p>
            <Alert color="warning">
              <span>
                <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
              </span>
              <a className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
              </a>
              <span>
                <Translate contentKey="global.messages.info.authenticated.suffix">
                  , you can try the default accounts:
                  <br />- Administrator (login="admin" and password="admin")
                  <br />- User (login="user" and password="user").
                </Translate>
              </span>
            </Alert>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ locale, organization }: IRootState) => ({
  currentLocale: locale.currentLocale,
  organizationOptions: organization.options.map(option => ({ value: option.id, label: option.name }))
});

const mapDispatchToProps = { handleRegister, handleRegisterWithinSilo, reset, getProviderOrganizationOptions };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPage);
