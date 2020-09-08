import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Container, Row, Table, Card, CardBody, TabPane, TabContent, Nav, NavItem, NavLink } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import {
  Translate,
  TextFormat,
  JhiPagination,
  getPaginationItemsNumber,
  getSortState,
  IPaginationBaseState, translate
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageSizeSelector from '../../../entities/page-size-selector';
import { IRootState } from 'app/shared/reducers';
import { searchOrganizations } from './users-organizations.reducer';
import { ITEMS_PER_PAGE_ENTITY, MAX_BUTTONS, FIRST_PAGE } from 'app/shared/util/pagination.constants';
import './users-organizations.scss';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, SYSTEM_ACCOUNTS } from 'app/config/constants';
import _ from 'lodash';
import queryString from 'query-string';
import Select from 'react-select';
import { setSearchPhrase } from 'app/shared/util/search-utils';

export interface IOrganizationProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IOrganizationState extends IPaginationBaseState {
  dropdownOpenTop: boolean;
  dropdownOpenBottom: boolean;
  itemsPerPage: number;
  name: string;
  systemAccount: string;
  typingTimeout: number;
}
const SEARCH_TIMEOUT = 1000;

export class UsersOrganizations extends React.Component<IOrganizationProps, IOrganizationState> {
  constructor(props) {
    super(props);

    this.toggleTop = this.toggleTop.bind(this);
    this.toggleBottom = this.toggleBottom.bind(this);
    this.select = this.select.bind(this);
    JhiPagination.bind(this);
    PageSizeSelector.bind(this);
    this.state = {
      dropdownOpenTop: false,
      dropdownOpenBottom: false,
      itemsPerPage: ITEMS_PER_PAGE_ENTITY,
      ...getSortState(this.props.location, ITEMS_PER_PAGE_ENTITY),
      name: '',
      systemAccount: SYSTEM_ACCOUNTS.SERVICE_PROVIDER,
      typingTimeout: 0
    };
  }

  componentDidMount() {
    if (!_.isEqual(this.props.location.search, '')) {
      const fetchPageData = queryString.parse(this.props.location.search);
      this.setCustomState(fetchPageData.name, fetchPageData.page, fetchPageData.itemsPerPage, fetchPageData.sort);
    } else {
      this.getEntities();
    }
  }

  componentDidUpdate(prevProps) {
    if (!(this.props.location === prevProps.location) && !(this.props.location.search === '')) {
      const fetchPageData = queryString.parse(this.props.location.search);
      this.setCustomState(fetchPageData.name, fetchPageData.page, fetchPageData.itemsPerPage, fetchPageData.sort);
    }
    if (!(this.props.location === prevProps.location) && this.props.location.search === '') {
      this.setCustomState('', FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, this.state.sort);
    }
  }

  setCustomState(name, page, items, sort) {
    this.setState({
      name,
      activePage: Number(page),
      itemsPerPage: Number(items),
      ...getSortState(this.props.location, items)
    });
    this.props.getEntities(name, this.state.systemAccount, Number(page) - 1, Number(items), `${sort}`);
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.updatePage()
    );
  };

  handlePagination = activePage => this.setState({ activePage }, () => this.updatePage());

  getEntities = () => {
    const { name, systemAccount, activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(name, systemAccount, activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  toggleTop() {
    this.setState({ dropdownOpenTop: !this.state.dropdownOpenTop });
  }

  toggleBottom() {
    this.setState({ dropdownOpenBottom: !this.state.dropdownOpenBottom });
  }

  select = prop => () => {
    this.setState(
      {
        itemsPerPage: prop,
        activePage: FIRST_PAGE
      },
      () => this.updatePage()
    );
  };

  updatePage() {
    this.getEntities();
    window.scrollTo(0, 0);
    const { activePage, sort, order, itemsPerPage, name } = this.state;
    this.props.history.push({
      pathname: `${this.props.location.pathname}`,
      search: `?name=${name}&page=${activePage}&sort=${sort},${order}&itemsPerPage=${itemsPerPage}`
    });
  }

  updateSearch = name => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      activePage: 1,
      name,
      typingTimeout: setTimeout(() => {
        this.getEntities();
      }, SEARCH_TIMEOUT)
    });
  };

  clearSearchBar = () => {
    if (this.state.name !== '') {
      this.setState({
        activePage: 1,
        name: ''
      }, () => {
        this.getEntities();
      });
    }
  };

  onInputChange = event => {
    this.updateSearch(event.target.value);
  };

  render() {
    const { organizationList, match, totalItems } = this.props;
    return (
      <div className="users-organizations">
        <h2 id="organization-heading">
          <Translate contentKey="global.menu.admin.organizationOwners">Organization owners</Translate>
        </h2>
        <Row className="mt-4">
          <Col sm="12" className="search-bar">
            <FontAwesomeIcon icon="search" size="lg" className="search-icon" />
            <input
              name="search"
              id="searchBar"
              className="search-input form-control"
              value={this.state.name || ''}
              placeholder={translate('serviceNetApp.organization.searchPlaceholder')}
              onChange={this.onInputChange}
            />
          </Col>
          <div className="clear-search-icon-container" onClick={this.clearSearchBar}>
            <FontAwesomeIcon icon="times-circle" size="lg" className="clear-search-icon" />
          </div>
        </Row>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={this.sort('name')}>
                  <Translate contentKey="serviceNetApp.organization.name">Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('description')}>
                  <Translate contentKey="serviceNetApp.organization.description">Description</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('email')}>
                  <Translate contentKey="serviceNetApp.organization.email">Email</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('url')}>
                  <Translate contentKey="serviceNetApp.organization.url">Url</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('updatedAt')}>
                  <Translate contentKey="serviceNetApp.organization.updatedAt">Updated At</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="serviceNetApp.organization.owner">Owner</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {organizationList.map((organization, i) => (
                <tr key={`entity-${i}`}>
                  <td>{organization.name}</td>
                  <td>{organization.description}</td>
                  <td>{organization.email}</td>
                  <td>{organization.url}</td>
                  <td>
                    <TextFormat type="date" value={organization.updatedAt} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    {organization.userProfiles ? (
                      <Link to={`user-management/${organization.userProfiles[0].login}`}>{organization.userProfiles[0].login}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${organization.id}`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
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

const mapStateToProps = ({ usersOrganizations }: IRootState) => ({
  organizationList: usersOrganizations.entities,
  totalItems: usersOrganizations.totalItems
});

const mapDispatchToProps = {
  getEntities: searchOrganizations
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersOrganizations);
