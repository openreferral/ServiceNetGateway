import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './beneficiary.reducer';
import { IBeneficiary } from 'app/shared/model/ServiceNet/beneficiary.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBeneficiaryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BeneficiaryDetail = (props: IBeneficiaryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { beneficiaryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          Beneficiary [<b>{beneficiaryEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="phoneNumber">Phone Number</span>
          </dt>
          <dd>{beneficiaryEntity.phoneNumber}</dd>
        </dl>
        <Button tag={Link} to="/entity/beneficiary" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/beneficiary/${beneficiaryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ beneficiary }: IRootState) => ({
  beneficiaryEntity: beneficiary.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BeneficiaryDetail);
