import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { searchOrganizations as getOrganizations, getOrganization, searchUsers, updateOrganization } from './users-organizations.reducer';
// tslint:disable-next-line:no-unused-variable
import { SYSTEM_ACCOUNTS } from 'app/config/constants';

export interface IUsersOrganizationUpdate extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class UsersOrganizationsUpdate extends React.Component<IUsersOrganizationUpdate> {
  constructor(props) {
    super(props);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);

    this.props.searchUsers(SYSTEM_ACCOUNTS.SERVICE_PROVIDER);
  }

  saveEntity = (event, errors, values) => {
    values.updatedAt = new Date(values.updatedAt);

    if (errors.length === 0) {
      const { organizationEntity } = this.props;
      const entity = {
        ...organizationEntity,
        ...values
      };
      this.props.updateUserOwnedEntity(entity);
    }
  };

  handleClose = () => {
    this.props.history.goBack();
  };

  render() {
    const { organizationEntity, loading, updating, loadingUsers, users } = this.props;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="serviceNetApp.organization.updateOwner">
              <Translate contentKey="serviceNetApp.organization.updateOwner">Update Organization's owner</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading || loadingUsers ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={organizationEntity} onSubmit={this.saveEntity}>
                <AvGroup>
                  <Label for="id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="organization-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="serviceNetApp.organization.name">Name</Translate>
                  </Label>
                  <AvField
                    id="organization-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                    readOnly
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="owner.login">
                    <Translate contentKey="serviceNetApp.organization.owner">Owner</Translate>
                  </Label>
                  <AvInput id="organization-owner" type="select" className="form-control" name="userProfiles[0].login">
                    {users
                      ? users.map(otherEntity => (
                          <option value={otherEntity.login} key={otherEntity.login}>
                            {otherEntity.login}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" onClick={() => this.props.history.goBack()} color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
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
  organizationEntity: storeState.usersOrganizations.entity,
  loading: storeState.usersOrganizations.loading,
  updating: storeState.usersOrganizations.updating,
  updateSuccess: storeState.usersOrganizations.updateSuccess,
  users: storeState.usersOrganizations.users,
  loadingUsers: storeState.usersOrganizations.loadingUsers
});

const mapDispatchToProps = {
  getOrganizations,
  getEntity: getOrganization,
  searchUsers,
  updateUserOwnedEntity: updateOrganization
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersOrganizationsUpdate);
