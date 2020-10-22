import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Table, Row, Col } from 'reactstrap';
import { getPaginationItemsNumber, IPaginationBaseState, JhiPagination, translate, Translate } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { selectStyle } from 'app/config/constants';
import { madeToApiUrl, madeFromApiUrl, searchReferralsMadeTo, searchReferralsMadeFrom } from 'app/entities/referral/referral.reducer';
import { getMadeToOptions } from '../../provider-record.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageSizeSelector from 'app/entities/page-size-selector';
import { FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, MAX_BUTTONS } from 'app/shared/util/pagination.constants';
import Select from 'react-select';
import ButtonPill from 'app/modules/provider/shared/button-pill';

const SENT = 'sent';
const FULFILLED = 'fulfilled';
const TABLE_TO = 'sentToTable';
const TABLE_FROM = 'sentFromTable';

export interface IPaginationState extends IPaginationBaseState {
  itemsPerPage: number;
}

export interface INumberOfReferralsTabState {
  madeToOrg: any;
  status: any;
  sentToTable: IPaginationState;
  sentFromTable: IPaginationState;
  dropdownSentToOpenBottom: boolean;
  dropdownSentFromOpenBottom: boolean;
}

export interface INumberOfReferralsTabProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

class NumberOfReferralsTab extends React.Component<INumberOfReferralsTabProps, INumberOfReferralsTabState> {
  constructor(props) {
    super(props);
    JhiPagination.bind(this);
    PageSizeSelector.bind(this);
    this.state = {
      madeToOrg: null,
      status: null,
      dropdownSentToOpenBottom: false,
      dropdownSentFromOpenBottom: false,
      sentToTable: {
        itemsPerPage: ITEMS_PER_PAGE_ENTITY,
        sort: 'toOrg.name',
        order: 'asc',
        activePage: FIRST_PAGE
      },
      sentFromTable: {
        itemsPerPage: ITEMS_PER_PAGE_ENTITY,
        sort: 'fromOrg.name',
        order: 'asc',
        activePage: FIRST_PAGE
      }
    };
  }

  componentDidMount() {
    this.props.getMadeToOptions();
    this.getTableData('');
  }

  toggleSentToBottom = () => {
    this.setState({ dropdownSentToOpenBottom: !this.state.dropdownSentToOpenBottom });
  };

  toggleSentFromBottom = () => {
    this.setState({ dropdownSentFromOpenBottom: !this.state.dropdownSentFromOpenBottom });
  };

  select = (table, prop) => () => {
    const newState = {
      ...this.state,
      [table]: {
        ...this.state[table],
        itemsPerPage: prop,
        activePage: FIRST_PAGE
      }
    };
    this.setState(newState, () => this.getTableData(table));
  };

  getTableData = table => {
    switch (table) {
      case TABLE_TO:
        this.searchReferralsMadeTo();
        break;
      case TABLE_FROM:
        this.searchReferralsMadeFrom();
        break;
      default:
        this.searchReferralsMadeTo();
        this.searchReferralsMadeFrom();
        break;
    }
  };

  handlePagination = (table, prop) => {
    this.setState(
      {
        ...this.state,
        [table]: {
          ...this.state[table],
          activePage: prop
        }
      },
      () => this.getTableData(table)
    );
  };

  sort = (table, prop) => () => {
    this.setState(
      {
        ...this.state,
        [table]: {
          ...this.state[table],
          order: this.state[table].order === 'asc' ? 'desc' : 'asc',
          sort: prop
        }
      },
      () => this.getTableData(table)
    );
  };

  handleOrgFilterChange = madeToOrg => {
    this.setState(
      {
        ...this.state,
        madeToOrg,
        [TABLE_TO]: {
          ...this.state[TABLE_TO],
          activePage: FIRST_PAGE
        }
      },
      () => this.getTableData(TABLE_TO)
    );
  };

  handleStatusChange = status => {
    this.setState(
      {
        ...this.state,
        status,
        [TABLE_FROM]: {
          ...this.state[TABLE_FROM],
          activePage: FIRST_PAGE
        }
      },
      () => this.getTableData(TABLE_FROM)
    );
  };

  organizationOptions = () => _.concat([{ value: '', label: translate('referral.filters.allReferrals') }], this.props.orgOptions);

  referralStatusOptions = () => [
    { value: '', label: translate('referral.filters.allStatuses') },
    { value: SENT, label: translate('referral.filters.waiting') },
    { value: FULFILLED, label: translate('referral.filters.arrived') }
  ];

  searchReferralsMadeTo() {
    const { madeToOrg } = this.state;
    const { order, sort, activePage, itemsPerPage } = this.state.sentToTable;

    this.props.searchReferralsMadeTo(madeToOrg && madeToOrg.value, activePage - 1, itemsPerPage, order, sort);
  }

  searchReferralsMadeFrom() {
    const { status } = this.state;
    const { order, sort, activePage, itemsPerPage } = this.state.sentFromTable;

    this.props.searchReferralsMadeFrom(status && status.value, activePage - 1, itemsPerPage, order, sort);
  }

