import './record.scss';

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
import { APP_DATE_FORMAT, SYSTEM_ACCOUNTS } from 'app/config/constants';
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
    <div className="pill d-inline-flex">
      <span>{service.name}</span>
    </div>
  );
};

const TaxonomyOptionPill = taxonomyOption => (
  <div className="pill mt-2" key={taxonomyOption.value}>
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
    const siloName = this.getSiloName();
    this.props.getProviderTaxonomies(SYSTEM_ACCOUNTS.SERVICE_PROVIDER, siloName);
    this.props.getProviderEntity(this.props.match.params.orgId, siloName);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.organization.id !== this.props.organization.id || this.state.initialLoad) {
      if (nextProps.organization.locations && nextProps.organization.services) {
        this.measureLocationsWidth(nextProps.organization);
      }
    }
  }

  componentDidUpdate(prevProps: Readonly<ISingleRecordViewProps>, prevState: Readonly<ISingleRecordViewState>) {
    if (this.props.taxonomyOptions !== prevProps.taxonomyOptions) {
      measureWidths([...this.props.taxonomyOptions.map(item => TaxonomyOptionPill(item))], measureId(this.props.match.params.orgId)).then(
        (taxonomyWidths: any[]) => {
          this.props.taxonomyOptions.forEach((to, i) => (to['width'] = taxonomyWidths[i]));
        }
      );
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
    const taxonomyOptions = this.props.taxonomyOptions.filter(
      to => service['taxonomyIds'] && service['taxonomyIds'].indexOf(to.value) !== -1
    );
    const widths = taxonomyOptions.map(to => to['width'] || 200);
    const itemCount = getColumnCount(widths, MAX_PILLS_WIDTH) || 0;
    return (
      <div>
        {taxonomyOptions.slice(0, itemCount).map(to => (
          <div className="pill mt-2" key={to.value}>
            <span>{to.label}</span>
          </div>
        ))}
        {itemCount < taxonomyOptions.length ? RemainderCount(taxonomyOptions.length - itemCount) : ''}
      </div>
    );
  };

  getSiloName = () => {
    if (this.props.match && this.props.match.url && this.props.match.url.includes('public')) {
      // take name of silo that is in the url
      const siloName = this.props.match.url.split('public/')[1].split('/')[0];
      return siloName;
    }
    return null;
  };

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
    const siloName = this.getSiloName();
    return (
      <div className="single-record-view background">
        <div id={measureId(this.props.match.params.orgId)} style={containerStyle} />
        <Button tag={Link} to={siloName ? `/public/${siloName}` : '/'} color="" className="d-none d-sm-block position-fixed go-back">
          <FontAwesomeIcon icon="angle-left" />
          &nbsp;
          <Translate contentKey="record.singleRecordView.back" />
        </Button>

        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <Card className="section">
            <CardTitle>
              <div className="d-flex w-100 justify-content-between">
                <div className="w-100">
                  <h3>
                    <b className="word-break-all">{organization.name}</b>
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
                              style={{ flex: 1, overflow: 'none' }}
                              className="pl-0"
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
            <CardBody className="p-0 border-top-0">
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
                          style={{ flex: 1, overflow: 'hidden' }}
                          className="pl-0"
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

          <Card className="section">
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
            <CardBody className="p-2 border-top-0">
              {latestDailyUpdate && latestDailyUpdate.update ? (
                <span className="p-0 word-break-all">{latestDailyUpdate.update}</span>
              ) : (
                <div className="w-100 text-center p-2">
                  <Translate contentKey="record.singleRecordView.noNewUpdates" />
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="section">
            <CardTitle onClick={this.toggleOrganization} className="clickable">
              <div className="d-flex justify-content-center align-items-center details-section-title">
                <img src={PeopleLogo} height={25} alt="Organization" />
                &nbsp;
                <Translate contentKey="record.singleRecordView.orgDetails" />
              </div>
              {isOrganizationOpen ? <FontAwesomeIcon icon="angle-up" size="lg" /> : <FontAwesomeIcon icon="angle-down" size="lg" />}
            </CardTitle>
            <Collapse isOpen={isOrganizationOpen}>
              <CardBody className="details organization p-0">
                <section>
                  <h6>
                    <b>
                      <Translate contentKey="record.singleRecordView.orgName" />
                    </b>
                  </h6>
                  <span className="word-break-all">{organization.name}</span>
                </section>
                <section>
                  <h6>
                    <b>
                      <Translate contentKey="record.singleRecordView.orgDescr" />
                    </b>
                  </h6>
                  <span className="word-break-all">{organization.description}</span>
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

          <Card className="section">
            <CardTitle onClick={this.toggleLocations} className="clickable">
              <div className="d-flex justify-content-center align-items-center details-section-title">
                <img src={BuildingLogo} height={25} alt="Location" />
                &nbsp;
                <Translate contentKey="record.singleRecordView.locDetails" />
                &nbsp;
                <span className="badge badge-light badge-pill">{locationsCount}</span>
              </div>
              {isLocationsOpen ? <FontAwesomeIcon icon="angle-up" size="lg" /> : <FontAwesomeIcon icon="angle-down" size="lg" />}
            </CardTitle>
            <Collapse isOpen={isLocationsOpen}>
              <CardBody className="details p-0">
                <section>
                  {locationsCount > 0 ? (
                    organization.locations.map(loc => (
                      <div className="d-inline-block col-md-4 col-xs-12 p-0">
                        <Card className="record-card details-card ml-0 mb-3 mr-0 mr-md-3 pt-3">
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
                      </div>
                    ))
                  ) : (
                    <Translate contentKey="record.singleRecordView.noLocations" />
                  )}
                </section>
              </CardBody>
            </Collapse>
          </Card>

          <Card className="section services mb-5">
            <CardTitle onClick={this.toggleServices} className="clickable">
              <div className="d-flex justify-content-center align-items-center details-section-title">
                <img src={ServiceLogo} height={25} alt="Service" />
                &nbsp;
                <Translate contentKey="record.singleRecordView.srvDetails" />
                &nbsp;
                <span className="badge badge-light badge-pill">{servicesCount}</span>
              </div>
              {isServicesOpen ? <FontAwesomeIcon icon="angle-up" size="lg" /> : <FontAwesomeIcon icon="angle-down" size="lg" />}
            </CardTitle>
            <Collapse isOpen={isServicesOpen}>
              <CardBody className="details p-0">
                <section className={detailsView ? 'd-none' : ''}>
                  {servicesCount > 0 ? (
                    organization.services.map((srv, idx) => (
                      <div className="d-inline-block col-md-4 col-xs-12 p-0">
                        <Card
                          className="record-card clickable details-card ml-0 mb-3 mr-0 mr-md-3"
                          onClick={() => this.showServiceDetails(idx)}
                        >
                          <CardTitle>
                            <span>
                              <FontAwesomeIcon icon="circle" className="orange" size="xs" />{' '}
                              <b>{srv.name ? srv.name : translate('record.singleRecordView.noServiceName')}</b>
                            </span>
                          </CardTitle>
                          <CardBody>
                            <div className="services pl-2">
                              {srv.taxonomyIds.length > 0 && taxonomyOptions && taxonomyOptions.length > 0 ? (
                                this.taxonomyPills(srv)
                              ) : (
                                <div className="pill">
                                  <span>{translate('record.singleRecordView.untyped')}</span>
                                </div>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <Translate contentKey="record.singleRecordView.noServices" />
                  )}
                </section>
                {servicesCount > 0 ? (
                  <div className={`service p-0 ${detailsView ? '' : 'd-none'}`}>
                    <section className="d-flex top-bar">
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
                          <div className="p-2 mr-1 clickable" onClick={() => this.prevService(servicesCount)}>
                            <FontAwesomeIcon icon={['far', 'arrow-alt-circle-left']} />
                          </div>
                          <div className="d-flex justify-content-center mr-1">
                            <div className="align-self-cente">{currentServiceIdx + 1}</div>
                            <div className="align-self-center mx-2">
                              <Progress value={((currentServiceIdx + 1) / servicesCount) * 100} />
                            </div>
                            <div className="align-self-center">{servicesCount}</div>
                          </div>
                          <div className="p-2 clickable" onClick={() => this.nextService(servicesCount)}>
                            <FontAwesomeIcon icon={['far', 'arrow-alt-circle-right']} />
                          </div>
                          <div className="p-2 clickable" onClick={this.closeServiceDetails}>
                            <FontAwesomeIcon icon={['fas', 'times']} />
                          </div>
                        </div>
                      </div>
                    </section>
                    <section>
                      <h6 className="d-flex align-items-center flex-wrap">
                        <b className="mb-1">
                          <Translate contentKey="record.singleRecordView.srvTypes" />
                        </b>
                        {organization.services[currentServiceIdx].taxonomyIds.length > 0 ? (
                          organization.services[currentServiceIdx].taxonomyIds.map(srvTaxonomy => (
                            <div className="pill mb-1">
                              <span className="ml-1">
                                {taxonomyOptions && taxonomyOptions.length > 0
                                  ? taxonomyOptions.find(taxonomy => taxonomy.value === srvTaxonomy).label
                                  : translate('record.singleRecordView.untyped')}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="pill">
                            <span>{translate('record.singleRecordView.untyped')}</span>
                          </div>
                        )}
                      </h6>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvDescr" />
                        </b>
                      </h6>
                      <span className="word-break-all">{organization.services[currentServiceIdx].description}</span>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvApplication" />
                        </b>
                      </h6>
                      <span className="word-break-all">{organization.services[currentServiceIdx].applicationProcess}</span>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvEligibility" />
                        </b>
                      </h6>
                      <span className="word-break-all">{organization.services[currentServiceIdx].eligibilityCriteria}</span>
                    </section>
                    <section>
                      <h6 className="d-flex align-items-center flex-wrap">
                        <b className="mb-1">
                          <Translate contentKey="record.singleRecordView.srvLocations" />
                        </b>
                        {organization.services[currentServiceIdx].locationIndexes.map(locIdx => (
                          <div className="pill mb-1">
                            <span className="ml-1">
                              <FontAwesomeIcon icon="circle" className="blue" size="xs" />
                              &nbsp;
                              {organization.locations[locIdx].city}, {organization.locations[locIdx].ca}
                            </span>
                          </div>
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
  taxonomyOptions: rootState.taxonomy.providerTaxonomies.map(taxonomy => ({ value: taxonomy.id, label: taxonomy.name }))
});

const mapDispatchToProps = { getProviderEntity, getProviderTaxonomies };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleRecordView);
