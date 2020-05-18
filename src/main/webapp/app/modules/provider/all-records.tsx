import React from 'react';
import { getAllProviderRecords } from './provider-record.reducer';
import { connect } from 'react-redux';
import { Col, Row, Progress } from 'reactstrap';
import _ from 'lodash';
import RecordCard from 'app/modules/provider/record/record-card';
import { IPaginationBaseState, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SortSection from 'app/modules/provider/sort-section';
import { getSearchPreferences, PROVIDER_SORT_ARRAY, setProviderSort } from 'app/shared/util/search-utils';
import ReactGA from 'react-ga';

export interface IAllRecordsProps extends StateProps, DispatchProps {}

export interface IAllRecordsState extends IPaginationBaseState {
  itemsPerPage: number;
  activePage: number;
  sortingOpened: boolean;
}

export class AllRecords extends React.Component<IAllRecordsProps, IAllRecordsState> {
  constructor(props) {
    super(props);
    const { providerSearchPreferences } = getSearchPreferences(this.props.account.login);
    this.state = {
      itemsPerPage: 6,
      activePage: 0,
      sortingOpened: false,
      ...providerSearchPreferences
    };
  }

  componentDidMount() {
    const { itemsPerPage, sort, order } = this.state;
    this.props.getAllProviderRecords(0, itemsPerPage, `${sort},${order}`, true);
  }

  getAllRecords = () => {
    const { itemsPerPage, activePage, sort, order } = this.state;
    this.props.getAllProviderRecords(activePage, itemsPerPage, `${sort},${order}`, false);
  };

  handleLoadMore = hasReachedMaxItems => {
    if (!hasReachedMaxItems) {
      this.setState({ activePage: this.state.activePage + 1 }, () => this.getAllRecords());
    }
  };

  toggleSorting = () => {
    this.setState({ sortingOpened: !this.state.sortingOpened });
  };

  sort = (sort, order) => {
    setProviderSort(this.props.account.login, sort, order);

    ReactGA.event({ category: 'UserActions', action: 'Sorting Records' });

    this.setState({ sort, order, activePage: 0 }, () => {
      this.props.getAllProviderRecords(0, this.state.itemsPerPage, `${sort},${order}`, true);
    });
  };

  render() {
    const { allRecords, allRecordsTotal } = this.props;
    const { sortingOpened } = this.state;
    const hasReachedMaxItems = allRecords.length === parseInt(allRecordsTotal, 10);
    return (
      <div>
        <div className="control-line-container">
          <div className="d-flex justify-content-between">
            <b className="align-self-center">
              <Translate contentKey="providerSite.allRecords" />
            </b>
            <div className="d-flex">
              <div className="align-self-center ml-4">{allRecords && allRecords.length}</div>
              <div className="mx-2 align-self-center">
                <Progress value={((allRecords && allRecords.length) / allRecordsTotal) * 100} />
              </div>
              <div className="align-self-center">{allRecordsTotal}</div>
            </div>
          </div>
          <div className="sort-container">
            <SortSection
              dropdownOpen={sortingOpened}
              toggleSort={() => this.toggleSorting()}
              values={PROVIDER_SORT_ARRAY}
              sort={this.state.sort}
              order={this.state.order}
              sortFunc={this.sort}
            />
            <div className="pill">
              <span>
                <FontAwesomeIcon icon="th" />
                {' | '}
                <FontAwesomeIcon icon="bars" />
              </span>
            </div>
            <div className="pill">
              <Translate contentKey="providerSite.filter" />
            </div>
          </div>
        </div>
        <Row noGutters>
          {_.map(allRecords, record => (
            <Col md={4}>
              <div className="mb-4">
                <RecordCard key={record.organization.id} record={record} link={`single-record-view/${record.organization.id}`} />
              </div>
            </Col>
          ))}
          <Col />
        </Row>
        <div className="pill mb-4 text-center">
          <div
            className={`d-inline button-pill ${hasReachedMaxItems ? 'disabled' : ''}`}
            onClick={() => this.handleLoadMore(hasReachedMaxItems)}
          >
            <Translate contentKey="providerSite.loadMore" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allRecords: state.providerRecord.allRecords,
  allRecordsTotal: state.providerRecord.allRecordsTotal,
  account: state.authentication.account
});

const mapDispatchToProps = {
  getAllProviderRecords
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRecords);
