import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './silo.reducer';
import { Translate } from 'react-jhipster';

export interface ISiloUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SiloUpdate = (props: ISiloUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { siloEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/silo' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
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
        ...siloEntity,
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
          <h2 id="serviceNetGatewayApp.serviceNetSilo.home.createOrEditLabel">Create or edit a Silo</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : siloEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="silo-id">ID</Label>
                  <AvInput id="silo-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="silo-name">
                  Name
                </Label>
                <AvField id="silo-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="activeLabel" check>
                  <AvInput id="silo-public" type="checkbox" className="form-control" name="public" />
                  <Translate contentKey="serviceNetApp.silo.isPublic">Public</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/silo" replace color="info">
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
  siloEntity: storeState.silo.entity,
  loading: storeState.silo.loading,
  updating: storeState.silo.updating,
  updateSuccess: storeState.silo.updateSuccess
});

const mapDispatchToProps = {
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
)(SiloUpdate);
