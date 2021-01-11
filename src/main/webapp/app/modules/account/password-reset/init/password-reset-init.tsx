import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Alert, Col, Row } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { handlePasswordResetInit, reset } from '../password-reset.reducer';

export interface IPasswordResetInitProps extends StateProps, DispatchProps {}

export class PasswordResetInit extends React.Component<IPasswordResetInitProps> {
  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handlePasswordResetInit(values.email, window.location.origin);
    event.preventDefault();
  };

  getAlert = () => {
    const { resetPasswordSuccess, resetPasswordFailure } = this.props;
    let message = 'reset.request.messages.info';
    let messageColor = 'warning';
    if (resetPasswordSuccess || resetPasswordFailure) {
      messageColor = resetPasswordSuccess ? 'success' : 'danger';
      message = resetPasswordSuccess ? 'reset.request.messages.success' : 'reset.request.messages.notfound';
    }
    return (
      <Alert color={messageColor}>
        <Translate contentKey={message} />
      </Alert>
    );
  };

  render() {
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h1>
              <Translate contentKey="reset.request.title">Reset your password</Translate>
            </h1>
            <this.getAlert />
            <AvForm onValidSubmit={this.handleValidSubmit}>
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
              <Button color="primary" type="submit">
                <Translate contentKey="reset.request.form.button">Reset password</Translate>
              </Button>
            </AvForm>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  resetPasswordSuccess: state.passwordReset.resetPasswordSuccess,
  resetPasswordFailure: state.passwordReset.resetPasswordFailure
});

const mapDispatchToProps = { handlePasswordResetInit, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetInit);
