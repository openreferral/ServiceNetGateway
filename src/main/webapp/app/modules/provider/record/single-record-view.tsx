import './single-record-view.scss';

import React from 'react';
import { Collapse, Button, CardBody, Card, CardTitle } from 'reactstrap';
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
}

class SingleRecordView extends React.Component<ISingleRecordViewProps, ISingleRecordViewState> {
  state: ISingleRecordViewState = {
    serviceWidths: [],
    locationWidths: [],
    isOrganizationOpen: false,
    isServicesOpen: false,
    isLocationsOpen: false
  };

  toggleOrganization = () => this.setState({ isOrganizationOpen: !this.state.isOrganizationOpen });
  toggleServices = () => this.setState({ isServicesOpen: !this.state.isServicesOpen });
  toggleLocations = () => this.setState({ isLocationsOpen: !this.state.isLocationsOpen });

  componentDidMount() {
    this.props.getProviderEntity(this.props.match.params.orgId);
  }

  render() {
    const { isOrganizationOpen, isServicesOpen, isLocationsOpen } = this.state;
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
        <div className="col-md-8 offset-md-2 section">
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

        <div className="col-md-8 offset-md-2 section">
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

        <div className="col-md-8 offset-md-2 section">
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
              <CardBody className="details">
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

        <div className="col-md-8 offset-md-2 section">
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
                      <Card className="record-card detail-card col-md-4 col-xs-12 mb-2 mx-2 pt-3">
                        <CardTitle>
                          <span>
                            <FontAwesomeIcon icon="circle" className="blue" />{' '}
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
                <section className="row row-cols-2 col-12 offset-md-2">
                  {servicesCount > 0 ? (
                    organization.services.map(srv => (
                      <Card className="record-card detail-card col-md-4 col-xs-12 mb-2 mx-2 pt-3">
                        <CardTitle>
                          <span>
                            <FontAwesomeIcon icon="circle" className="orange" />{' '}
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
