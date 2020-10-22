import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './silo.reducer';
import { Translate } from 'react-jhipster';

export interface ISiloDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SiloDetail = (props: ISiloDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { siloEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          Silo [<b>{siloEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{siloEntity.name}</dd>
          <dt>
            <Translate contentKey="serviceNetApp.silo.isPublic" />
          </dt>
          <dd>{siloEntity.public ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="serviceNetApp.silo.isReferralEnabled" />
          </dt>
          <dd>{siloEntity.referralEnabled ? 'true' : 'false'}</dd>
          <dt>
            <span>Registration link</span>
          </dt>
          <dd>{`${window.location.origin}/#/register/${siloEntity.name}`}</dd>
        </dl>
        <Button tag={Link} to="/entity/silo" color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/silo/${siloEntity.id}/edit`} color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ silo }: IRootState) => ({
  siloEntity: silo.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiloDetail);
