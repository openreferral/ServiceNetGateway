import './record-edit.scss';

import React from 'react';
import { Badge, Button, Card, CardBody, CardTitle, Col, Collapse, Label, Row, Progress } from 'reactstrap';
import { TextFormat, Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps, Prompt } from 'react-router-dom';
import { getProviderEntity, updateUserOwnedEntity, deactivateEntity } from 'app/entities/organization/organization.reducer';
import { IRootState } from 'app/shared/reducers';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { US_STATES } from 'app/shared/util/us-states';
import { getProviderTaxonomies } from 'app/entities/taxonomy/taxonomy.reducer';
import _ from 'lodash';
import AvSelect from '@availity/reactstrap-validation-select';
// @ts-ignore
import BuildingLogo from '../../../../static/images/building.svg';
// @ts-ignore
import PeopleLogo from '../../../../static/images/people.svg';
// @ts-ignore
import ServiceLogo from '../../../../static/images/service.svg';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import ConfirmationDialog from 'app/shared/layout/confirmation-dialog';
import { containerStyle, getColumnCount, measureWidths } from 'app/shared/util/measure-widths';
import { ISimpleOrganization } from 'app/shared/model/simple-organization.model';

export interface IRecordEditViewProp extends StateProps, DispatchProps, RouteComponentProps<{id: string}> {}

export interface IRecordEditViewState {
  organization: ISimpleOrganization;
  openSections: string[];
  invalidSections: string[];
  openLocation: number;
  openService: number;
  invalidLocations: number[];
  invalidServices: number[];
  latestDailyUpdate: any;
  openDialogs: string[];
  leaving: boolean;
}

const ORGANIZATION = 'organization';
const LOCATION = 'location';
const SERVICE = 'service';
const MAX_PILLS_WIDTH = 400;

const locationModel = {
  address1: '',
  address2: '',
  city: '',
  ca: 'CA',
  zipcode: ''
};

const serviceModel = {
  locationIndexes: []
};

const TaxonomyOptionPill = taxonomyOption => (
  <div className="pill pill-sm" key={taxonomyOption.value}>
    <span>{taxonomyOption.label}</span>
  </div>
);

const RemainderCount = count => <span className="remainder">+ {count}</span>;
const measureId = idx => 'measure-svc-' + idx;

export class RecordEdit extends React.Component<IRecordEditViewProp, IRecordEditViewState> {
  state: IRecordEditViewState = {
    organization: {
      locations: [{ ...locationModel }],
      services: [{ ...serviceModel }]
    },
    openSections: [],
    invalidSections: [],
    invalidLocations: [],
    invalidServices: [],
    openLocation: -1,
    openService: -1,
    latestDailyUpdate: {},
    openDialogs: [],
    leaving: false
  };

