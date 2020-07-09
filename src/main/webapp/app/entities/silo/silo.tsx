import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { getSortState, JhiPagination, getPaginationItemsNumber, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './silo.reducer';
import { ITEMS_PER_PAGE, MAX_BUTTONS } from 'app/shared/util/pagination.constants';

export interface ISiloProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Silo = (props: ISiloProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

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

  const { siloList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="silo-heading">
        Silos
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Silo
        </Link>
      </h2>
      <div className={siloList && siloList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, ITEMS_PER_PAGE)}
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={MAX_BUTTONS}
          />
        </Row>
      </div>
      <div className="table-responsive">
        {siloList && siloList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="serviceNetApp.silo.id" /> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="serviceNetApp.silo.name" /> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('isPublic')}>
                  <Translate contentKey="serviceNetApp.silo.isPublic" /> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {siloList.map((silo, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${silo.id}`} color="link" size="sm">
                      {silo.id}
                    </Button>
                  </td>
                  <td>{silo.name}</td>
                  <td>{silo.public ? 'true' : 'false'}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${silo.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${silo.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${
                          paginationState.order
                        }`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${silo.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${
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
          !loading && <div className="alert alert-warning">No Silos found</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ silo }: IRootState) => ({
  siloList: silo.entities,
  loading: silo.loading,
  totalItems: silo.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Silo);
