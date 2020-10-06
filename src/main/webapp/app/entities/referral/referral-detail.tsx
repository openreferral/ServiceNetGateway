import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './referral.reducer';
import { IReferral } from 'app/shared/model/ServiceNet/referral.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IReferralDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReferralDetail = (props: IReferralDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { referralEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          Referral [<b>{referralEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="shortcode">Shortcode</span>
          </dt>
          <dd>{referralEntity.shortcode}</dd>
          <dt>
            <span id="sentAt">Sent At</span>
          </dt>
          <dd>{referralEntity.sentAt ? <TextFormat value={referralEntity.sentAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="fulfilledAt">Fulfilled At</span>
          </dt>
          <dd>
            {referralEntity.fulfilledAt ? <TextFormat value={referralEntity.fulfilledAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>From</dt>
          <dd>{referralEntity.fromName ? referralEntity.fromName : ''}</dd>
          <dt>To</dt>
          <dd>{referralEntity.toName ? referralEntity.toName : ''}</dd>
          <dt>Beneficiary</dt>
          <dd>{referralEntity.beneficiaryId ? referralEntity.beneficiaryId : ''}</dd>
        </dl>
        <Button tag={Link} to="/entity/referral" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/referral/${referralEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ referral }: IRootState) => ({
  referralEntity: referral.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReferralDetail);
