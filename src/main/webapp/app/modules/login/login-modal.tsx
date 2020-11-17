import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Alert, Row, Col } from 'reactstrap';
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
        <Modal isOpen={this.props.showModal} toggle={handleClose} backdrop="static" id="login-page" autoFocus={false}>
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
                </Col>
              </Row>
              <div className="mt-1">&nbsp;</div>
              <Alert color="warning">
                <Link className="auth-label" to="/reset/request">
                  <Translate contentKey="login.password.forgot">Did you forget your password?</Translate>
                </Link>
              </Alert>
              <Alert color="warning">
                <span className="auth-label">
                  <Translate contentKey="global.messages.info.register.noaccount">You don't have an account yet?</Translate>
                </span>{' '}
                <Link className="auth-label" to="/register">
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </Link>
              </Alert>
            </ModalBody>
            <ModalFooter>
              <ButtonPill className="button-pill-secondary" onClick={handleClose}>
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </ButtonPill>{' '}
              <ButtonPill className={`button-pill-primary`}>
                <button type="submit" id="submit-button">
                  <Translate contentKey="login.form.button">Sign in</Translate>
                </button>
              </ButtonPill>
            </ModalFooter>
          </AvForm>
        </Modal>
        <ReCAPTCHA
          ref={this.recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={this.onCaptchaChange}
          onErrored={this.onCaptchaErrored}
          size="invisible"
          badge="bottomright"
        />
      </>
    );
  }
}

export default LoginModal;
