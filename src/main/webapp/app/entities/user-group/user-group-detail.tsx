import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-group.reducer';
import { IUserGroup } from 'app/shared/model/user-group.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserGroupDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserGroupDetail = (props: IUserGroupDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { userGroupEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          UserGroup [<b>{userGroupEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="serviceNetApp.userGroup.name" />
            </span>
          </dt>
          <dd>{userGroupEntity.name}</dd>
          <dt>
            <Translate contentKey="serviceNetApp.userGroup.silo" />
          </dt>
          <dd>{userGroupEntity.siloId ? userGroupEntity.siloId : ''}</dd>
        </dl>
        <Button tag={Link} to="/user-group" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-group/${userGroupEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ userGroup }: IRootState) => ({
  userGroupEntity: userGroup.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserGroupDetail);
