import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction, JhiPagination, getPaginationItemsNumber, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './fields-display-settings.reducer';
import { IFieldsDisplaySettings } from 'app/shared/model/fields-display-settings.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import PageSizeSelector from 'app/entities/page-size-selector';
import { FIRST_PAGE, ITEMS_PER_PAGE_ENTITY, MAX_BUTTONS } from 'app/shared/util/pagination.constants';
import _ from 'lodash';
import queryString from 'query-string';

export interface IFieldsDisplaySettingsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IFieldsDisplaySettingsState extends IPaginationBaseState {
  dropdownOpenTop: boolean;
  dropdownOpenBottom: boolean;
  itemsPerPage: number;
}

export class FieldsDisplaySettings extends React.Component<IFieldsDisplaySettingsProps, IFieldsDisplaySettingsState> {
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
    const { fieldsDisplaySettingsList, match, totalItems } = this.props;
    return (
      <div>
        <h2 id="fields-display-settings-heading">
          <Translate contentKey="serviceNetApp.fieldsDisplaySettings.home.title">Fields Display Settings</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="serviceNetApp.fieldsDisplaySettings.home.createLabel">Create a new Fields Display Settings</Translate>
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
          {fieldsDisplaySettingsList && fieldsDisplaySettingsList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.name">Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.locationFields">Location Fields</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.organizationFields">Organization Fields</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.physicalAddressFields">Physical Address Fields</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.postalAddressFields">Postal Address Fields</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.serviceFields">Service Fields</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.serviceTaxonomiesDetailsFields">
                      Service Taxonomies Details Fields
                    </Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.contactDetailsFields">Contact Details Fields</Translate>
                  </th>
                  <th>
                    <Translate contentKey="serviceNetApp.fieldsDisplaySettings.user">User</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {fieldsDisplaySettingsList.map((fieldsDisplaySettings, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${fieldsDisplaySettings.id}`} color="link" size="sm">
                        {fieldsDisplaySettings.id}
                      </Button>
                    </td>
                    <td>{fieldsDisplaySettings.name}</td>
                    <td>{fieldsDisplaySettings.locationFields}</td>
                    <td>{fieldsDisplaySettings.organizationFields}</td>
                    <td>{fieldsDisplaySettings.physicalAddressFields}</td>
                    <td>{fieldsDisplaySettings.postalAddressFields}</td>
                    <td>{fieldsDisplaySettings.serviceFields}</td>
                    <td>{fieldsDisplaySettings.serviceTaxonomiesDetailsFields}</td>
                    <td>{fieldsDisplaySettings.contactDetailsFields}</td>
                    <td>{fieldsDisplaySettings.userLogin ? fieldsDisplaySettings.userLogin : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${fieldsDisplaySettings.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${fieldsDisplaySettings.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${fieldsDisplaySettings.id}/delete`} color="danger" size="sm">
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
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="serviceNetApp.fieldsDisplaySettings.home.notFound">No Fields Display Settings found</Translate>
            </div>
          )}
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

const mapStateToProps = ({ fieldsDisplaySettings }: IRootState) => ({
  fieldsDisplaySettingsList: fieldsDisplaySettings.entities,
  totalItems: fieldsDisplaySettings.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldsDisplaySettings);
