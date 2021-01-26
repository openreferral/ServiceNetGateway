import './record-shared.scss';
import './record-create.scss';

import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Col, Row, Label } from 'reactstrap';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
// tslint:disable-next-line:no-submodule-imports
import Input from 'react-phone-number-input/input';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Prompt, RouteComponentProps } from 'react-router-dom';
import { createUserOwnedEntity } from 'app/entities/organization/organization.reducer';
import { IRootState } from 'app/shared/reducers';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { US_STATES } from 'app/shared/util/us-states';
import { getProviderTaxonomies } from 'app/entities/taxonomy/taxonomy.reducer';
import AvSelect from '@availity/reactstrap-validation-select';
import 'lazysizes';
// tslint:disable-next-line:no-submodule-imports
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
// @ts-ignore
import BuildingLogo from '../../../../static/images/building.svg';
// @ts-ignore
import PeopleLogo from '../../../../static/images/people.svg';
// @ts-ignore
import ServiceLogo from '../../../../static/images/service.svg';
import _ from 'lodash';
import ButtonPill from '../shared/button-pill';
import { OpeningHours } from 'app/modules/provider/record/opening-hours';

export interface IRecordCreateViewProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export interface IRecordCreateViewState {
  organization: any;
  activeTab: string;
  locationCount: number;
  locations: any[];
  services: any[];
  serviceCount: number;
  invalidTabs: string[];
  leaving: boolean;
  openingHoursByLocation: any;
  datesClosedByLocation: any;
}

const ORGANIZATION_TAB = 'organization';
const LOCATION_TAB = 'location';
const SERVICE_TAB = 'service';

const locationModel = {
  address1: '',
  address2: '',
  city: '',
  ca: 'CA',
  zipcode: '',
  isRemote: false
};
const initialLocations = [{ ...locationModel }];
const DEFAULT_OPENING_HOURS = [
  {
    from: '09:00 AM',
    to: '05:00 PM',
    activeDays: [1, 2, 3, 4, 5]
  }
];

const serviceModel = {
  name: '',
  taxonomyIds: [],
  description: '',
  applicationProcess: '',
  eligibilityCriteria: '',
  locationIndexes: [],
  docs: [],
  phones: []
};
const initialServices = [{ ...serviceModel }];

const organizationModel = {
  name: '',
  description: '',
  url: '',
  email: '',
  onlyRemote: false
};

export class RecordCreate extends React.Component<IRecordCreateViewProp, IRecordCreateViewState> {
  state: IRecordCreateViewState = {
    activeTab: ORGANIZATION_TAB,
    locationCount: 1,
    serviceCount: 1,
    organization: _.cloneDeep(organizationModel),
    locations: _.cloneDeep(initialLocations),
    services: _.cloneDeep(initialServices),
    invalidTabs: [],
    leaving: false,
    openingHoursByLocation: {},
    datesClosedByLocation: {}
  };

