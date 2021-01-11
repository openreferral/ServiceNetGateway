import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, getUrlParameter } from 'react-jhipster';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

export interface IPasswordResetFinishProps extends StateProps, DispatchProps, RouteComponentProps<{ key: string }> {}

export interface IPasswordResetFinishState {
  password: string;
  key: string;
}

export class PasswordResetFinishPage extends React.Component<IPasswordResetFinishProps, IPasswordResetFinishState> {
  state: IPasswordResetFinishState = {
    password: '',
    key: getUrlParameter('key', this.props.location.search)
  };

  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handlePasswordResetFinish(this.state.key, values.newPassword);
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.resetPasswordSuccess && this.props.resetPasswordSuccess) {
      this.props.history.push('/login');
    }
  }

  getResetForm() {
    return (
      <AvForm onValidSubmit={this.handleValidSubmit}>
        <AvField
          name="newPassword"
          autoComplete="new-password"
          label={translate('global.form.newpassword')}
          placeholder={translate('global.form.newpassword.placeholder')}
          type="password"
          validate={{
            required: { value: true, errorMessage: translate('global.messages.validate.newpassword.required') },
            minLength: { value: 4, errorMessage: translate('global.messages.validate.newpassword.minlength') },
            maxLength: { value: 50, errorMessage: translate('global.messages.validate.newpassword.maxlength') }
          }}
          onChange={this.updatePassword}
        />
        <PasswordStrengthBar password={this.state.password} />
        <AvField
          name="confirmPassword"
          autoComplete="new-password"
          label={translate('global.form.confirmpassword')}
          placeholder={translate('global.form.confirmpassword.placeholder')}
          type="password"
          validate={{
            required: { value: true, errorMessage: translate('global.messages.validate.confirmpassword.required') },
            minLength: { value: 4, errorMessage: translate('global.messages.validate.confirmpassword.minlength') },
            maxLength: { value: 50, errorMessage: translate('global.messages.validate.confirmpassword.maxlength') },
            match: { value: 'newPassword', errorMessage: translate('global.messages.error.dontmatch') }
          }}
        />
        <Button color="success" type="submit">
          <Translate contentKey="reset.finish.form.button">Validate new password</Translate>
        </Button>
      </AvForm>
    );
  }

  render() {
    const { key } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="4">
            <h1>
              <Translate contentKey="reset.finish.title">Reset password</Translate>
            </h1>
            <div>{key ? this.getResetForm() : null}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  resetPasswordSuccess: state.passwordReset.resetPasswordSuccess
});

const mapDispatchToProps = { handlePasswordResetFinish, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PasswordResetFinishPage));
