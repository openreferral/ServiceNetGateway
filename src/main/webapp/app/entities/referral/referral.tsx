import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './referral.reducer';
import { IReferral } from 'app/shared/model/ServiceNet/referral.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_ENTITY } from 'app/shared/util/pagination.constants';
import { getSortStateWithPagination } from 'app/shared/util/pagination-utils';

export interface IReferralProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Referral = (props: IReferralProps) => {
  const [paginationState, setPaginationState] = useState(getSortStateWithPagination(props.location, ITEMS_PER_PAGE_ENTITY));
  const [sorting, setSorting] = useState(false);

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const resetAll = () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1
    });
    props.getEntities();
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      resetAll();
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage]);

  const handleLoadMore = () => {
    if ((window as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1
      });
    }
  };

  useEffect(() => {
    if (sorting) {
      getAllEntities();
      setSorting(false);
    }
  }, [sorting]);

  const sort = p => () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
    setSorting(true);
  };

  const { referralList, match, loading } = props;
  return (
    <div>
      <h2 id="referral-heading">
        Referrals
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Referral
        </Link>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          pageStart={paginationState.activePage}
          loadMore={handleLoadMore}
          hasMore={paginationState.activePage - 1 < props.links.next}
          loader={<div className="loader">Loading ...</div>}
          threshold={0}
          initialLoad={false}
        >
          {referralList && referralList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('id')}>
                    ID <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('shortcode')}>
                    Shortcode <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('sentAt')}>
                    Sent At <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('fulfilledAt')}>
                    Fulfilled At <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    From <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    To <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    Beneficiary <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {referralList.map((referral, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${referral.id}`} color="link" size="sm">
                        {referral.id}
                      </Button>
                    </td>
                    <td>{referral.shortcode}</td>
                    <td>{referral.sentAt ? <TextFormat type="date" value={referral.sentAt} format={APP_DATE_FORMAT} /> : null}</td>
                    <td>
                      {referral.fulfilledAt ? <TextFormat type="date" value={referral.fulfilledAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td>{referral.fromName ? <Link to={`organization/${referral.fromId}`}>{referral.fromName}</Link> : ''}</td>
                    <td>{referral.toName ? <Link to={`organization/${referral.toId}`}>{referral.toName}</Link> : ''}</td>
                    <td>
                      {referral.beneficiaryId ? <Link to={`beneficiary/${referral.beneficiaryId}`}>{referral.beneficiaryId}</Link> : ''}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${referral.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${referral.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${referral.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            !loading && <div className="alert alert-warning">No Referrals found</div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

const mapStateToProps = ({ referral }: IRootState) => ({
  referralList: referral.entities,
  loading: referral.loading,
  totalItems: referral.totalItems,
  links: referral.links,
  entity: referral.entity,
  updateSuccess: referral.updateSuccess
});

const mapDispatchToProps = {
  getEntities,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Referral);
