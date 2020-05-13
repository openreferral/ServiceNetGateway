import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IOrganization } from 'app/shared/model/organization.model';
import { getEntities as getOrganizations } from 'app/entities/organization/organization.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './daily-update.reducer';
import { IDailyUpdate } from 'app/shared/model/ServiceNet/daily-update.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import AvSelect from '@availity/reactstrap-validation-select';

export interface IDailyUpdateUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DailyUpdateUpdate = (props: IDailyUpdateUpdateProps) => {
  const [organizationId, setOrganizationId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { dailyUpdateEntity, organizations, loading, updating } = props;

  const { update } = dailyUpdateEntity;

  const handleClose = () => {
    props.history.push('/entity/daily-update' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getOrganizations();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.expiry = convertDateTimeToServer(values.expiry);
    if (isNew) {
      values.createdAt = new Date();
    }
    if (errors.length === 0) {
      const entity = {
        ...dailyUpdateEntity,
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
          <h2 id="serviceNetGatewayApp.serviceNetDailyUpdate.home.createOrEditLabel">Create or edit a DailyUpdate</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : dailyUpdateEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="daily-update-id">ID</Label>
                  <AvInput id="daily-update-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="updateLabel" for="daily-update-update">
                  Update
                </Label>
                <AvInput
                  id="daily-update-update"
                  type="textarea"
                  name="update"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="expiryLabel" for="daily-update-expiry">
                  Expiry
                </Label>
                <AvInput
                  id="daily-update-expiry"
                  type="datetime-local"
                  className="form-control"
                  name="expiry"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? null : convertDateTimeFromServer(props.dailyUpdateEntity.expiry)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="daily-update-organization">Organization</Label>
                <AvSelect
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                  name="organizationId"
                  options={organizations
                    ? organizations.map(otherEntity => (
                      { value: otherEntity.id, label: otherEntity.name }
                    ))
                    : []}
                >
                  <option value="" key="0" />
                  {organizations
                    ? organizations.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvSelect>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/daily-update" replace color="info">
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
  organizations: storeState.organization.entities,
  dailyUpdateEntity: storeState.dailyUpdate.entity,
  loading: storeState.dailyUpdate.loading,
  updating: storeState.dailyUpdate.updating,
  updateSuccess: storeState.dailyUpdate.updateSuccess
});

const mapDispatchToProps = {
  getOrganizations,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DailyUpdateUpdate);
