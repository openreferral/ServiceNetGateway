import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table, Row } from 'reactstrap';
import { Translate, JhiPagination, getPaginationItemsNumber, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITEMS_PER_PAGE, MAX_BUTTONS, FIRST_PAGE } from 'app/shared/util/pagination.constants';
import { getSystemAccounts } from 'app/modules/administration/user-management/user-management.reducer';
import { getClients, updateClient } from './client-management.reducer';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import queryString from 'query-string';

export interface IClientManagementProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export class ClientManagement extends React.Component<IClientManagementProps, IPaginationBaseState> {
  state: IPaginationBaseState = {
    ...ClientManagement.getClientSortState(this.props.location, ITEMS_PER_PAGE)
  };

  static getClientSortState(location, itemsPerPage) {
    const sortState = getSortState(location, itemsPerPage);
    if (sortState.sort === 'id') {
      sortState.sort = 'clientId';
    }
    return sortState;
  }

  componentDidMount() {
    if (!_.isEqual(this.props.location.search, '')) {
      const parsed = queryString.parse(this.props.location.search);
      this.setCustomState(parsed.page, parsed.itemsPerPage, parsed.sort);
    } else {
      this.getClients();
    }
    this.props.getSystemAccounts();
  }

  componentDidUpdate(prevProps) {
    if (!(this.props.location === prevProps.location) && !(this.props.location.search === '')) {
      const parsed = queryString.parse(this.props.location.search);
      this.setCustomState(parsed.page, parsed.itemsPerPage, parsed.sort);
    }
    if (!(this.props.location === prevProps.location) && this.props.location.search === '') {
      this.setCustomState(FIRST_PAGE, ITEMS_PER_PAGE, this.state.sort);
    }
  }

  setCustomState(page, items, sort) {
    this.setState({
      activePage: Number(page),
      itemsPerPage: Number(items),
      ...getSortState(this.props.location, items)
    });
    this.props.getClients(Number(page) - 1, Number(items), `${sort}`);
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortClients()
    );
  };

  sortClients() {
    this.getClients();
    const { itemsPerPage } = this.state;
    this.props.history.push(
      `${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${
        this.state.order
      }&itemsPerPage=${itemsPerPage}`
    );
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortClients());

  getClients = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getClients(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  toggleActive = client => () => {
    this.props.updateClient({
      ...client,
      activated: !client.activated
    });
  };

  getSystemAccount = (systemAccounts, client) => {
    const systemAccount = _.find(systemAccounts, s => s.id === client.systemAccountId);
    return _.get(systemAccount, 'name', '');
  };

  render() {
    const { clients, account, match, totalItems, systemAccounts } = this.props;
    return (
      <div>
        <h2 id="client-management-page-heading">
          <Translate contentKey="clientManagement.home.title">External Clients</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FontAwesomeIcon icon="plus" /> <Translate contentKey="clientManagement.home.createLabel">Create a new client</Translate>
          </Link>
        </h2>
        <Table responsive striped>
          <thead>
            <tr>
              <th className="hand" onClick={this.sort('clientId')}>
                <Translate contentKey="clientManagement.clientId">Client id</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={this.sort('accessTokenValiditySeconds')}>
                <Translate contentKey="clientManagement.tokenValiditySeconds">Token validity seconds</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={this.sort('accessTokenValiditySeconds')}>
                <Translate contentKey="clientManagement.systemAccount">System Account</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {clients.map((client, i) => (
              <tr id={client.clientId} key={`client-${i}`}>
                <td>
                  <Button tag={Link} to={`${match.url}/${client.clientId}`} color="link" size="sm">
                    {client.clientId}
                  </Button>
                </td>
                <td>{client.tokenValiditySeconds}</td>
                <td>{this.getSystemAccount(systemAccounts, client)}</td>
                <td className="text-right">
                  <div className="btn-group flex-btn-group-container">
                    <Button tag={Link} to={`${match.url}/${client.clientId}`} color="info" size="sm">
                      <FontAwesomeIcon icon="eye" />{' '}
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.view">View</Translate>
                      </span>
                    </Button>
                    <Button tag={Link} to={`${match.url}/${client.clientId}/edit`} color="primary" size="sm">
                      <FontAwesomeIcon icon="pencil-alt" />{' '}
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.edit">Edit</Translate>
                      </span>
                    </Button>
                    <Button
                      tag={Link}
                      to={`${match.url}/${client.clientId}/delete`}
                      color="danger"
                      size="sm"
                      disabled={account.clientId === client.clientId}
                    >
                      <FontAwesomeIcon icon="trash" />{' '}
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.delete">Delete</Translate>
                      </span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row className="justify-content-center">
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

const mapStateToProps = (storeState: IRootState) => ({
  clients: storeState.clientManagement.clients,
  totalItems: storeState.clientManagement.totalItems,
  account: storeState.authentication.account,
  systemAccounts: storeState.userManagement.systemAccounts
});

const mapDispatchToProps = { getClients, updateClient, getSystemAccounts };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientManagement);
