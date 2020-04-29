import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Label, Row, Col } from 'reactstrap';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getClient, updateClient, createClient, reset } from './client-management.reducer';
import { getSystemAccounts } from 'app/modules/administration/user-management/user-management.reducer';

import { IRootState } from 'app/shared/reducers';

export interface IClientManagementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ clientId: string }> {
  clientProfile: any;
}

export interface IClientManagementUpdateState {
  isNew: boolean;
}

export class ClientManagementUpdate extends React.Component<IClientManagementUpdateProps, IClientManagementUpdateState> {
  state: IClientManagementUpdateState = {
    isNew: !this.props.match.params || !this.props.match.params.clientId
  };

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getClient(this.props.match.params.clientId);
    }
    this.props.getSystemAccounts();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  saveClient = (event, values) => {
    if (this.state.isNew) {
      this.props.createClient(values);
    } else {
      this.props.updateClient(values);
    }
    this.handleClose();
  };

  handleClose = () => {
    this.props.history.push('/admin/client-management');
  };

  render() {
    const isInvalid = false;
    const { client, loading, updating, systemAccounts } = this.props;
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h1>
              <Translate contentKey="clientManagement.home.createOrEditLabel">Create or edit a Client</Translate>
            </h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm onValidSubmit={this.saveClient}>
                <AvGroup>
                  <Label for="clientId">
                    <Translate contentKey="clientManagement.clientId">Client Id</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="clientId"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: translate('register.messages.validate.clientId.required')
                      },
                      pattern: {
                        value: '^[_.@A-Za-z0-9-]*$',
                        errorMessage: translate('register.messages.validate.clientId.pattern')
                      },
                      minLength: {
                        value: 1,
                        errorMessage: translate('register.messages.validate.clientId.minlength')
                      },
                      maxLength: {
                        value: 50,
                        errorMessage: translate('register.messages.validate.clientId.maxlength')
                      }
                    }}
                    value={client.clientId}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="clientSecret">
                    <Translate contentKey="clientManagement.clientSecret">Client Secret</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="clientSecret"
                    validate={{
                      maxLength: {
                        value: 50,
                        errorMessage: translate('entity.validation.maxlength', { max: 50 })
                      }
                    }}
                    value={client.clientSecret}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="systemAccountId">
                    <Translate contentKey="userManagement.systemAccount">System Account</Translate>
                  </Label>
                  <AvInput type="select" className="form-control" name="systemAccountId" value={client.systemAccountId} required>
                    <option value="" key="0" />
                    {systemAccounts.map(systemAccount => (
                      <option value={systemAccount.id} key={systemAccount.id}>
                        {systemAccount.name}
                      </option>
                    ))}
                  </AvInput>
                  <AvFeedback>
                    <Translate contentKey="clientManagement.systemAccountRequired">System Account required</Translate>
                  </AvFeedback>
                </AvGroup>
                <AvGroup>
                  <Label for="tokenValiditySeconds">
                    <Translate contentKey="clientManagement.tokenValiditySeconds">Token validity in seconds</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="tokenValiditySeconds"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: translate('register.messages.validate.tokenValiditySeconds.required')
                      },
                      pattern: {
                        value: '^[0-9]*$',
                        errorMessage: translate('register.messages.validate.tokenValiditySeconds.pattern')
                      }
                    }}
                    value={client.tokenValiditySeconds}
                  />
                </AvGroup>
                <Button tag={Link} to="/admin/client-management" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" type="submit" disabled={isInvalid || updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  client: storeState.clientManagement.client,
  user: storeState.userManagement.user,
  systemAccounts: storeState.userManagement.systemAccounts,
  loading: storeState.clientManagement.loading,
  updating: storeState.clientManagement.updating
});

const mapDispatchToProps = { getClient, updateClient, createClient, reset, getSystemAccounts };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientManagementUpdate);
