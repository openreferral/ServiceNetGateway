import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Alert } from 'reactstrap';
import { Translate, getUrlParameter } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { activateAction, reset } from './activate.reducer';

const successAlert = (
  <Alert color="success">
    <Translate contentKey="verify.messages.success">
      <strong>Thanks for verifying your email. </strong>
      You can login after you receive an email notification from Service Net staff after approval of your account
    </Translate>
    .
  </Alert>
);

const failureAlert = (
  <Alert color="danger">
    <Translate contentKey="verify.messages.error">
      <strong>Your user could not be verified.</strong> Please use the registration form to sign up.
    </Translate>
  </Alert>
);

export interface IVerifyProps extends StateProps, DispatchProps, RouteComponentProps<{ key: any }> {}

export class VerifyPage extends React.Component<IVerifyProps> {
  componentWillUnmount() {
    this.props.reset();
  }

  componentDidMount() {
    const key = getUrlParameter('key', this.props.location.search);
    this.props.activateAction(key);
  }

  render() {
    const { activationSuccess, activationFailure } = this.props;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h1>
              <Translate contentKey="verify.title">Activation</Translate>
            </h1>
            {activationSuccess ? successAlert : undefined}
            {activationFailure ? failureAlert : undefined}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ activate }: IRootState) => ({
  activationSuccess: activate.activationSuccess,
  activationFailure: activate.activationFailure
});

const mapDispatchToProps = { activateAction, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyPage);
