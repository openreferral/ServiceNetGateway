import './single-record-view.scss';

import React from 'react';
import { Collapse, Button, CardBody, Card, CardTitle, Progress } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getProviderEntity } from 'app/entities/organization/organization.reducer';
// @ts-ignore
import BuildingLogo from '../../../../static/images/building.svg';
// @ts-ignore
import PeopleLogo from '../../../../static/images/people.svg';
// @ts-ignore
import ServiceLogo from '../../../../static/images/service.svg';

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
}

class SingleRecordView extends React.Component<ISingleRecordViewProps, ISingleRecordViewState> {
  state: ISingleRecordViewState = {
    serviceWidths: [],
    locationWidths: [],
    isOrganizationOpen: false,
    isServicesOpen: false,
    isLocationsOpen: false,
    currentServiceIdx: 0,
    detailsView: false
  };

  toggleOrganization = () => this.setState({ isOrganizationOpen: !this.state.isOrganizationOpen });
  toggleServices = () => this.setState({ isServicesOpen: !this.state.isServicesOpen, detailsView: false });
  toggleLocations = () => this.setState({ isLocationsOpen: !this.state.isLocationsOpen });

  componentDidMount() {
    this.props.getProviderEntity(this.props.match.params.orgId);
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

  render() {
    const { isOrganizationOpen, isServicesOpen, isLocationsOpen, currentServiceIdx, detailsView } = this.state;
    const { organization } = this.props;
    const locationsCount = organization && organization.locations ? organization.locations.length : 0;
    const servicesCount = organization && organization.services ? organization.services.length : 0;

    return (
      <div className="background single-record-view">
        <Button tag={Link} to="/" color="" className="d-none d-sm-block position-fixed go-back">
          <FontAwesomeIcon icon="angle-left" />
          &nbsp;
          <Translate contentKey="record.singleRecordView.back" />
        </Button>
        <div className="col-md-8 offset-md-2 card-section">
          <Card className="record-card">
            <CardTitle className="card-title">
              <div className="d-flex w-100 justify-content-between">
                <div>
                  {organization.name}
                  <section className="services pt-2">
                    {servicesCount > 0
                      ? organization.services.map(service => (
                          <div className="pill">
                            <span>{service.name}</span>
                          </div>
                        ))
                      : null}
                  </section>
                </div>
                <img src={PeopleLogo} height={100} alt="Organization" className="d-none d-sm-block mx-5" />
              </div>
            </CardTitle>
            <CardBody>
              <section className="locations p-2">
                {locationsCount > 0
                  ? organization.locations.map(location => (
                      <div className="location">
                        <span>
                          <FontAwesomeIcon icon="circle" className="blue" /> {location.city}, {location.ca}
                        </span>
                      </div>
                    ))
                  : null}
              </section>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-8 offset-md-2 card-section">
          <Card className="record-card">
            <CardTitle className="card-title">
              <Translate contentKey="record.singleRecordView.dailyUpdates" />
            </CardTitle>
            <CardBody>
              {organization && organization.dailyUpdates && organization.dailyUpdates.length > 0 ? (
                organization.dailyUpdates.map(dailyUpdate => <span key={dailyUpdate.id}>{dailyUpdate.update}</span>)
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
                <section className="row row-cols-2 col-12 offset-md-2">
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
                <section className={`row row-cols-2 col-12 offset-md-2 ${detailsView ? 'd-none' : ''}`}>
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
                          <span className="pill">{srv.type ? srv.type : translate('record.singleRecordView.untyped')}</span>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <Translate contentKey="record.singleRecordView.noServices" />
                  )}
                </section>
                {servicesCount > 0 ? (
                  <div className={`service p-0 ${detailsView ? '' : 'd-none'}`}>
                    <section className="header d-flex justify-content-between align-items-center">
                      <div className="d-flex justify-content-between align-items-center">
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
                      <div className="d-flex justify-content-between align-items-center">
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
                        <div className="p-2 mr-5 arrow-navigation" onClick={() => this.nextService(servicesCount)}>
                          <FontAwesomeIcon icon="angle-right" size="lg" />
                        </div>
                        <div className="p-2 arrow-navigation" onClick={this.closeServiceDetails}>
                          <FontAwesomeIcon icon="times" size="lg" />
                        </div>
                      </div>
                    </section>
                    <section>
                      <h6>
                        <b>
                          <Translate contentKey="record.singleRecordView.srvTypes" />
                        </b>
                        <span className="pill ml-2">
                          {organization.services[currentServiceIdx].type
                            ? organization.services[currentServiceIdx].type
                            : translate('record.singleRecordView.untyped')}
                        </span>
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
                          <span className="pill ml-2">
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
  organization: rootState.organization.providersEntity
});

const mapDispatchToProps = { getProviderEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleRecordView);
