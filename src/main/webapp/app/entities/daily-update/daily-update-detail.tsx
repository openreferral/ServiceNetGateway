import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './daily-update.reducer';
import { IDailyUpdate } from 'app/shared/model/ServiceNet/daily-update.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDailyUpdateDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DailyUpdateDetail = (props: IDailyUpdateDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { dailyUpdateEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          DailyUpdate [<b>{dailyUpdateEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="update">Update</span>
          </dt>
          <dd>{dailyUpdateEntity.update}</dd>
          <dt>
            <span id="expiry">Expiry</span>
          </dt>
          <dd>{dailyUpdateEntity.expiry ? <TextFormat value={dailyUpdateEntity.expiry} type="date" format={APP_DATE_FORMAT} /> : '-'}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>
            <TextFormat value={dailyUpdateEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>Organization</dt>
          <dd>{dailyUpdateEntity.organizationName ? dailyUpdateEntity.organizationName : ''}</dd>
        </dl>
        <Button tag={Link} to="/entity/daily-update" color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/daily-update/${dailyUpdateEntity.id}/edit`} color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ dailyUpdate }: IRootState) => ({
  dailyUpdateEntity: dailyUpdate.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyUpdateDetail);