  componentDidMount() {
    this.props.getProviderTaxonomies();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.setState(
        {
          leaving: true
        },
        () => this.props.history.push('/')
      );
    }
  }

  setOnlyHeadLocation = () => {
    const { locations, services, organization, openingHoursByLocation, datesClosedByLocation } = this.state;
    services.forEach(service => (service['locationIndexes'] = []));
    this.setState({
      locationCount: 1,
      locations: [{ ...locations[0] }],
      services,
      openingHoursByLocation: { 0: openingHoursByLocation[0] },
      datesClosedByLocation: { 0: datesClosedByLocation[0] },
      organization: {
        ...organization,
        onlyRemote: !organization.onlyRemote
      }
    });
  };

  toggle(activeTab) {
    if (activeTab !== this.state.activeTab) {
      this.setState({
        activeTab
      });
    }
  }

  isOrgPhoneInvalid = organization => {
    const phoneNumber = _.get(organization, 'phones[0].number', '');
    return phoneNumber && !isPossiblePhoneNumber(phoneNumber);
  };

  areServicePhonesInvalid = services =>
    _.some(services, service => {
      const phone = _.get(service, `phones[0].number`, '');
      return phone && !isPossiblePhoneNumber(phone);
    });

  saveRecord = (event, errors, values) => {
    const { openingHoursByLocation, datesClosedByLocation, organization, services, locations } = this.state;
    values.updatedAt = new Date();
    const entityWithServicesAndLocation = { ...values };
    _.forEach(services, (service, i) => {
      entityWithServicesAndLocation['services'][i] = services[i];
    });
    _.forEach(locations, (location, i) => {
      entityWithServicesAndLocation['locations'][i] = {
        ...entityWithServicesAndLocation['locations'][i],
        ...locations[i]
      };
    });

    const invalidTabs = [];
    const isOrganizationPhoneValid = !this.isOrgPhoneInvalid(organization);
    const areServicePhonesValid = !this.areServicePhonesInvalid(services);
    if (errors.length === 0 && isOrganizationPhoneValid && areServicePhonesValid) {
      const entity = {
        ...entityWithServicesAndLocation,
        openingHoursByLocation,
        datesClosedByLocation,
        phones: _.get(organization, 'phones', [])
      };
      this.props.createUserOwnedEntity(entity);
    } else {
      if (!isOrganizationPhoneValid) {
        invalidTabs.push(ORGANIZATION_TAB);
      }
      if (!areServicePhonesValid) {
        invalidTabs.push(SERVICE_TAB);
      }
      if (errors.some(err => err.includes(LOCATION_TAB))) {
        invalidTabs.push(LOCATION_TAB);
      }
      if (errors.some(err => err.includes(SERVICE_TAB))) {
        invalidTabs.push(SERVICE_TAB);
      }
      if (errors.some(err => !err.includes(LOCATION_TAB) && !err.includes(SERVICE_TAB))) {
        invalidTabs.push(ORGANIZATION_TAB);
      }
    }
    this.setState({ invalidTabs });
  };

  onLocationRemoteChange = i => () => {
    const locations = this.state.locations;
    locations[i].isRemote = !locations[i].isRemote;
    this.setState({
      locations
    });
  };

  addAnotherService = () => {
    const services = this.state.services.concat({ ...serviceModel });
    this.setState({
      serviceCount: this.state.serviceCount + 1,
      services
    });
  };

  addAnotherLocation = () => {
    const locations = this.state.locations.concat({ ...locationModel });
    this.setState({
      locationCount: this.state.locationCount + 1,
      locations
    });
  };

  removeService = () => {
    const { serviceCount, services } = this.state;
    if (serviceCount > 1) {
      services.pop();
      this.setState({
        serviceCount: serviceCount - 1,
        services
      });
    }
  };

  removeLocation = () => {
    const { locationCount, locations, services } = this.state;
    if (locationCount > 1) {
      locations.pop();
      // filter out this location from services
      services.forEach(service => (service['locationIndexes'] = service['locationIndexes'].filter(value => value !== locations.length)));
      this.setState({
        locationCount: locationCount - 1,
        locations,
        services
      });
    }
  };

  getLocations = () =>
    Array.apply(null, { length: this.state.locationCount }).map((e, i) => {
      const location = this.state.locations[i];
      return {
        value: i,
        label: i + 1 + '. ' + [location['address1'], location['address2'], location['city']].filter(item => item).join(', ')
      };
    });

  onOrganizationChange = fieldName => ({ target }) => {
    const organization = this.state.organization;
    organization[fieldName] = target.value;
    this.setState({
      organization
    });
  };

  onLocationChange = (i, fieldName) => ({ target }) => {
    const locations = this.state.locations;
    locations[i][fieldName] = target.value;
    this.setState({
      locations
    });
  };

  onServiceChange = (i, fieldName, defaultValue = null) => event => {
    const services = this.state.services;
    let value = event != null && event.target ? event.target.value : event;
    if (value === null) {
      value = defaultValue;
    }
    services[i][fieldName] = value;
    this.setState({
      services
    });
  };

  onServiceDocsChange = i => event => {
    const { services } = this.state;
    const value = event != null && event.target ? event.target.value : event;
    if (services[i].docs.length === 0) {
      services[i].docs.push({ document: value, id: null });
    } else {
      services[i].docs[0] = { ...services[i].docs[0], document: value };
    }
    this.setState({ services });
  };

  updateLocationData = idx => (openingHours, datesClosed) => {
    const { openingHoursByLocation, datesClosedByLocation } = this.state;
    openingHoursByLocation[idx] = openingHours;
    datesClosedByLocation[idx] = datesClosed;
    this.setState({
      openingHoursByLocation,
      datesClosedByLocation
    });
  };

  setPhone = phoneNumber => {
    const organization = this.state.organization;
    organization['phones'] = [{ number: phoneNumber }];
    this.setState({
      organization
    });
  };

  setServicePhone = i => phoneNumber => {
    const services = this.state.services;
    services[i]['phones'] = [{ number: phoneNumber }];
    this.setState({
      services
    });
  };

  handleIsOrgRemoteChange = e => {
    const { organization } = this.state;
    if (!organization.onlyRemote) {
      this.setOnlyHeadLocation();
    } else {
      this.setState({ organization: { ...organization, onlyRemote: !organization.onlyRemote } });
    }
  };

  locationTab = () => {
    const { locationCount, organization } = this.state;
    const isOrgRemote = _.get(organization, 'onlyRemote', false);
    return (
      <Col md={{ size: 10, offset: 1 }}>
        <div className="heading">
          <img data-src={BuildingLogo} height={100} className="lazyload" alt="Location" />
          <h2>
            <Translate contentKey="record.heading.locations" />
          </h2>

          <div className="description">
            <Translate contentKey="record.heading.locationsDescription" />
          </div>
        </div>
        <Row id="remote-only-row">
          <Col md={{ size: 11, offset: 1 }}>
            <AvGroup check className="flex">
              <Label check for="onlyRemote">
                {translate('record.remoteOnly')}
              </Label>
              <AvInput id="onlyRemote" type="checkbox" name="onlyRemote" onChange={this.handleIsOrgRemoteChange} value={isOrgRemote} />
            </AvGroup>
          </Col>
        </Row>
        {isOrgRemote ? (
          <div className="mt-4" style={{ marginBottom: '-1rem' }}>
            <Row id="whereIsYourHeadquarters" noGutters>
              <Col md={{ size: 11, offset: 1 }}>
                <Translate contentKey="record.location.whereIsYourHeadquarters" />
              </Col>
            </Row>
          </div>
        ) : null}
        {Array.apply(null, { length: locationCount }).map((e, i) => {
          const { locations } = this.state;
          const isLocationRemote = locations[i].isRemote;
          return (
            <Row key={`location-${i}`} className="item location">
              <Col md={1}>{!isOrgRemote ? <h4>{i + 1}.</h4> : null}</Col>
              <Col md={11}>
                <AvGroup className="flex">
                  <div className={`${!isOrgRemote ? 'required' : ''}`} />
                  <Label className="sr-only" for={'location-id[' + i + '].address1'}>
                    {translate('record.location.address1')}
                  </Label>
                  <AvInput
                    id={'location-id[' + i + '].address1'}
                    type="textarea"
                    name={'locations[' + i + '].address1'}
                    onChange={this.onLocationChange(i, 'address1')}
                    placeholder={translate('record.location.address1')}
                    validate={{
                      required: { value: !isOrgRemote, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label className="sr-only" for={'location-id[' + i + '].address2'}>
                    {translate('record.location.address2')}
                  </Label>
                  <AvInput
                    id={'location-id[' + i + '].address2'}
                    type="textarea"
                    name={'locations[' + i + '].address2'}
                    onChange={this.onLocationChange(i, 'address2')}
                    placeholder={translate('record.location.address2')}
                  />
                </AvGroup>
                <Row>
                  <Col md={7} className="flex mb-3">
                    <div className={`${!isOrgRemote ? 'required' : ''}`} />
                    <Label className="sr-only" for={'location-id[' + i + '].city'}>
                      {translate('record.location.city')}
                    </Label>
                    <AvInput
                      id={'location-id[' + i + '].city'}
                      type="text"
                      name={'locations[' + i + '].city'}
                      onChange={this.onLocationChange(i, 'city')}
                      placeholder={translate('record.location.city')}
                      validate={{
                        required: { value: !isOrgRemote, errorMessage: translate('entity.validation.required') }
                      }}
                    />
                  </Col>
                  <Col md={2} className="flex mb-3">
                    <div className={`${!isOrgRemote ? 'required' : ''}`} />
                    <Label className="sr-only" for={'location-id[' + i + '].ca'}>
                      {translate('entity.validation.required')}
                    </Label>
                    <AvField
                      id={'location-id[' + i + '].ca'}
                      type="select"
                      name={'locations[' + i + '].ca'}
                      onChange={this.onLocationChange(i, 'ca')}
                      placeholder={translate('record.location.ca')}
                      value={locationModel['ca']}
                      validate={{
                        required: { value: !isOrgRemote, errorMessage: translate('entity.validation.required') }
                      }}
                      style={{ minWidth: '5em' }}
                    >
                      {US_STATES.map(state => (
                        <option value={state} key={state}>
                          {state}
                        </option>
                      ))}
                    </AvField>
                  </Col>
                  <Col md={3} className="flex mb-3">
                    <div className={`${!isOrgRemote ? 'required' : ''}`} />
                    <Label className="sr-only" for={'location-id[' + i + '].zipcode'}>
                      {translate('record.location.zipcode')}
                    </Label>
                    <AvInput
                      id={'location-id[' + i + '].zipcode'}
                      type="text"
                      name={'locations[' + i + '].zipcode'}
                      onChange={this.onLocationChange(i, 'zipcode')}
                      placeholder={translate('record.location.zipcode')}
                      validate={{
                        required: { value: !isOrgRemote, errorMessage: translate('entity.validation.required') }
                      }}
                    />
                  </Col>
                  {!isOrgRemote ? (
                    <Col md={7} className="flex mb-3">
                      <AvGroup check className="flex">
                        <Label check for={'location-id[' + i + '].isRemote'}>
                          {translate('record.location.isRemote')}
                        </Label>
                        <AvInput
                          id={'location-id[' + i + '].isRemote'}
                          type="checkbox"
                          name={'locations[' + i + '].isRemote'}
                          value={isLocationRemote}
                          onChange={this.onLocationRemoteChange(i)}
                        />
                      </AvGroup>
                    </Col>
                  ) : null}
                </Row>
                <OpeningHours
                  location={locations[i]}
                  locationIndex={i}
                  openingHours={this.state.openingHoursByLocation[i] || [{}]}
                  datesClosed={this.state.datesClosedByLocation[i] || [null]}
                  updateLocationData={this.updateLocationData(i)}
                  defaultOpeningHours={DEFAULT_OPENING_HOURS}
                />
              </Col>
            </Row>
          );
        })}
      </Col>
    );
  };

  render() {
    const { organization, locations, services, activeTab, invalidTabs, serviceCount, leaving } = this.state;
    const phoneNumber = _.get(organization, 'phones[0].number', '');
    const { updating, taxonomyOptions } = this.props;
    const onlyRemote = _.get(organization, 'onlyRemote', false);
    return (
      <div className="record-shared record-create">
        <Nav tabs>
          <NavItem className={`${invalidTabs.includes(ORGANIZATION_TAB) ? 'invalid' : ''}`}>
            <NavLink
              className={`text-nowrap ${activeTab === ORGANIZATION_TAB ? 'active' : ''}`}
              onClick={() => this.toggle(ORGANIZATION_TAB)}
            >
              <Translate contentKey="record.tabs.organization" />
            </NavLink>
          </NavItem>
          <NavItem className={`${invalidTabs.includes(LOCATION_TAB) ? 'invalid' : ''}`}>
            <NavLink className={`text-nowrap ${activeTab === LOCATION_TAB ? 'active' : ''}`} onClick={() => this.toggle(LOCATION_TAB)}>
              <Translate contentKey="record.tabs.locations" />
            </NavLink>
          </NavItem>
          <NavItem className={`${invalidTabs.includes(SERVICE_TAB) ? 'invalid' : ''}`}>
            <NavLink className={`text-nowrap ${activeTab === SERVICE_TAB ? 'active' : ''}`} onClick={() => this.toggle(SERVICE_TAB)}>
              <Translate contentKey="record.tabs.services" />
            </NavLink>
          </NavItem>
        </Nav>

        <AvForm model={{}} onSubmit={this.saveRecord} className="background">
          <Prompt
            when={
              !leaving &&
              (!_.isEqual(organization, organizationModel) ||
                !_.isEqual(locations, initialLocations) ||
                !_.isEqual(services, initialServices))
            }
            message={location => `You have unsaved data, are you sure you want to leave?`}
          />
          <TabContent activeTab={activeTab}>
            <TabPane tabId={ORGANIZATION_TAB}>
              <Col md={{ size: 10, offset: 1 }}>
                <div className="heading">
                  <img data-src={PeopleLogo} className="lazyload" height={100} alt="Organization" />
                  <h2>
                    <Translate contentKey="record.heading.organization" />
                  </h2>
                  <div className="description">
                    <Translate contentKey="record.heading.organizationDescription" />
                  </div>
                </div>
                <AvGroup className="flex">
                  <div className="required" />
                  <Label className="sr-only" for="organization-name">
                    {translate('record.name')}
                  </Label>
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
                </AvGroup>
                <AvGroup>
                  <Label className="sr-only" for="organization-description">
                    {translate('record.description')}
                  </Label>
                  <AvInput
                    id="organization-description"
                    type="textarea"
                    name="description"
                    placeholder={translate('record.description')}
                    onChange={this.onOrganizationChange('description')}
                  />
                </AvGroup>
                <AvGroup>
                  <Label className="sr-only" for="organization-covidProtocols">
                    {translate('record.covidProtocols')}
                  </Label>
                  <AvInput
                    id="organization-covidProtocols"
                    type="textarea"
                    name="covidProtocols"
                    placeholder={translate('record.covidProtocols')}
                    onChange={this.onOrganizationChange('covidProtocols')}
                  />
                </AvGroup>
                <AvGroup>
                  <Label className="sr-only" for="organization-url">
                    {translate('record.description')}
                  </Label>
                  <AvField
                    id="organization-url"
                    type="text"
                    name="url"
                    placeholder={translate('record.url')}
                    onChange={this.onOrganizationChange('url')}
                  />
                </AvGroup>
                <AvGroup>
                  <Label className="sr-only" for="organization-email">
                    {translate('record.email')}
                  </Label>
                  <AvField
                    id="organization-email"
                    type="text"
                    name="email"
                    validate={{
                      maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
                    }}
                    placeholder={translate('record.email')}
                    onChange={this.onOrganizationChange('email')}
                  />
                </AvGroup>
                <div className={`record-create ${phoneNumber && !isPossiblePhoneNumber(phoneNumber) ? 'invalid' : ''}`}>
                  <Input
                    className="my-2 form-control"
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder={translate('referral.placeholder.phone')}
                    onChange={this.setPhone}
                    value={phoneNumber}
                    country="US"
                  />
                </div>
                {phoneNumber &&
                  !isPossiblePhoneNumber(phoneNumber) && (
                    <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
                  )}
              </Col>
              <div className="buttons navigation-buttons">
                <ButtonPill onClick={() => this.props.history.goBack()} className="button-pill-secondary">
                  <FontAwesomeIcon icon="angle-left" />
                  &nbsp;
                  <Translate contentKey="record.navigation.goBack" />
                </ButtonPill>
                <ButtonPill onClick={() => this.toggle(LOCATION_TAB)} className="pull-right button-pill-secondary">
                  <Translate contentKey="record.navigation.addLocations" />
                  &nbsp;
                  <FontAwesomeIcon icon="angle-right" />
                </ButtonPill>
              </div>
            </TabPane>
            <TabPane tabId={LOCATION_TAB}>
              <this.locationTab />
              {!onlyRemote ? (
                <div className="buttons list-buttons">
                  {this.state.locationCount === 1 ? null : (
                    <ButtonPill onClick={this.removeLocation} className="button-pill-secondary mr-1">
                      <Translate contentKey="record.remove" />
                    </ButtonPill>
                  )}
                  <ButtonPill onClick={this.addAnotherLocation} className="button-pill-secondary">
                    <FontAwesomeIcon icon="plus" />
                    &nbsp;
                    <Translate contentKey="record.addAnother" />
                  </ButtonPill>
                </div>
              ) : (
                ''
              )}
              <div className="buttons navigation-buttons">
                <ButtonPill onClick={() => this.toggle(ORGANIZATION_TAB)} className="button-pill-secondary">
                  <FontAwesomeIcon icon="angle-left" />
                  &nbsp;
                  <Translate contentKey="record.navigation.goBack" />
                </ButtonPill>
                <ButtonPill onClick={() => this.toggle(SERVICE_TAB)} className="pull-right button-pill-secondary">
                  <Translate contentKey="record.navigation.addServices" />
                  &nbsp;
                  <FontAwesomeIcon icon="angle-right" />
                </ButtonPill>
              </div>
            </TabPane>
            <TabPane tabId={SERVICE_TAB}>
              <Col md={{ size: 10, offset: 1 }}>
                <div className="heading">
                  <img data-src={ServiceLogo} height={100} className="lazyload" alt="Service" />
                  <h2>
                    <Translate contentKey="record.heading.services" />
                  </h2>
                  <div className="description">
                    <Translate contentKey="record.heading.servicesDescription" />
                  </div>
                </div>
                {Array.apply(null, { length: serviceCount }).map((e, i) => {
                  const isPhoneInvalid =
                    _.get(this.state.services, `[${i}].phones[0].number`, '') &&
                    !isPossiblePhoneNumber(_.get(this.state.services, `[${i}].phones[0].number`, ''));
                  return (
                    <Row key={`service-${i}`} className="item service">
                      <Col md={1}>
                        <h4>{i + 1}.</h4>
                      </Col>
                      <Col md={11}>
                        <AvGroup className="flex">
                          <div className="required" />
                          <Label className="sr-only" for={'service-id[' + i + '].name'}>
                            {translate('entity.validation.required')}
                          </Label>
                          <AvInput
                            id={'service-id[' + i + '].name'}
                            type="text"
                            name={'services[' + i + '].name'}
                            placeholder={translate('record.service.name')}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onServiceChange(i, 'name')}
                          />
                        </AvGroup>
                        <AvGroup className="flex">
                          <div className="required" />
                          <Label className="sr-only" for={'services[' + i + '].taxonomyIds'}>
                            {translate('record.service.type')}
                          </Label>
                          <AvSelect
                            name={'services[' + i + '].taxonomyIds'}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            options={taxonomyOptions}
                            // @ts-ignore
                            isMulti
                            placeholder={translate('record.service.type')}
                            onChange={this.onServiceChange(i, 'taxonomyIds')}
                          />
                        </AvGroup>
                        <div className={`record-create ${isPhoneInvalid ? 'invalid' : ''}`}>
                          <Input
                            className="my-2 form-control"
                            type="text"
                            name="phone"
                            id={'service-id[' + i + '].phone'}
                            placeholder={translate('referral.placeholder.phone')}
                            onChange={this.setServicePhone(i)}
                            value={_.get(this.state.services, `[${i}].phones[0].number`, '')}
                            country="US"
                          />
                        </div>
                        {isPhoneInvalid && (
                          <div className="invalid-feedback d-block">{translate('register.messages.validate.phoneNumber.pattern')}</div>
                        )}
                        <AvGroup className="flex">
                          <div className="required" />
                          <Label className="sr-only" for={'service-id[' + i + '].description'}>
                            {translate('record.service.description')}
                          </Label>
                          <AvInput
                            id={'service-id[' + i + '].description'}
                            type="textarea"
                            name={'services[' + i + '].description'}
                            placeholder={translate('record.service.description')}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            onChange={this.onServiceChange(i, 'description')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label className="sr-only" for={'service-id[' + i + '].applicationProcess'}>
                            {translate('record.service.applicationProcess')}
                          </Label>
                          <AvInput
                            id={'service-id[' + i + '].applicationProcess'}
                            type="textarea"
                            name={'services[' + i + '].applicationProcess'}
                            placeholder={translate('record.service.applicationProcess')}
                            onChange={this.onServiceChange(i, 'applicationProcess')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label className="sr-only" for={'service-id[' + i + '].eligibilityCriteria'}>
                            {translate('record.service.eligibilityCriteria')}
                          </Label>
                          <AvInput
                            id={'service-id[' + i + '].eligibilityCriteria'}
                            type="textarea"
                            name={'services[' + i + '].eligibilityCriteria'}
                            placeholder={translate('record.service.eligibilityCriteria')}
                            onChange={this.onServiceChange(i, 'eligibilityCriteria')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label className="sr-only" for={'service-id[' + i + '].docs[0].document'}>
                            {translate('record.service.requiredDocuments')}
                          </Label>
                          <AvInput
                            id={'service-id[' + i + '].docs[0].document'}
                            type="textarea"
                            name={'services[' + i + '].docs[0].document'}
                            placeholder={translate('record.service.requiredDocuments')}
                            onChange={this.onServiceDocsChange(i)}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label className="sr-only" for={'service-id[' + i + '].fees'}>
                            {translate('record.service.fees')}
                          </Label>
                          <AvInput
                            id={'service-id[' + i + '].fees'}
                            type="textarea"
                            name={'services[' + i + '].fees'}
                            placeholder={translate('record.service.fees')}
                            onChange={this.onServiceChange(i, 'fees')}
                          />
                        </AvGroup>
                        <AvGroup>
                          <Label className="sr-only" for={'services[' + i + '].locationIndexes'}>
                            {translate('record.service.locations')}
                          </Label>
                          <AvSelect
                            name={'services[' + i + '].locationIndexes'}
                            value={this.state.services[i]['locationIndexes']}
                            onChange={this.onServiceChange(i, 'locationIndexes', [])}
                            options={this.getLocations()}
                            // @ts-ignore
                            isMulti
                            placeholder={translate('record.service.locations')}
                          />
                        </AvGroup>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
              <div className="buttons list-buttons">
                {this.state.serviceCount === 1 ? null : (
                  <ButtonPill onClick={this.removeService} className="button-pill-secondary mr-1">
                    <Translate contentKey="record.remove" />
                  </ButtonPill>
                )}
                <ButtonPill onClick={this.addAnotherService} className="button-pill-secondary">
                  <FontAwesomeIcon icon="plus" />
                  &nbsp;
                  <Translate contentKey="record.addAnother" />
                </ButtonPill>
              </div>
              <div className="buttons navigation-buttons">
                <ButtonPill onClick={() => this.toggle(LOCATION_TAB)} className="button-pill-secondary">
                  <FontAwesomeIcon icon="angle-left" />
                  &nbsp;
                  <Translate contentKey="record.navigation.goBack" />
                </ButtonPill>
                <ButtonPill className={`pull-right button-pill-primary outline-none ${updating ? 'disabled' : ''}`}>
                  <button id="submit" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="record.navigation.submit" />
                  </button>
                </ButtonPill>
              </div>
            </TabPane>
          </TabContent>
        </AvForm>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  locations: storeState.location.entities,
  updating: storeState.organization.updating,
  updateSuccess: storeState.organization.updateSuccess,
  taxonomyOptions: storeState.taxonomy.providerTaxonomies.map(taxonomy => ({ value: taxonomy.id, label: taxonomy.name }))
});

const mapDispatchToProps = {
  getProviderTaxonomies,
  createUserOwnedEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordCreate);
