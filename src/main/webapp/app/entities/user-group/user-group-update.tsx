import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getSilos } from 'app/entities/silo/silo.reducer';
import { getEntity, updateEntity, createEntity, reset } from './user-group.reducer';
import { Translate } from 'react-jhipster';

export interface IUserGroupUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserGroupUpdate = (props: IUserGroupUpdateProps) => {
  const [siloId, setSiloId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { userGroupEntity, silos, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/user-group' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getSilos();
  }, []);

  useEffect(
    () => {
      if (props.updateSuccess) {
        handleClose();
      }
    },
    [props.updateSuccess]
  );

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...userGroupEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="serviceNetGatewayApp.serviceNetUserGroup.home.createOrEditLabel">Create or edit a UserGroup</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : userGroupEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="user-group-id">
                    <Translate contentKey="serviceNetApp.userGroup.id" />
                  </Label>
                  <AvInput id="user-group-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="user-group-name">
                  <Translate contentKey="serviceNetApp.userGroup.name" />
                </Label>
                <AvField id="user-group-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label for="user-group-silo">
                  <Translate contentKey="serviceNetApp.userGroup.silo" />
                </Label>
                <AvInput id="user-group-silo" type="select" className="form-control" name="siloId">
                  <option value="" key="0" />
                  {silos
                    ? silos.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.name}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/user-group" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  silos: storeState.silo.entities,
  userGroupEntity: storeState.userGroup.entity,
  loading: storeState.userGroup.loading,
  updating: storeState.userGroup.updating,
  updateSuccess: storeState.userGroup.updateSuccess
});

const mapDispatchToProps = {
  getSilos,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserGroupUpdate);
