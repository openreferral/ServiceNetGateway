import React from 'react';
import { Translate, translate, getUrlParameter } from 'react-jhipster';
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

export interface IRegisterProps extends StateProps, DispatchProps, RouteComponentProps<{ siloName: any }> {}

export interface IRegisterState {
  password: string;
  phoneNumber: string;
}

export class RegisterPage extends React.Component<IRegisterProps, IRegisterState> {
  state: IRegisterState = {
    password: '',
    phoneNumber: ''
  };

  componentWillUnmount() {
    this.props.reset();
  }

  setPhoneNumber = phoneNumber => {
    this.setState({ phoneNumber });
  };

  handleValidSubmit = (event, values) => {
    if (this.state.phoneNumber && !isPossiblePhoneNumber(this.state.phoneNumber)) {
      return;
    }
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
        this.props.currentLocale
      );
    }
    event.preventDefault();
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { phoneNumber } = this.state;
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
            <AvForm id="register-form" onValidSubmit={this.handleValidSubmit}>
              <AvField
                name="username"
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
              <AvField
                name="firstPassword"
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

const mapStateToProps = ({ locale }: IRootState) => ({
  currentLocale: locale.currentLocale
});

const mapDispatchToProps = { handleRegister, handleRegisterWithinSilo, reset };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPage);
