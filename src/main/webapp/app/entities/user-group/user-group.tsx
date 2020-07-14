import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import {
  ICrudGetAllAction,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount,
  getPaginationItemsNumber,
  Translate
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './user-group.reducer';
import { getAllSilos as getSilos } from '../silo/silo.reducer';
import { IUserGroup } from 'app/shared/model/user-group.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE, MAX_BUTTONS } from 'app/shared/util/pagination.constants';

export interface IUserGroupProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const UserGroup = (props: IUserGroupProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  useEffect(() => {
    props.getSilos();
  }, []);

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    props.history.push(
      `${props.location.pathname}?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`
    );
  };

  useEffect(
    () => {
      sortEntities();
    },
    [paginationState.activePage, paginationState.order, paginationState.sort]
  );

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage
    });

  const getSiloName = id => {
    const { allSilos } = props;
    return _.get(_.find(allSilos, silo => silo.id === id), 'name', '');
  };

  const { userGroupList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="user-group-heading">
        User Groups
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new User Group
        </Link>
      </h2>
      <div className="table-responsive">
        {userGroupList && userGroupList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="serviceNetApp.userGroup.id" />
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="serviceNetApp.userGroup.name" />
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="serviceNetApp.userGroup.silo" />
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {userGroupList.map((userGroup, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${userGroup.id}`} color="link" size="sm">
                      {userGroup.id}
                    </Button>
                  </td>
                  <td>{userGroup.name}</td>
                  <td>{userGroup.siloId ? <Link to={`silo/${userGroup.siloId}`}>{getSiloName(userGroup.siloId)}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${userGroup.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${userGroup.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${
                          paginationState.order
                        }`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${userGroup.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${
                          paginationState.order
                        }`}
                        color="danger"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No User Groups found</div>
        )}
      </div>
      <div className={userGroupList && userGroupList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, ITEMS_PER_PAGE)}
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={MAX_BUTTONS}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userGroup, silo }: IRootState) => ({
  userGroupList: userGroup.entities,
  loading: userGroup.loading,
  totalItems: userGroup.totalItems,
  allSilos: silo.allSilos
});

const mapDispatchToProps = {
  getEntities,
  getSilos
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserGroup);
