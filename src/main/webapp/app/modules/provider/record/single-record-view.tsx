import './single-record-view.scss';

import React from 'react';
import { Collapse, Button, CardBody, Card, CardTitle, Progress } from 'reactstrap';
import { TextFormat, Translate, translate } from 'react-jhipster';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getProviderEntity } from 'app/entities/organization/organization.reducer';
import { getProviderTaxonomies } from 'app/entities/taxonomy/taxonomy.reducer';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { measureWidths, getColumnCount, containerStyle } from 'app/shared/util/measure-widths';
import { APP_DATE_FORMAT } from 'app/config/constants';
// @ts-ignore
import BuildingLogo from '../../../../static/images/building.svg';
// @ts-ignore
import PeopleLogo from '../../../../static/images/people.svg';
// @ts-ignore
import ServiceLogo from '../../../../static/images/service.svg';

const LocationPill = location => {
  if (!location) {
    return <div />;
  }
  return (
    <div className="location">
      <span>
        <FontAwesomeIcon icon="circle" className="blue" /> {location.city}, {location.ca}
      </span>
    </div>
  );
};

const ServicePill = service => {
  if (!service) {
    return <div />;
  }
  return (
    <div className="pill">
      <span>{service.name}</span>
    </div>
  );
};

const TaxonomyOptionPill = taxonomyOption => (
  <div className="pill pill-sm" key={taxonomyOption.value}>
    <span>{taxonomyOption.label}</span>
  </div>
);

const RemainderCount = count => <span className="remainder blue pl-0">+ {count}</span>;

const measureId = idx => 'measure-svc-' + idx;
const MAX_PILLS_WIDTH = 250;
const REMAINDER_WIDTH = 25;

export interface ISingleRecordViewProps extends StateProps, DispatchProps, RouteComponentProps<{ orgId: string }> {
  record: any;
}

export interface ISingleRecordViewState {
  serviceWidths: any[];
  locationWidths: any[];
  isOrganizationOpen: boolean;
  isServicesOpen: boolean;
  isLocationsOpen: boolean;
  currentServiceIdx: number;
  detailsView: boolean;
  initialLoad: boolean;
}

class SingleRecordView extends React.Component<ISingleRecordViewProps, ISingleRecordViewState> {
  state: ISingleRecordViewState = {
    serviceWidths: [],
    locationWidths: [],
    isOrganizationOpen: false,
    isServicesOpen: false,
    isLocationsOpen: false,
    currentServiceIdx: 0,
    detailsView: false,
    initialLoad: true
  };

  toggleOrganization = () => this.setState({ isOrganizationOpen: !this.state.isOrganizationOpen });
  toggleServices = () => this.setState({ isServicesOpen: !this.state.isServicesOpen, detailsView: false });
  toggleLocations = () => this.setState({ isLocationsOpen: !this.state.isLocationsOpen });

