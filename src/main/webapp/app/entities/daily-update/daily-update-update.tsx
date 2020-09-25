import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { setFileData, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './daily-update.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import AvSelect from '@availity/reactstrap-validation-select';
import { getProviderRecords, getAllProviderRecords } from 'app/modules/provider/provider-record.reducer';

const MAX_PAGE_SIZE = 2147483647;

export interface IDailyUpdateUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DailyUpdateUpdate = (props: IDailyUpdateUpdateProps) => {
  const [organizationId, setOrganizationId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { dailyUpdateEntity, allRecords, loading, updating } = props;

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

    props.getAllProviderRecords(0, MAX_PAGE_SIZE, 'name', props.defaultFilter, '', true);
    props.getProviderRecords(0, MAX_PAGE_SIZE, '');
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(
    () => {
      if (props.updateSuccess) {
        handleClose();
      }
    },
    [props.updateSuccess]
  );

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
          <h2 id="serviceNetGatewayApp.serviceNetDailyUpdate.home.createOrEditLabel">Create or edit a Daily Update</h2>
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
                  options={
                    allRecords
                      ? allRecords.map(otherEntity => ({ value: otherEntity.organization.id, label: otherEntity.organization.name }))
                      : []
                  }
                >
                  <option value="" key="0" />
                  {allRecords
                    ? allRecords.map(otherEntity => (
                        <option value={otherEntity.organization.id} key={otherEntity.organization.id}>
                          {otherEntity.organization.name}
                        </option>
                      ))
                    : null}
                </AvSelect>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/daily-update" color="info">
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
  allRecords: storeState.providerRecord.allRecords.concat(storeState.providerRecord.records),
  dailyUpdateEntity: storeState.dailyUpdate.entity,
  loading: storeState.dailyUpdate.loading,
  updating: storeState.dailyUpdate.updating,
  updateSuccess: storeState.dailyUpdate.updateSuccess,
  defaultFilter: storeState.providerFilter.defaultFilter
});

const mapDispatchToProps = {
  getAllProviderRecords,
  getProviderRecords,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyUpdateUpdate);
