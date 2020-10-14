import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IOrganization } from 'app/shared/model/organization.model';
import { getEntities as getOrganizations, getOrganizationOptions } from 'app/entities/organization/organization.reducer';
import { IBeneficiary } from 'app/shared/model/ServiceNet/beneficiary.model';
import { getEntities as getBeneficiaries } from 'app/entities/beneficiary/beneficiary.reducer';
import { getEntity, updateEntity, createEntity, reset } from './referral.reducer';
import { IReferral } from 'app/shared/model/ServiceNet/referral.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IReferralUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReferralUpdate = (props: IReferralUpdateProps) => {
  const [fromId, setFromId] = useState('0');
  const [toId, setToId] = useState('0');
  const [beneficiaryId, setBeneficiaryId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { referralEntity, organizations, beneficiaries, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/referral');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getOrganizationOptions();
    props.getBeneficiaries();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.sentAt = convertDateTimeToServer(values.sentAt);
    values.fulfilledAt = convertDateTimeToServer(values.fulfilledAt);

    if (errors.length === 0) {
      const entity = {
        ...referralEntity,
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
          <h2 id="serviceNetGatewayApp.referral.home.createOrEditLabel">Create or edit a Referral</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : referralEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="referral-id">ID</Label>
                  <AvInput id="referral-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="shortcodeLabel" for="referral-shortcode">
                  Shortcode
                </Label>
                <AvField id="referral-shortcode" type="text" name="shortcode" />
              </AvGroup>
              <AvGroup>
                <Label id="sentAtLabel" for="referral-sentAt">
                  Sent At
                </Label>
                <AvInput
                  id="referral-sentAt"
                  type="datetime-local"
                  className="form-control"
                  name="sentAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.referralEntity.sentAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fulfilledAtLabel" for="referral-fulfilledAt">
                  Fulfilled At
                </Label>
                <AvInput
                  id="referral-fulfilledAt"
                  type="datetime-local"
                  className="form-control"
                  name="fulfilledAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.referralEntity.fulfilledAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="referral-from">From</Label>
                <AvInput id="referral-from" type="select" className="form-control" name="fromId">
                  <option value="" key="0" />
                  {organizations
                    ? organizations.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="referral-to">To</Label>
                <AvInput id="referral-to" type="select" className="form-control" name="toId">
                  <option value="" key="0" />
                  {organizations
                    ? organizations.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="referral-beneficiary">Beneficiary</Label>
                <AvInput id="referral-beneficiary" type="select" className="form-control" name="beneficiaryId">
                  <option value="" key="0" />
                  {beneficiaries
                    ? beneficiaries.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id} {otherEntity.phoneNumber ? `(${otherEntity.phoneNumber})` : ''}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/referral" replace color="info">
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
  organizations: storeState.organization.options,
  beneficiaries: storeState.beneficiary.entities,
  referralEntity: storeState.referral.entity,
  loading: storeState.referral.loading,
  updating: storeState.referral.updating,
  updateSuccess: storeState.referral.updateSuccess
});

const mapDispatchToProps = {
  getOrganizationOptions,
  getBeneficiaries,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReferralUpdate);