  componentDidMount() {
    this.props.getProviderTaxonomies();
    this.props.getProviderEntity(this.props.match.params.orgId);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.organization.id !== this.props.organization.id || this.state.initialLoad) {
      if (nextProps.organization.locations &&
        nextProps.organization.services) {
        this.measureLocationsWidth(nextProps.organization);
      }
    }
  }

  componentDidUpdate(prevProps: Readonly<ISingleRecordViewProps>, prevState: Readonly<ISingleRecordViewState>) {
    if (this.props.taxonomyOptions !== prevProps.taxonomyOptions) {
      measureWidths(
        [...this.props.taxonomyOptions.map(item => TaxonomyOptionPill(item))],
        measureId(this.props.match.params.orgId)
      ).then((taxonomyWidths: any[]) => {
        this.props.taxonomyOptions.forEach((to, i) => to['width'] = taxonomyWidths[i]);
      });
    }
  }

  showServiceDetails = serviceIdx => this.setState({ detailsView: true, currentServiceIdx: serviceIdx });

  closeServiceDetails = () => this.setState({ detailsView: false });

  nextService = servicesCount => {
    const { currentServiceIdx } = this.state;
    if (currentServiceIdx + 1 < servicesCount) {
      this.setState({ currentServiceIdx: currentServiceIdx + 1 });
    } else {
      this.setState({ currentServiceIdx: 0 });
    }
  };

  prevService = servicesCount => {
    const { currentServiceIdx } = this.state;
    if (currentServiceIdx === 0) {
      this.setState({ currentServiceIdx: servicesCount - 1 });
    } else {
      this.setState({ currentServiceIdx: currentServiceIdx - 1 });
    }
  };

  measureLocationsWidth = organization =>
    measureWidths([
      ...organization.services.map(item => ServicePill(item)),
      ...organization.locations.map(item => LocationPill(item))
    ]).then((serviceAndLocationWidths: any[]) => {
      this.setState({
        serviceWidths: serviceAndLocationWidths.slice(0, organization.services.length),
        locationWidths: serviceAndLocationWidths.slice(organization.services.length),
        initialLoad: false
      });
    });

  taxonomyPills = service => {
    const taxonomyOptions = this.props.taxonomyOptions.filter(to =>
      service['taxonomyIds'] && service['taxonomyIds'].indexOf(to.value) !== -1);
    const widths = taxonomyOptions.map(to => to['width'] || 200);
    const itemCount = getColumnCount(widths, MAX_PILLS_WIDTH) || 0;
    return <div>{taxonomyOptions.slice(0, itemCount).map(to => (
      <div className="pill pill-sm" key={to.value}>
        <span>{to.label}</span>
      </div>
    ))}
      {(itemCount < taxonomyOptions.length) ? RemainderCount(taxonomyOptions.length - itemCount) : ''}
    </div>;
  }

  render() {
    const {
      isOrganizationOpen,
      isServicesOpen,
      isLocationsOpen,
      currentServiceIdx,
      detailsView,
      locationWidths,
      serviceWidths
    } = this.state;
    const { organization, taxonomyOptions } = this.props;
    const locationsCount = organization && organization.locations ? organization.locations.length : 0;
    const servicesCount = organization && organization.services ? organization.services.length : 0;
    const latestDailyUpdate = organization && organization.services ? organization.dailyUpdates.find(du => du.expiry === null) || {} : null;

    return (
      <div className="background single-record-view">
        <div id={measureId(this.props.match.params.orgId)} style={containerStyle} />
        <Button tag={Link} to="/" color="" className="d-none d-sm-block position-fixed go-back">
          <FontAwesomeIcon icon="angle-left" />
          &nbsp;
          <Translate contentKey="record.singleRecordView.back" />
        </Button>
        <div className="col-md-8 offset-md-2 card-section">
          <Card className="record-card">
            <CardTitle className="card-title">
              <div className="d-flex w-100 justify-content-between">
                <div className="w-100">
                  <h3>
                    <b>{organization.name}</b>
                  </h3>
                  <section className="services pt-2">
                    {servicesCount > 0 ? (
                      <AutoSizer disableHeight>
                        {({ width }) => {
                          const itemCount = getColumnCount(serviceWidths, width, REMAINDER_WIDTH);
                          const overflow = itemCount < servicesCount;
                          const totalItemCount = itemCount + (overflow ? 1 : 0);
                          return (
                            <List
                              height={20}
                              itemCount={totalItemCount}
                              itemSize={width / totalItemCount}
                              layout="horizontal"
                              width={width}
                              style={{ flex: 1, class: 'pills', overflow: 'none' }}
                            >
                              {({ index }) => {
                                return index === itemCount
                                  ? RemainderCount(servicesCount - itemCount)
                                  : ServicePill(organization.services[index]);
                              }}
                            </List>
                          );
                        }}
                      </AutoSizer>
                    ) : null}
                  </section>
                </div>
                <img src={PeopleLogo} height={100} alt="Organization" className="d-none d-sm-block mx-5" />
              </div>
            </CardTitle>
            <CardBody>
              <section className="locations p-2" id="locations">
                {locationsCount > 0 ? (
                  <AutoSizer disableHeight>
                    {({ width }) => {
                      const itemCount = getColumnCount(locationWidths, width, REMAINDER_WIDTH);
                      const overflow = itemCount < locationsCount;
                      const totalItemCount = itemCount + (overflow ? 1 : 0);
                      return (
                        <List
                          height={20}
                          itemCount={totalItemCount}
                          itemSize={width / totalItemCount}
                          layout="horizontal"
                          width={width}
                          style={{ flex: 1, class: 'pills' }}
                        >
                          {({ index }) => {
                            return index === itemCount
                              ? RemainderCount(locationsCount - itemCount)
                              : LocationPill(organization.locations[index]);
                          }}
                        </List>
                      );
                    }}
                  </AutoSizer>
                ) : null}
              </section>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-8 offset-md-2 card-section">
          <Card className="record-card">
            <CardTitle className="card-title flex-wrap">
              <Translate contentKey="record.singleRecordView.dailyUpdates" />
              &nbsp;
              {latestDailyUpdate && latestDailyUpdate.update ? (
                <span>
                  ({translate('record.singleRecordView.lastUpdated')}
                  :&nbsp;
                  {latestDailyUpdate.createdAt ? (
                    <TextFormat value={latestDailyUpdate.createdAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  ) : (
                    <Translate contentKey="recordCard.unknown" />
                  )}
                  )
                </span>
              ) : null}
            </CardTitle>
            <CardBody className="p-2">
              {latestDailyUpdate && latestDailyUpdate.update ? (
                <span className="p-0">{latestDailyUpdate.update}</span>
              ) : (
                <div className="w-100 text-center p-2">
                  <Translate contentKey="record.singleRecordView.noNewUpdates" />
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="col-md-8 offset-md-2 card-section">
          <Card className="record-card">
            <CardTitle onClick={this.toggleOrganization} className="collapse-toggle card-title">
              <div className="d-flex justify-content-center align-items-center">
                <img src={PeopleLogo} height={25} alt="Organization" />
                &nbsp;
                <Translate contentKey="record.singleRecordView.orgDetails" />
              </div>
              {isOrganizationOpen ? <FontAwesomeIcon icon="angle-up" size="lg" /> : <FontAwesomeIcon icon="angle-down" size="lg" />}
            </CardTitle>
            <Collapse isOpen={isOrganizationOpen}>
              <CardBody className="details organization">
                <section>
                  <h6>
                    <b>
                      <Translate contentKey="record.singleRecordView.orgName" />
                    </b>
                  </h6>
                  <span>{organization.name}</span>
                </section>
                <section>
                  <h6>
                    <b>
                      <Translate contentKey="record.singleRecordView.orgDescr" />
                    </b>
                  </h6>
                  <span>{organization.description}</span>
                </section>
                <section>
                  <h6>
                    <b>
                      <Translate contentKey="record.singleRecordView.orgWebsite" />
                    </b>
                  </h6>
                  <span className="text-break">{organization.url}</span>
                </section>
                <section>
                  <h6>
                    <b>
                      <Translate contentKey="record.singleRecordView.orgEmail" />
                    </b>
                  </h6>
                  <span>{organization.email}</span>
                </section>
              </CardBody>
            </Collapse>
          </Card>
        </div>

        <div className="col-md-8 offset-md-2 card-section">
          <Card className="record-card">
            <CardTitle onClick={this.toggleLocations} className="collapse-toggle card-title">
              <div className="d-flex justify-content-center align-items-center">
                <img src={BuildingLogo} height={25} alt="Location" />
                &nbsp;
                <Translate contentKey="record.singleRecordView.locDetails" />
                &nbsp;
                <span className="badge badge-light badge-pill">{locationsCount}</span>
              </div>
              {isLocationsOpen ? <FontAwesomeIcon icon="angle-up" size="lg" /> : <FontAwesomeIcon icon="angle-down" size="lg" />}
            </CardTitle>
            <Collapse isOpen={isLocationsOpen}>
              <CardBody className="details">
                <section className="row col-12 details-view">
                  {locationsCount > 0 ? (
                    organization.locations.map(loc => (
                      <Card className="record-card loc-card col-md-4 col-xs-12 mb-2 mx-2 pt-3">
                        <CardTitle>
                          <span>
                            <FontAwesomeIcon icon="circle" className="blue" size="xs" />{' '}
                            <b>
                              {loc.city}, {loc.ca}
                            </b>
                          </span>
                        </CardTitle>
                        <CardBody>
                          <p className="m-0">{loc.address1}</p>
                          <p>{loc.zipcode}</p>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <Translate contentKey="record.singleRecordView.noLocations" />
                  )}
                </section>
              </CardBody>
            </Collapse>
          </Card>
        </div>

        <div className="col-md-8 offset-md-2 mb-5 section">
          <Card className="record-card">
            <CardTitle onClick={this.toggleServices} className="collapse-toggle card-title">
              <div className="d-flex justify-content-center align-items-center">
                <img src={ServiceLogo} height={25} alt="Service" />
                &nbsp;
                <Translate contentKey="record.singleRecordView.srvDetails" />
                &nbsp;
                <span className="badge badge-light badge-pill">{servicesCount}</span>
              </div>
              {isServicesOpen ? <FontAwesomeIcon icon="angle-up" size="lg" /> : <FontAwesomeIcon icon="angle-down" size="lg" />}
            </CardTitle>
            <Collapse isOpen={isServicesOpen}>
              <CardBody className="details">
                <section className={`row col-12 details-view ${detailsView ? 'd-none' : ''}`}>
                  {servicesCount > 0 ? (
                    organization.services.map((srv, idx) => (
                      <Card className="record-card srv-card col-md-4 col-xs-12 mb-2 mx-2 pt-3" onClick={() => this.showServiceDetails(idx)}>
                        <CardTitle>
                          <span>
                            <FontAwesomeIcon icon="circle" className="orange" size="xs" />{' '}
                            <b>{srv.name ? srv.name : translate('record.singleRecordView.noServiceName')}</b>
                          </span>
                        </CardTitle>
                        <CardBody>
                          <div className="services pills">
                            {srv.taxonomyIds.length > 0 && taxonomyOptions && taxonomyOptions.length > 0 ? (
                              this.taxonomyPills(srv)
                            ) : (
                              <span className="pill">{translate('record.singleRecordView.untyped')}</span>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <Translate contentKey="record.singleRecordView.noServices" />
                  )}
                </section>
                {servicesCount > 0 ? (
                  <div className={`service p-0 ${detailsView ? '' : 'd-none'}`}>
                    <section className="header">
                      <div className="d-inline-block w-100 d-md-flex justify-content-between">
                        <div className="d-inline-flex align-items-center service-name">
                          <FontAwesomeIcon icon="circle" className="orange" />
                          &nbsp;
                          <h5 className="mb-0">
                            <b>
                              {organization.services[currentServiceIdx].name
                                ? organization.services[currentServiceIdx].name
                                : translate('record.singleRecordView.noServiceName')}
                            </b>
                          </h5>
                        </div>
                        <div className="d-inline-flex align-items-center pull-right">
                          <div className="p-2 mr-1 arrow-navigation" onClick={() => this.prevService(servicesCount)}>
                            <FontAwesomeIcon icon="angle-left" size="lg" />
                          </div>
                          <div className="d-flex justify-content-center mr-1">
                            <div className="align-self-center">
                              <b>{currentServiceIdx + 1}</b>
                            </div>
                            <div className="mx-2 align-self-center">
                              <Progress value={((currentServiceIdx + 1) / servicesCount) * 100} />
                            </div>
                            <div className="align-self-center">
                              <b>{servicesCount}</b>
                            </div>
                          </div>
                          <div className="p-2 arrow-navigation" onClick={() => this.nextService(servicesCount)}>
                            <FontAwesomeIcon icon="angle-right" size="lg" />
                          </div>
                          <div className="p-2 arrow-navigation" onClick={this.closeServiceDetails}>
                            <FontAwesomeIcon icon="times" size="lg" />
                          </div>
                        </div>
                      </div>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvTypes" />
                        </b>
                        {organization.services[currentServiceIdx].taxonomyIds.length > 0 ? (
                          organization.services[currentServiceIdx].taxonomyIds.map(srvTaxonomy => (
                            <span className="pill ml-1 mr-1 mb-1">
                              {taxonomyOptions && taxonomyOptions.length > 0
                                ? taxonomyOptions.find(taxonomy => taxonomy.value === srvTaxonomy).label
                                : translate('record.singleRecordView.untyped')}
                            </span>
                          ))
                        ) : (
                          <span className="pill">{translate('record.singleRecordView.untyped')}</span>
                        )}
                      </h6>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvDescr" />
                        </b>
                      </h6>
                      <span>{organization.services[currentServiceIdx].description}</span>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvApplication" />
                        </b>
                      </h6>
                      <span>{organization.services[currentServiceIdx].applicationProcess}</span>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvEligibility" />
                        </b>
                      </h6>
                      <span>{organization.services[currentServiceIdx].eligibilityCriteria}</span>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvLocations" />
                        </b>
                        {organization.services[currentServiceIdx].locationIndexes.map(locIdx => (
                          <span className="pill ml-1 mr-1 mb-1">
                            <FontAwesomeIcon icon="circle" className="blue" size="xs" />
                            &nbsp;
                            {organization.locations[locIdx].city}, {organization.locations[locIdx].ca}
                          </span>
                        ))}
                      </h6>
                    </section>
                  </div>
                ) : null}
              </CardBody>
            </Collapse>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (rootState: IRootState) => ({
  organization: rootState.organization.providersEntity,
  taxonomyOptions: rootState.taxonomy.providerTaxonomies.map(
    taxonomy => ({ value: taxonomy.id, label: taxonomy.name }))
});

const mapDispatchToProps = { getProviderEntity, getProviderTaxonomies };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleRecordView);
