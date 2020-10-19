import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Table, Row, Col } from 'reactstrap';
import { getPaginationItemsNumber, getSortState, IPaginationBaseState, JhiPagination, TextFormat, translate, Translate } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { APP_DATE_FORMAT, MS_IN_A_DAY, selectStyle } from 'app/config/constants';
import { apiUrl, searchReferrals } from 'app/entities/referral/referral.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageSizeSelector from 'app/entities/page-size-selector';
import { FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, MAX_BUTTONS } from 'app/shared/util/pagination.constants';
import queryString from 'query-string';
import Select from 'react-select';
import ButtonPill from 'app/modules/provider/shared/button-pill';

const WEEK = 'week';
const MONTH = 'month';
const SENT = 'sent';
const FULFILLED = 'fulfilled';

export interface IReferralHistoryTabState extends IPaginationBaseState {
  dropdownOpenBottom: boolean;
  itemsPerPage: number;
  dateRange: any;
  status: any;
}

export interface IReferralHistoryTabProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

class ReferralHistoryTab extends React.Component<IReferralHistoryTabProps, IReferralHistoryTabState> {
  constructor(props) {
    super(props);
    JhiPagination.bind(this);
    PageSizeSelector.bind(this);
    this.state = {
      dropdownOpenBottom: false,
      itemsPerPage: ITEMS_PER_PAGE_ENTITY,
      ...getSortState(this.props.location, ITEMS_PER_PAGE_ENTITY),
      dateRange: null,
      status: null,
      sort: 'sentAt',
      order: 'desc'
    };
  }

  componentDidMount() {
    if (!_.isEqual(this.props.location.search, '')) {
      const fetchPageData = queryString.parse(this.props.location.search);
      this.setCustomState(fetchPageData.page, fetchPageData.itemsPerPage, fetchPageData.sort);
    } else {
      this.searchReferrals();
    }
  }

  componentDidUpdate(prevProps) {
    if (!(this.props.location === prevProps.location) && !(this.props.location.search === '')) {
      const fetchPageData = queryString.parse(this.props.location.search);
      this.setCustomState(fetchPageData.page, fetchPageData.itemsPerPage, fetchPageData.sort);
    }
    if (!(this.props.location === prevProps.location) && this.props.location.search === '') {
      this.setCustomState(FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, this.state.sort);
    }
  }

  toggleBottom = () => {
    this.setState({ dropdownOpenBottom: !this.state.dropdownOpenBottom });
  }

  select = prop => () => {
    this.setState(
      {
        itemsPerPage: prop,
        activePage: FIRST_PAGE
      },
      () => this.searchReferrals()
    );
  };

  handlePagination = activePage => this.setState({ activePage }, () => this.searchReferrals());

  setCustomState(page, items, sort) {
    this.setState({
      activePage: Number(page),
      itemsPerPage: Number(items),
      ...getSortState(this.props.location, items)
    }, this.searchReferrals);
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.searchReferrals()
    );
  };

  handleDateRangeChange = dateRange => {
    this.setState({
      dateRange,
      activePage: FIRST_PAGE
    }, this.searchReferrals);
  };

  handleStatusChange = status => {
    this.setState({
      status,
      activePage: FIRST_PAGE
    }, this.searchReferrals);
  };

  dateRangeOptions = () => [
    { value: '', label: translate('referral.filters.allTime') },
    { value: WEEK, label: translate('referral.filters.pastWeek') },
    { value: MONTH, label: translate('referral.filters.pastMonth') }
  ];

  referralStatusOptions = () => [
    { value: '', label: translate('referral.filters.allStatuses') },
    { value: SENT, label: translate('referral.filters.sent') },
    { value: FULFILLED, label: translate('referral.filters.fulfilled') }
  ];

  searchReferrals() {
    const { order, sort, activePage, itemsPerPage, dateRange, status } = this.state;
    let since = null;
    if (dateRange && dateRange.value === WEEK) {
      since = new Date(new Date().getTime() - (7 * MS_IN_A_DAY)).toISOString();
    } else if (dateRange && dateRange.value === MONTH) {
      since = new Date(new Date().getTime() - (30 * MS_IN_A_DAY)).toISOString();
    }
    this.props.searchReferrals(since, status && status.value, activePage - 1, itemsPerPage, order, sort);
  }

  filters = () =>
    <Row className="filters">
      <Col md={{ size: 6 }} className="mb-1 mb-md-0">
        <Select
          styles={selectStyle()}
          name="dateRange"
          id="dateRange"
          value={this.state.dateRange || this.dateRangeOptions()[0]}
          onChange={this.handleDateRangeChange}
          options={this.dateRangeOptions()}
          inputId="dateRange"
        />
      </Col>
      <Col md={{ size: 6 }}>
        <Select
          styles={selectStyle()}
          name="status"
          id="status"
          value={this.state.status || this.referralStatusOptions()[0]}
          onChange={this.handleStatusChange}
          options={this.referralStatusOptions()}
          inputId="status"
        />
      </Col>
    </Row>;

  render() {
    const { referrals, totalItems } = this.props;

    return (
      <div className="col-12 col-md-10 offset-md-1">
        <div className="content-title my-2 my-md-4 my-lg-5">
          <Translate contentKey="referral.title.referralHistory" />
          <a href={`/${apiUrl}/csv`}>
            <ButtonPill className="ml-2 csv-download d-inline">
              <FontAwesomeIcon icon="download" />{' '}
              <span className="d-inline">
                <Translate contentKey="referral.buttons.csv">CSV</Translate>
              </span>
            </ButtonPill>
          </a>
        </div>
        {this.filters()}
        <div className="table-responsive">
          <Table responsive>
            <thead>
            <tr>
              <th className="hand" onClick={this.sort('beneficiary.phoneNumber')}>
                <Translate contentKey="referral.columns.beneficiaryPhoneNumber" /> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={this.sort('id')}>
                <Translate contentKey="referral.columns.id" /> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={this.sort('sentAt')}>
                <Translate contentKey="referral.columns.dateStamp" /> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={this.sort('from.name')}>
                <Translate contentKey="referral.columns.referredFrom" /> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={this.sort('to.name')}>
                <Translate contentKey="referral.columns.referredTo" /> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={this.sort('fulfilledAt')}>
                <Translate contentKey="referral.columns.status" /> <FontAwesomeIcon icon="sort" />
              </th>
              <th />
            </tr>
            </thead>
            <tbody>
            {referrals.map((referral, i) => (
              <tr key={`entity-${i}`}>
                <td>{referral.beneficiaryPhoneNumber}</td>
                <td>{referral.shortcode ? referral.shortcode : referral.id}</td>
                <td><TextFormat value={referral.sentAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid /></td>
                <td>{referral.fromName}</td>
                <td>{referral.toName}</td>
                <td>{referral.fulfilledAt ? 'Fulfilled' : 'Sent'}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </div>
        <Row className="justify-content-center">
          <PageSizeSelector
            dropdownOpen={this.state.dropdownOpenBottom}
            toggleSelect={this.toggleBottom}
            itemsPerPage={this.state.itemsPerPage}
            selectFunc={this.select}
          />
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, this.state.itemsPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
            maxButtons={MAX_BUTTONS}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ referral }: IRootState) => ({
  referrals: referral.referrals,
  totalItems: referral.totalItems
});

const mapDispatchToProps = {
  searchReferrals
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralHistoryTab);