  orgFilter = () => (
    <Row className="filters">
      <Col className="d-flex">
        <Select
          styles={selectStyle()}
          name="madeToOrg"
          id="madeToOrg"
          value={this.state.madeToOrg || this.organizationOptions()[0]}
          onChange={this.handleOrgFilterChange}
          options={this.organizationOptions()}
          inputId="madeToOrg"
          className="w-100"
        />
        <a href={`/${madeToApiUrl}/csv`} className="d-flex align-items-center">
          <ButtonPill className="ml-2 csv-download d-inline">
            <FontAwesomeIcon icon="download" />{' '}
            <span className="d-inline">
              <Translate contentKey="referral.buttons.csv">CSV</Translate>
            </span>
          </ButtonPill>
        </a>
      </Col>
    </Row>
  );

  statusFilter = () => (
    <Row className="filters">
      <Col className="d-flex">
        <Select
          styles={selectStyle()}
          name="status"
          id="status"
          value={this.state.status || this.referralStatusOptions()[0]}
          onChange={this.handleStatusChange}
          options={this.referralStatusOptions()}
          inputId="status"
          className="w-100"
        />
        <a href={`/${madeFromApiUrl}/csv`} className="d-flex align-items-center">
          <ButtonPill className="ml-2 csv-download d-inline">
            <FontAwesomeIcon icon="download" />{' '}
            <span className="d-inline">
              <Translate contentKey="referral.buttons.csv">CSV</Translate>
            </span>
          </ButtonPill>
        </a>
      </Col>
    </Row>
  );

  render() {
    const { referralsMadeTo, referralsMadeToItems, referralsMadeFrom, referralsMadeFromItems } = this.props;
    const { sentToTable, sentFromTable, dropdownSentToOpenBottom, dropdownSentFromOpenBottom } = this.state;
    return (
      <div className="col-12 col-md-10 offset-md-1 h-100 content-container">
        <div className="content-title my-2 my-md-4 my-lg-5">
          <Translate contentKey="referral.title.numberOfReferrals" />
        </div>
        <Row className="w-100 m-0">
          <Col xs="12" md="6" className="p-0 pr-md-2">
            {this.orgFilter()}
            <div className="table-responsive">
              <Table responsive>
                <thead>
                  <tr>
                    <th className="hand" onClick={this.sort(TABLE_TO, 'toOrg.name')}>
                      <Translate contentKey="referral.columns.madeTo" />
                      &nbsp;
                      <FontAwesomeIcon icon="sort" />
                    </th>
                    <th>
                      <Translate contentKey="referral.columns.numberMade" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referralsMadeTo.map((referral, i) => (
                    <tr key={`made-from-${i}`}>
                      <td>{referral.orgName}</td>
                      <td>{referral.referralCount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Row className="justify-content-center">
              <PageSizeSelector
                dropdownOpen={dropdownSentToOpenBottom}
                toggleSelect={this.toggleSentToBottom}
                itemsPerPage={sentToTable.itemsPerPage}
                selectFunc={prop => this.select(TABLE_TO, prop)}
              />
              <JhiPagination
                items={getPaginationItemsNumber(referralsMadeToItems, sentToTable.itemsPerPage)}
                activePage={sentToTable.activePage}
                onSelect={prop => this.handlePagination(TABLE_TO, prop)}
                maxButtons={MAX_BUTTONS}
              />
            </Row>
          </Col>
          <Col xs="12" md="6" className="p-0 pl-md-2">
            {this.statusFilter()}
            <div className="table-responsive">
              <Table responsive>
                <thead>
                  <tr>
                    <th className="hand" onClick={this.sort(TABLE_FROM, 'fromOrg.name')}>
                      <Translate contentKey="referral.columns.madeFrom" />
                      &nbsp;
                      <FontAwesomeIcon icon="sort" />
                    </th>
                    <th>
                      <Translate contentKey="referral.columns.status" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referralsMadeFrom.map((referral, i) => (
                    <tr key={`made-from-${i}`}>
                      <td>{referral.orgName}</td>
                      <td>{referral.fulfilledAt ? translate('referral.filters.arrived') : translate('referral.filters.waiting')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Row className="justify-content-center">
              <PageSizeSelector
                dropdownOpen={dropdownSentFromOpenBottom}
                toggleSelect={this.toggleSentFromBottom}
                itemsPerPage={sentFromTable.itemsPerPage}
                selectFunc={prop => this.select(TABLE_FROM, prop)}
              />
              <JhiPagination
                items={getPaginationItemsNumber(referralsMadeFromItems, sentFromTable.itemsPerPage)}
                activePage={sentFromTable.activePage}
                onSelect={prop => this.handlePagination(TABLE_FROM, prop)}
                maxButtons={MAX_BUTTONS}
              />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ referral, providerRecord }: IRootState) => ({
  referralsMadeTo: referral.referralsMadeTo,
  referralsMadeToItems: referral.totalReferralsMadeToItems,
  referralsMadeFrom: referral.referralsMadeFrom,
  referralsMadeFromItems: referral.totalReferralsMadeFromItems,
  orgOptions: _.map(providerRecord.madeToOptions, org => ({
    value: org.id,
    label: org.name
  }))
});

const mapDispatchToProps = {
  searchReferralsMadeTo,
  searchReferralsMadeFrom,
  getMadeToOptions
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberOfReferralsTab);
