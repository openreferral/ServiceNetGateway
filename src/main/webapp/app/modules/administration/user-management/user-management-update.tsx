import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Label, Row, Col } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getEntities as getShelters } from 'app/entities/shelter/shelter.reducer';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { locales, languages } from 'app/config/translation';
import { getUser, getRoles, getSystemAccounts, updateUser, createUser, reset } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { getAllSilos } from 'app/entities/silo/silo.reducer';

export interface IUserManagementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export interface IUserManagementUpdateState {
  isNew: boolean;
  phoneNumber: string;
}

export class UserManagementUpdate extends React.Component<IUserManagementUpdateProps, IUserManagementUpdateState> {
  state: IUserManagementUpdateState = {
    isNew: !this.props.match.params || !this.props.match.params.login,
    phoneNumber: this.props.user.phoneNumber
  };

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getUser(this.props.match.params.login);
    }
    this.props.getRoles();
    this.props.getSystemAccounts();
    this.props.getShelters();
    this.props.getAllSilos();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  saveUser = (event, values) => {
    if (this.state.phoneNumber && !isPossiblePhoneNumber(this.state.phoneNumber)) {
      return;
    }
    const user = { ...values, phoneNumber: this.state.phoneNumber };
    if (this.state.isNew) {
      this.props.createUser(user);
    } else {
      this.props.updateUser(user);
    }
    this.handleClose();
  };

  handleClose = () => {
    this.props.history.push('/admin/user-management');
  };

  setPhoneNumber = phoneNumber => {
    this.setState({ phoneNumber });
  };

  render() {
    const isInvalid = false;
    const { user, loading, updating, roles, systemAccounts, shelters, allSilos } = this.props;
    const { phoneNumber } = this.state;
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h1>
              <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
            </h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm onValidSubmit={this.saveUser}>
                {user.id ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvField type="text" className="form-control" name="id" required readOnly value={user.id} />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label for="login">
                    <Translate contentKey="userManagement.login">Login</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="login"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: translate('register.messages.validate.login.required')
                      },
                      pattern: {
                        value: '^[_.@A-Za-z0-9-]*$',
                        errorMessage: translate('register.messages.validate.login.pattern')
                      },
                      minLength: {
                        value: 1,
                        errorMessage: translate('register.messages.validate.login.minlength')
                      },
                      maxLength: {
                        value: 50,
                        errorMessage: translate('register.messages.validate.login.maxlength')
                      }
                    }}
                    value={user.login}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="firstName">
                    <Translate contentKey="userManagement.firstName">First Name</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="firstName"
                    validate={{
                      maxLength: {
                        value: 50,
                        errorMessage: translate('entity.validation.maxlength', { max: 50 })
                      }
                    }}
                    value={user.firstName}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="lastName">
                    <Translate contentKey="userManagement.lastName">Last Name</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="lastName"
                    validate={{
                      maxLength: {
                        value: 50,
                        errorMessage: translate('entity.validation.maxlength', { max: 50 })
                      }
                    }}
                    value={user.lastName}
                  />
                  <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
                </AvGroup>
                <AvGroup>
                  <AvField
                    name="email"
                    label={translate('global.form.email')}
                    placeholder={translate('global.form.email.placeholder')}
                    type="email"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: translate('global.messages.validate.email.required')
                      },
                      email: {
                        errorMessage: translate('global.messages.validate.email.invalid')
                      },
                      minLength: {
                        value: 5,
                        errorMessage: translate('global.messages.validate.email.minlength')
                      },
                      maxLength: {
                        value: 254,
                        errorMessage: translate('global.messages.validate.email.maxlength')
                      }
                    }}
                    value={user.email}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="organizationName">
                    <Translate contentKey="userManagement.organizationName">Organization Name</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="organizationName"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: translate('register.messages.validate.organizationName.required')
                      }
                    }}
                    value={user.organizationName}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="organizationUrl">
                    <Translate contentKey="userManagement.organizationUrl">Organization URL</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="organizationUrl"
                    validate={{
                      minLength: { value: 5, errorMessage: translate('global.messages.validate.organizationUrl.minlength') },
                      maxLength: { value: 254, errorMessage: translate('global.messages.validate.organizationUrl.maxlength') },
                      pattern: {
                        value: '^((http|https)://)?(www.)?[0-9a-zA-Z\\-]+\\..+$',
                        errorMessage: translate('register.messages.validate.organizationUrl.pattern')
                      }
                    }}
                    value={user.organizationUrl}
                  />
                </AvGroup>
                <AvGroup className="form-group">
                  <Label for="phoneNumber" className={`${phoneNumber && !isPossiblePhoneNumber(phoneNumber) ? 'text-danger' : ''}`}>
                    <Translate contentKey="userManagement.phoneNumber">Phone Number</Translate>
                  </Label>
                  <Input
                    className="form-control"
                    name="phoneNumber"
                    label={translate('userManagement.phoneNumber')}
                    country="US"
                    value={phoneNumber}
                    onChange={this.setPhoneNumber}
                  />
                  {phoneNumber &&
                    !isPossiblePhoneNumber(phoneNumber) && (
                      <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
                    )}
                </AvGroup>
                <AvGroup check>
                  <Label>
                    <AvInput type="checkbox" name="activated" value={user.activated} />{' '}
                    <Translate contentKey="userManagement.activated">Activated</Translate>
                  </Label>
                </AvGroup>
                <AvGroup>
                  <Label for="langKey">
                    <Translate contentKey="userManagement.langKey">Language Key</Translate>
                  </Label>
                  <AvField type="select" className="form-control" name="langKey" value={user.langKey}>
                    {locales.map(locale => (
                      <option value={locale} key={locale}>
                        {languages[locale].name}
                      </option>
                    ))}
                  </AvField>
                </AvGroup>
                <AvGroup>
                  <Label for="authorities">
                    <Translate contentKey="userManagement.profiles">Profiles</Translate>
                  </Label>
                  <AvInput type="select" className="form-control" name="authorities" value={user.authorities} multiple>
                    {roles.map(role => (
                      <option value={role} key={role}>
                        {role}
                      </option>
                    ))}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="systemAccountId">
                    <Translate contentKey="userManagement.systemAccount">System Account</Translate>
                  </Label>
                  <AvInput type="select" className="form-control" name="systemAccountId" value={user.systemAccountId}>
                    <option value="" key="0" />
                    {systemAccounts.map(systemAccount => (
                      <option value={systemAccount.id} key={systemAccount.id}>
                        {systemAccount.name}
                      </option>
                    ))}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="siloId">
                    <Translate contentKey="userManagement.silo">Silo</Translate>
                  </Label>
                  <AvInput type="select" className="form-control" name="siloId" value={user.siloId}>
                    <option value="" key="0" />
                    {allSilos.map(s => (
                      <option value={s.id} key={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </AvInput>
                </AvGroup>
                {user.authorities.includes('ROLE_SACRAMENTO') ? (
                  <AvGroup>
                    <Label for="shelters">
                      <Translate contentKey="userManagement.shelters">Shelters</Translate>
                    </Label>
                    <AvInput type="select" className="form-control" name="shelters" value={user.shelters} multiple>
                      {shelters.map(shelter => (
                        <option value={shelter.id} key={shelter.id}>
                          {shelter.agencyName} {shelter.alternateName}
                        </option>
                      ))}
                    </AvInput>
                  </AvGroup>
                ) : null}
                <Button tag={Link} to="/admin/user-management" replace color="info">
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
  user: storeState.userManagement.user,
  roles: storeState.userManagement.authorities,
  systemAccounts: storeState.userManagement.systemAccounts,
  loading: storeState.userManagement.loading,
  updating: storeState.userManagement.updating,
  shelters: storeState.shelter.entities,
  allSilos: storeState.silo.allSilos
});

const mapDispatchToProps = {
  getUser,
  getRoles,
  getSystemAccounts,
  getShelters,
  updateUser,
  createUser,
  reset,
  getAllSilos
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagementUpdate);
