import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Modal, ModalHeader, ModalBody, Label, Alert, Row, Col } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Link } from 'react-router-dom';
import ButtonPill from 'app/modules/provider/shared/button-pill';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  ICaptchaComponent,
  ICaptchaState,
  getCaptcha
} from 'app/shared/auth/captcha';
import { RECAPTCHA_SITE_KEY } from 'app/config/constants';
import './login-modal.scss';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: Function;
  handleClose: Function;
}

class LoginModal extends React.Component<ILoginModalProps, ICaptchaState> implements ICaptchaComponent {
  state = {
    captcha: null,
    captchaError: ''
  };
  recaptchaRef = React.createRef();

  handleSubmit = async (event, errors, { username, password, rememberMe }) => {
    const { handleLogin } = this.props;
    getCaptcha(this, captcha => {
      handleLogin(username, password, captcha, rememberMe);
      this.setState({
        captcha: null
      });
      // @ts-ignore
      this.recaptchaRef.current.reset();
    });
  };

  onCaptchaChange = captcha => {
    this.setState({
      captcha
    });
  }

  onCaptchaErrored = captchaError => {
    this.setState({
      captchaError
    });
  }

  render() {
    const { loginError, handleClose } = this.props;
    const { captchaError } = this.state;

    return (
      <>
        <Modal isOpen={this.props.showModal} toggle={handleClose} backdrop="static" id="login-page" autoFocus={false} className="login-modal">
          <AvForm onSubmit={this.handleSubmit}>
            <ModalHeader id="login-title" toggle={handleClose}>
              <Translate contentKey="login.title">Sign in</Translate>
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col md="12">
                  {loginError ? (
                    <Alert color="danger" id="failed-login">
                      <Translate contentKey="login.messages.error.authentication">
                        <strong>Failed to sign in!</strong> Please check your credentials and try again.
                      </Translate>
                    </Alert>
                  ) : null}
                  {captchaError ? (
                    <Alert color="danger" id="failed-login">
                      {captchaError}
                    </Alert>
                  ) : null}
                </Col>
                <Col md="12">
                  <AvField
                    name="username"
                    autoComplete="username"
                    label={translate('global.form.username')}
                    placeholder={translate('global.form.username.placeholder')}
                    required
                    errorMessage="Username cannot be empty!"
                    autoFocus
                  />
                  <AvField
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    label={translate('login.form.password')}
                    placeholder={translate('login.form.password.placeholder')}
                    required
                    errorMessage="Password cannot be empty!"
                  />
                  <AvGroup check inline>
                    <Label className="form-check-label">
                      <AvInput type="checkbox" name="rememberMe" /> <Translate contentKey="login.form.rememberme">Remember me</Translate>
                    </Label>
                  </AvGroup>
                  <Link className="forgot-password auth-label" to="/reset/request">
                    <Translate contentKey="login.password.forgot">Forgot password</Translate>
                  </Link>
                </Col>
              </Row>
              <Alert color="warning mt-3 register-alert">
                <span className="auth-label">
                  <Translate contentKey="global.messages.info.register.noaccount">You don't have an account yet?</Translate>
                </span>{' '}
                <Link className="auth-label register-label" to="/register">
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </Link>
              </Alert>
              <div className="login-footer">
                <ButtonPill className={`button-pill-primary sign-in`}>
                  <button type="submit" id="submit-button">
                    <Translate contentKey="login.form.button">Sign in</Translate>
                  </button>
                </ButtonPill>
              </div>
            </ModalBody>
            {this.props.showModal ? <ReCAPTCHA
              ref={this.recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={this.onCaptchaChange}
              onErrored={this.onCaptchaErrored}
              size="invisible"
              badge="bottomright"
            /> : null}
          </AvForm>
        </Modal>
      </>
    );
  }
}

export default LoginModal;
