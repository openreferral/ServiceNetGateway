import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction, JhiPagination, getPaginationItemsNumber, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './program.reducer';
import { IProgram } from 'app/shared/model/program.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import PageSizeSelector from 'app/entities/page-size-selector';
import { FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, MAX_BUTTONS } from 'app/shared/util/pagination.constants';
import _ from 'lodash';
import queryString from 'query-string';

export interface IProgramProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IProgramState extends IPaginationBaseState {
  dropdownOpenTop: boolean;
  dropdownOpenBottom: boolean;
  itemsPerPage: number;
}

export class Program extends React.Component<IProgramProps, IProgramState> {
  constructor(props) {
    super(props);

    this.toggleTop = this.toggleTop.bind(this);
    this.toggleBottom = this.toggleBottom.bind(this);
    this.select = this.select.bind(this);
    this.state = {
      dropdownOpenTop: false,
      dropdownOpenBottom: false,
      itemsPerPage: ITEMS_PER_PAGE_ENTITY,
      ...getSortState(this.props.location, ITEMS_PER_PAGE_ENTITY)
    };
  }

  componentDidMount() {
    if (!_.isEqual(this.props.location.search, '')) {
      const fetchPageData = queryString.parse(this.props.location.search);
      this.setCustomState(fetchPageData.page, fetchPageData.itemsPerPage, fetchPageData.sort);
    } else {
      this.getEntities();
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

  setCustomState(page, items, sort) {
    this.setState({
      activePage: Number(page),
      itemsPerPage: Number(items),
      ...getSortState(this.props.location, items)
    });
    this.props.getEntities(Number(page) - 1, Number(items), `${sort}`);
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
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
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
    const { activePage, sort, order, itemsPerPage } = this.state;
    this.props.history.push({
      pathname: `${this.props.location.pathname}`,
      search: `?page=${activePage}&sort=${sort},${order}&itemsPerPage=${itemsPerPage}`
    });
  }

  render() {
    const { programList, match, totalItems } = this.props;
    return (
      <div>
        <h2 id="program-heading">
          <Translate contentKey="serviceNetApp.program.home.title">Programs</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="serviceNetApp.program.home.createLabel">Create new Program</Translate>
          </Link>
        </h2>
        <Row className="justify-content-center">
          <PageSizeSelector
            dropdownOpen={this.state.dropdownOpenTop}
            toggleSelect={this.toggleTop}
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
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="serviceNetApp.program.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="serviceNetApp.program.alternateName">Alternate Name</Translate>
                </th>
                <th>
                  <Translate contentKey="serviceNetApp.program.organization">Organization</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {programList.map((program, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${program.id}`} color="link" size="sm">
                      {program.id}
                    </Button>
                  </td>
                  <td>{program.name}</td>
                  <td>{program.alternateName}</td>
                  <td>
                    {program.organizationName ? <Link to={`organization/${program.organizationId}`}>{program.organizationName}</Link> : ''}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${program.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${program.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${program.id}/delete`} color="danger" size="sm">
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

const mapStateToProps = ({ program }: IRootState) => ({
  programList: program.entities,
  totalItems: program.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Program);