  componentDidMount() {
    this.props.getProviderTaxonomies();
    this.props.getProviderEntity(this.props.match.params.id);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.setState({
        leaving: true
      }, () => this.props.history.push('/'));
    }
  }

  componentDidUpdate(prevProps: Readonly<IRecordEditViewProp>, prevState: Readonly<IRecordEditViewState>) {
    if (prevProps.organization !== this.props.organization) {
      const organization = _.cloneDeep(this.props.organization);
      if (!organization.locations || organization.locations.length === 0) {
        organization.locations = this.state.organization.locations;
      }
      if (!organization.services || organization.services.length === 0) {
        organization.services = this.state.organization.services;
      }
      this.setState({
        organization,
        latestDailyUpdate: this.props.organization.dailyUpdates.find(du => du.expiry === null) || {}
      });
    }
    if (prevProps.taxonomyOptions !== this.props.taxonomyOptions) {
      measureWidths(
        [...this.props.taxonomyOptions.map(item => TaxonomyOptionPill(item))],
        measureId(this.props.match.params.id)
      ).then((taxonomyWidths: any[]) => {
        this.props.taxonomyOptions.forEach((to, i) => to['width'] = taxonomyWidths[i] || 200);
      });
    }
  }

  toggle = section => () => this.setState({
    openSections: _.xor(this.state.openSections, [section])
  });

  saveRecord = (event, errors, values) => {
    const invalidSections = [];
    const invalidLocations = [];
    const invalidServices = [];
    const { openSections } = this.state;
    values.updatedAt = new Date();

    if (errors.length === 0) {
      const entity = {
        ...values
      };
      this.props.updateUserOwnedEntity(entity);
    } else {
      const indexRegexp = /\[?([0-9]+?)\]?/;
      errors.forEach(err => {
        if (err.includes(LOCATION)) {
          invalidSections.indexOf(LOCATION) === -1 && invalidSections.push(LOCATION);
          openSections.indexOf(LOCATION) === -1 && openSections.push(LOCATION);
          const matches = indexRegexp.exec(err);
          if (matches) {
            invalidLocations.push(parseInt(matches[1], 10));
          }
        }
        if (err.includes(SERVICE)) {
          invalidSections.indexOf(SERVICE) === -1 && invalidSections.push(SERVICE);
          openSections.indexOf(SERVICE) === -1 && openSections.push(SERVICE);
          const matches = indexRegexp.exec(err);
          if (matches) {
            invalidServices.push(parseInt(matches[1], 10));
          }
        }
      });
      if (errors.some(err => !err.includes(LOCATION) && !err.includes(SERVICE) && err !== 'name')) {
        invalidSections.push(ORGANIZATION);
        openSections.indexOf(ORGANIZATION) === -1 && openSections.push(ORGANIZATION);
      }
    }
    this.setState({ invalidSections, invalidServices, invalidLocations, openSections });
  };

  openDialog = name => () => {
    this.setState({
      openDialogs: [...this.state.openDialogs, name]
    });
  }

  closeDialog = name => () => {
    this.setState({
      openDialogs: this.state.openDialogs.filter(dialog => dialog !== name)
    });
  };

  handleConfirmDeactivate = () => {
    this.props.deactivateEntity(this.props.match.params.id);
  }

  handleConfirmDiscard = () => {
    this.setState({
      leaving: true
    }, () => this.props.history.goBack());
  }

  addAnotherService = () => {
    const organization = this.state.organization;
    organization.services = organization.services.concat({ ...serviceModel });
    this.setState({
      organization,
      openService: organization.services.length - 1
    });
  };

  addAnotherLocation = () => {
    const organization = this.state.organization;
    organization.locations = organization.locations.concat({ ...locationModel });
    this.setState({
      organization,
      openLocation: organization.locations.length - 1
    });
  };

  removeService = i => () => {
    const { organization } = this.state;
    organization.services.splice(i, 1);
    this.setState({
      organization,
      openService: -1
    });
  };

  removeLocation = i => () => {
    const { organization } = this.state;
    organization.locations.splice(i, 1);
    // filter out this location from services
    organization.services.forEach(service => {
      service['locationIndexes'] = service['locationIndexes']
      .filter(value => value !== i)
      .map(idx => (idx > i) ? idx - 1 : idx);
    });
    this.setState({
      organization,
      openLocation: -1
    });
  };

  getLocations = () =>
    this.state.organization.locations.map((location, i) => (
      { value: i, label: (i + 1) + '. ' + [location['address1'], location['address2'], location['city']].filter(item => item).join(', ') }
    ));

  onOrganizationChange = fieldName => ({ target }) => {
    const organization = this.state.organization;
    organization[fieldName] = target.value;
    this.setState({
      organization
    });
  };

  onLocationChange = (i, fieldName) => ({ target }) => {
    const organization = this.state.organization;
    organization.locations[i][fieldName] = target.value;
    this.setState({
      organization
    });
  };

  onServiceChange = (i, fieldName, defaultValue = null) => event => {
    const organization = this.state.organization;
    let value = (event != null && event.target) ? event.target.value : event;
    if (value == null) {
      value = defaultValue;
    }
    organization.services[i][fieldName] = value;
    this.setState({
      organization
    });
  };

  openLocation = i => () => {
    this.setState({
      openLocation: i
    });
  }

  openService = i => () => {
    this.setState({
      openService: i
    });
  }

  taxonomyPills = service => {
    const taxonomyOptions = this.props.taxonomyOptions.filter(to =>
      service['taxonomyIds'] && service['taxonomyIds'].indexOf(to.value) !== -1);
    const widths = taxonomyOptions.map(to => to['width']);
    const itemCount = getColumnCount(widths, MAX_PILLS_WIDTH) || 0;
    return <div className="pills record-card">{taxonomyOptions.slice(0, itemCount).map(to => (
      <div className="pill pill-sm" key={to.value}>
        <span>{to.label}</span>
      </div>
    ))}
      {(itemCount < taxonomyOptions.length) ? RemainderCount(taxonomyOptions.length - itemCount) : ''}
    </div>;
  }

  render() {
    const { openSections, organization, openLocation, openService, latestDailyUpdate,
      invalidSections, invalidLocations, invalidServices, leaving } = this.state;
    const { updating, taxonomyOptions } = this.props;
    const { locations, services } = organization;
    return organization.id && organization.id === this.props.match.params.id ? (
      <AvForm onSubmit={this.saveRecord} className="record-edit background" model={organization}>
        <Prompt
          when={!leaving && !_.isEqual(organization, this.props.organization)}
          message={location => `You have unsaved data, are you sure you want to leave?`}
        />
        <div id={measureId(this.props.match.params.id)} style={containerStyle} />
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <AvField name="id" value={organization.id} className="d-none" />
          <Card className="section">
            <CardTitle>
              <Translate contentKey="record.edit.title" />
            </CardTitle>
            <CardBody>
              <AvField
                id="organization-name"
                type="text"
                name="name"
                validate={{
                  required: { value: true, errorMessage: translate('entity.validation.required') }
                }}
                placeholder={translate('record.name')}
                onChange={this.onOrganizationChange('name')}
              />
            </CardBody>
          </Card>
          <Card className="section">
            <CardTitle className="d-block">
              <div className="d-inline-block"><Translate contentKey="record.edit.dailyUpdatesQuestion" /></div>
              <div className="d-inline-block">
                &nbsp;(<Translate contentKey="record.edit.lastUpdated" />:&nbsp;
                {latestDailyUpdate.createdAt ? (
                  <TextFormat value={latestDailyUpdate.createdAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                ) : (
                  <Translate contentKey="recordCard.unknown" />
                )})
              </div>
            </CardTitle>
            <CardBody>
              <AvInput
                id="daily-update"
                type="textarea"
                name="update"
                value={latestDailyUpdate.update}
                onChange={this.onOrganizationChange('update')}
              />
            </CardBody>
          </Card>
          <Card className="section expandable">
            <CardTitle onClick={this.toggle(ORGANIZATION)} className="clickable">
              <img src={PeopleLogo} height={25} alt="Organization" />
              <Translate contentKey="record.edit.updateOrganizationDetails" />
              <FontAwesomeIcon icon={openSections.includes(ORGANIZATION) ? 'angle-up' : 'angle-down'} className="pull-right" size="lg"/>
            </CardTitle>
            <Collapse isOpen={openSections.includes(ORGANIZATION)}>
              <CardBody>
                <AvGroup>
                  <Label>{translate('record.description')}</Label>
                  <AvInput
                    id="organization-description"
                    type="textarea"
                    name="description"
                    onChange={this.onOrganizationChange('description')}
                  />
                </AvGroup>
                <AvGroup>
                  <Label>{translate('record.url')}</Label>
                  <AvField
                    id="organization-url"
                    type="text"
                    name="url"
                    onChange={this.onOrganizationChange('url')}
                  />
                </AvGroup>
                <AvGroup>
                  <Label>{translate('record.email')}</Label>
                  <AvField
                    id="organization-email"
                    type="text"
                    name="email"
                    validate={{
                      maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
                    }}
                    onChange={this.onOrganizationChange('email')}
                  />
                </AvGroup>
              </CardBody>
            </Collapse>
          </Card>
          <Card className="section expandable locations">
            <CardTitle onClick={this.toggle(LOCATION)} className="clickable">
              <img src={BuildingLogo} height={25} alt="Location" />
              <Translate contentKey="record.location.details"/>
              <Badge color="light" pill>{locations.length}</Badge>
              <FontAwesomeIcon icon={openSections.includes(LOCATION) ? 'angle-up' : 'angle-down'} className="pull-right" size="lg"/>
            </CardTitle>
            <Collapse isOpen={openSections.includes(LOCATION)}>
              <div>
                <div className={openLocation !== -1 ? 'd-flex top-bar' : 'd-none'}>
                  <div onClick={this.openLocation(-1)} className="clickable">
                    <FontAwesomeIcon icon="arrow-left" />&nbsp;
                    <Translate contentKey="record.location.back"/>
                  </div>
                  <div className="d-flex pull-right">
                    <div onClick={this.openLocation((openLocation > 0) ? openLocation - 1 : locations.length - 1)} className="clickable" >
                      <FontAwesomeIcon icon={['far', 'arrow-alt-circle-left']} />
                    </div>
                    <div className="align-self-center ml-1">{openLocation + 1}</div>
                    <div className="mx-2 align-self-center">
                      <Progress value={((openLocation + 1) / locations.length) * 100} />
                    </div>
                    <div className="align-self-center mr-1">{locations.length}</div>
                    <div onClick={this.openLocation((openLocation < locations.length - 1) ? openLocation + 1 : 0)} className="clickable">
                      <FontAwesomeIcon icon={['far', 'arrow-alt-circle-right']} />
                    </div>
                  </div>
                </div>
                <CardBody>
                  {locations && locations.map((location, i) =>
                      <div key={'location-' + i} className={openLocation === -1 ? 'd-inline-block' : 'd-block'}>
                      <Card className={openLocation === -1 ? invalidLocations.includes(i) ? 'invalid clickable card-sm' : 'clickable card-sm' : 'd-none'}>
                        <CardBody onClick={this.openLocation(i)} className={'location d-flex flex-row'}>
                          <div className="card-left">
                            <FontAwesomeIcon icon="pencil-alt" />
                          </div>
                          <div className="card-right">
                            <div>
                              <div className="card-heading">
                                <FontAwesomeIcon icon={faCircle} className="edit" /> {location['city']}, {location['ca']}
                              </div>
                              <div>{location['address1']}</div>
                              <div>{location['address2']}</div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      <div className={openLocation === i ? 'location-details' : 'd-none'}>
                        {location['id'] ? <AvField name={'locations[' + i + '].id'} value={location['id']} className="d-none" /> : ''}
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.location.address1')}</Label>
                          </div>
                          <AvInput
                            type="textarea"
                            name={'locations[' + i + '].address1'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onLocationChange(i, 'address1')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.location.address2')}</Label>
                          <AvInput
                            type="textarea"
                            name={'locations[' + i + '].address2'}
                            onChange={this.onLocationChange(i, 'address2')}
                          />
                        </AvGroup>
                        <Row>
                          <Col md={7} className="flex mb-3">
                            <div className="required" />
                            <AvInput
                              type="text"
                              name={'locations[' + i + '].city'}
                              onChange={this.onLocationChange(i, 'city')}
                              placeholder={translate('record.location.city')}
                              validate={{
                                required: { value: true, errorMessage: translate('entity.validation.required') }
                              }}
                            />
                          </Col>
                          <Col md={2} className="flex mb-3">
                            <div className="required" />
                            <AvField
                              type="select"
                              name={'locations[' + i + '].ca'}
                              onChange={this.onLocationChange(i, 'ca')}
                              placeholder={translate('record.location.ca')}
                              value={location['ca'] || locationModel['ca']}
                              validate={{
                                required: { value: true, errorMessage: translate('entity.validation.required') }
                              }}
                              style={{ 'minWidth': '5em' }}
                            >
                              {US_STATES.map(state => (
                                <option value={state} key={state}>
                                  {state}
                                </option>
                              ))}
                            </AvField>
                          </Col>
                          <Col md={3} className="flex mb-3">
                            <div className="required" />
                            <AvInput
                              type="text"
                              name={'locations[' + i + '].zipcode'}
                              onChange={this.onLocationChange(i, 'zipcode')}
                              placeholder={translate('record.location.zipcode')}
                              validate={{
                                required: { value: true, errorMessage: translate('entity.validation.required') }
                              }}
                            />
                          </Col>
                        </Row>
                        <div className="buttons">
                          <Button onClick={this.removeLocation(i)}>
                            <FontAwesomeIcon icon="trash" />
                            &nbsp;
                            <Translate contentKey="record.location.remove"/>
                          </Button>
                          <Button onClick={this.openLocation(-1)} className="pull-right">
                            <Translate contentKey="record.navigation.done" />
                          </Button>
                        </div>
                      </div>
                  </div>
                  )}
                  <div className={openLocation === -1 ? 'buttons list-buttons' : 'd-none'}>
                    <Button onClick={this.addAnotherLocation} className="add-another">
                      + <Translate contentKey="record.location.add" />
                    </Button>
                  </div>
                </CardBody>
              </div>
            </Collapse>
          </Card>
          <Card className="section expandable services">
            <CardTitle onClick={this.toggle(SERVICE)} className="clickable">
              <img src={ServiceLogo} height={25} alt="Service" />
              <Translate contentKey="record.service.details"/>
              <Badge color="light" pill>{services.length}</Badge>
              <FontAwesomeIcon icon={openSections.includes(SERVICE) ? 'angle-up' : 'angle-down'} className="pull-right" size="lg"/>
            </CardTitle>
            <Collapse isOpen={openSections.includes(SERVICE)}>
              <div>
                <div className={openService !== -1 ? 'd-flex top-bar' : 'd-none'}>
                  <div onClick={this.openService(-1)} className="clickable">
                    <FontAwesomeIcon icon="arrow-left" />&nbsp;
                    <Translate contentKey="record.service.back"/>
                  </div>
                  <div className="d-flex pull-right">
                    <div onClick={this.openService((openService > 0) ? openService - 1 : services.length - 1)} className="clickable" >
                      <FontAwesomeIcon icon={['far', 'arrow-alt-circle-left']} />
                    </div>
                    <div className="align-self-center ml-1">{openService + 1}</div>
                    <div className="mx-2 align-self-center">
                      <Progress value={((openService + 1) / services.length) * 100} />
                    </div>
                    <div className="align-self-center mr-1">{services.length}</div>
                    <div onClick={this.openService((openService < services.length - 1) ? openService + 1 : 0)} className="clickable">
                      <FontAwesomeIcon icon={['far', 'arrow-alt-circle-right']} />
                    </div>
                  </div>
                </div>
                <CardBody>
                  {services && services.map((service, i) =>
                    <div key={'service-' + i} className={openService === -1 ? 'd-inline-block' : 'd-block'}>
                      <Card className={openService === -1 ? invalidServices.includes(i) ? 'invalid clickable card-sm' : 'clickable card-sm' : 'd-none'}>
                        <CardBody onClick={this.openService(i)} className={'service d-flex flex-row'}>
                          <div className="card-left">
                            <FontAwesomeIcon icon="pencil-alt" />
                          </div>
                          <div className="card-right">
                            <div>
                              <div className="card-heading">
                                <FontAwesomeIcon icon={faCircle} className="edit" /> {service['name']}
                              </div>
                              {this.taxonomyPills(service)}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      <div className={openService === i ? 'service-details' : 'd-none'}>
                        {service['id'] ? <AvField name={'services[' + i + '].id'} value={service['id']} className="d-none" /> : ''}
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.service.name')}</Label>
                          </div>
                          <AvInput
                            type="text"
                            name={'services[' + i + '].name'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onServiceChange(i, 'name')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.service.type')}</Label>
                          </div>
                          <AvSelect
                            name={'services[' + i + '].taxonomyIds'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            options={taxonomyOptions}
                            onChange={this.onServiceChange(i, 'taxonomyIds')}
                            // @ts-ignore
                            isMulti
                          />
                        </AvGroup>
                        <AvGroup>
                          <div className="flex">
                            <div className="required" />
                            <Label>{translate('record.service.description')}</Label>
                          </div>
                          <AvInput
                            type="textarea"
                            name={'services[' + i + '].description'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onServiceChange(i, 'description')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.service.applicationProcess')}</Label>
                          <AvInput
                            type="textarea"
                            name={'services[' + i + '].applicationProcess'}
                            onChange={this.onServiceChange(i, 'applicationProcess')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.service.eligibilityCriteria')}</Label>
                          <AvInput
                            type="textarea"
                            name={'services[' + i + '].eligibilityCriteria'}
                            onChange={this.onServiceChange(i, 'eligibilityCriteria')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label>{translate('record.service.locations')}</Label>
                          <AvSelect
                            name={'services[' + i + '].locationIndexes'}
                            value={(services.length > i) ? services[i]['locationIndexes'] : []}
                            onChange={this.onServiceChange(i, 'locationIndexes', [])}
                            options={this.getLocations()}
                            // @ts-ignore
                            isMulti
                          />
                        </AvGroup>
                        <div className="buttons">
                          <Button onClick={this.removeService(i)}>
                            <FontAwesomeIcon icon="trash" />
                            &nbsp;
                            <Translate contentKey="record.service.remove"/>
                          </Button>
                          <Button onClick={this.openService(-1)} className="pull-right">
                            <Translate contentKey="record.navigation.done" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={openService === -1 ? 'buttons list-buttons' : 'd-none'}>
                    <Button onClick={this.addAnotherService} className="add-another">
                      + <Translate contentKey="record.service.add" />
                    </Button>
                  </div>
                </CardBody>
              </div>
            </Collapse>
          </Card>
          <div className="buttons navigation-buttons">
            {this.state.openDialogs.indexOf('deactivate') !== -1 && (
              <ConfirmationDialog
                question={translate('record.deactivateQuestion')}
                handleClose={this.closeDialog('deactivate')}
                handleConfirm={this.handleConfirmDeactivate}
              />
            )}
            <Button onClick={this.openDialog('deactivate')} className="deactivate">
              <Translate contentKey="record.navigation.deactivate" />
            </Button>
            <div className="pull-right">
              {this.state.openDialogs.indexOf('discard') !== -1 && (
                <ConfirmationDialog
                  question={translate('record.discardQuestion')}
                  handleClose={this.closeDialog('discard')}
                  handleConfirm={this.handleConfirmDiscard}
                />
              )}
              <Button onClick={this.openDialog('discard')} className="go-back">
                <Translate contentKey="record.navigation.discard" />
              </Button>
              <Button id="submit" type="submit" disabled={updating} color="primary">
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="record.navigation.submit" />
              </Button>
            </div>
          </div>
        </div>
      </AvForm>
    ) : '';
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  locations: storeState.location.entities,
  updating: storeState.organization.updating,
  updateSuccess: storeState.organization.updateSuccess,
  organization: storeState.organization.providersEntity,
  taxonomyOptions: storeState.taxonomy.providerTaxonomies.map(
    taxonomy => ({ value: taxonomy.id, label: taxonomy.name }))
});

const mapDispatchToProps = {
  getProviderTaxonomies,
  updateUserOwnedEntity,
  getProviderEntity,
  deactivateEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordEdit);
