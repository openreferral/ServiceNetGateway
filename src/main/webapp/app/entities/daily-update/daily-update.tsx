import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { TextFormat, JhiPagination, getPaginationItemsNumber } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './daily-update.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, MAX_BUTTONS } from 'app/shared/util/pagination.constants';
import PageSizeSelector from 'app/entities/page-size-selector';
import { getSortStateWithPagination } from 'app/shared/util/pagination-utils';

export interface IDailyUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const DailyUpdate = (props: IDailyUpdateProps) => {
  const [dropdownOpenTop, setDropdownOpenTop] = useState(false);
  const [dropdownOpenBottom, setDropdownOpenBottom] = useState(false);
  const [paginationState, setPaginationState] = useState(getSortStateWithPagination(props.location, ITEMS_PER_PAGE_ENTITY));

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    props.history.push(
      `${props.location.pathname}?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}&itemsPerPage=${
        paginationState.itemsPerPage
      }`
    );
  };

  useEffect(
    () => {
      sortEntities();
    },
    [paginationState.activePage, paginationState.order, paginationState.sort, paginationState.itemsPerPage]
  );

  useEffect(
    () => {
      setPaginationState(getSortStateWithPagination(props.location, ITEMS_PER_PAGE_ENTITY));
    },
    [props.location]
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

  const select = itemsPerPage => () =>
    setPaginationState({
      ...paginationState,
      activePage: FIRST_PAGE,
      itemsPerPage
    });

  const { dailyUpdateList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="daily-update-heading">
        Daily Updates
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Daily Update
        </Link>
      </h2>
      <div className={dailyUpdateList && dailyUpdateList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <PageSizeSelector
            dropdownOpen={dropdownOpenTop}
            toggleSelect={() => setDropdownOpenTop(!dropdownOpenTop)}
            itemsPerPage={paginationState.itemsPerPage}
            selectFunc={select}
          />
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, paginationState.itemsPerPage)}
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={MAX_BUTTONS}
          />
        </Row>
      </div>
      <div className="table-responsive">
        {dailyUpdateList && dailyUpdateList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('update')}>
                  Update <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('expiry')}>
                  Expiry <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  Created At <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('organization.name')}>
                  Organization <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dailyUpdateList.map((dailyUpdate, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${dailyUpdate.id}`} color="link" size="sm">
                      {dailyUpdate.id}
                    </Button>
                  </td>
                  <td>{dailyUpdate.update}</td>
                  <td>{dailyUpdate.expiry ? <TextFormat value={dailyUpdate.expiry} type="date" format={APP_DATE_FORMAT} /> : '-'}</td>
                  <td>
                    <TextFormat type="date" value={dailyUpdate.createdAt} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    {dailyUpdate.organizationName ? (
                      <Link to={`organization/${dailyUpdate.organizationId}`}>{dailyUpdate.organizationName}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${dailyUpdate.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${dailyUpdate.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${
                          paginationState.order
                        }`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${dailyUpdate.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${
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
          !loading && <div className="alert alert-warning">No Daily Updates found</div>
        )}
      </div>
      <div className={dailyUpdateList && dailyUpdateList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <PageSizeSelector
            dropdownOpen={dropdownOpenBottom}
            toggleSelect={() => setDropdownOpenBottom(!dropdownOpenBottom)}
            itemsPerPage={paginationState.itemsPerPage}
            selectFunc={select}
          />
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, paginationState.itemsPerPage)}
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ dailyUpdate }: IRootState) => ({
  dailyUpdateList: dailyUpdate.entities,
  loading: dailyUpdate.loading,
  totalItems: dailyUpdate.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyUpdate);
