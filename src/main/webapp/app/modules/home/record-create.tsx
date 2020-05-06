import './record-create.scss';

import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Col, Row } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createUserOwnedEntity } from 'app/entities/organization/organization.reducer';
import { IRootState } from 'app/shared/reducers';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { US_STATES } from 'app/shared/util/us-states';
import { getProviderTaxonomies } from 'app/entities/taxonomy/taxonomy.reducer';
import AvSelect from '@availity/reactstrap-validation-select';

export interface IRecordCreateViewProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export interface IRecordCreateViewState {
  activeTab: string;
  locationCount: number;
  locations: object[];
  serviceCount: number;
}

const locationModel = {
  address1: '',
  address2: '',
  city: '',
  ca: 'CA',
  zipcode: ''
};

export class RecordCreate extends React.Component<IRecordCreateViewProp, IRecordCreateViewState> {
  state: IRecordCreateViewState = {
    activeTab: 'organization',
    locationCount: 1,
    serviceCount: 1,
    locations: [{ ...locationModel }]
  };

  componentDidMount() {
    this.props.getProviderTaxonomies();
  }

  toggle(activeTab) {
    if (activeTab !== this.state.activeTab) {
      this.setState({
        activeTab
      });
    }
  }

  saveRecord = (event, errors, values) => {
    values.updatedAt = new Date();

    if (errors.length === 0) {
      const entity = {
        ...values
      };
      this.props.createUserOwnedEntity(entity);
    }
  };

  addAnotherService = () => {
    this.setState({
      serviceCount: this.state.serviceCount + 1
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
    const { serviceCount } = this.state;
    if (serviceCount > 1) {
      this.setState({
        serviceCount: serviceCount - 1
      });
    }
  };

  removeLocation = () => {
    const { locationCount, locations } = this.state;
    if (locationCount > 1) {
      locations.pop();
      this.setState({
        locationCount: locationCount - 1,
        locations
      });
    }
  };

  getLocations = () =>
    Array.apply(null, { length: this.state.locationCount }).map((e, i) => {
      const location = this.state.locations[i];
      return (
        { value: i, label: i + '. ' + [location['address1'], location['address2'], location['city']].filter(item => item).join(', ') }
      );
    });

  onLocationChange = (i, fieldName) => ({ target }) => {
    const locations = this.state.locations;
    locations[i][fieldName] = target.value;
    this.setState({
      locations
    });
  };

  render() {
    const { activeTab, locationCount, serviceCount } = this.state;
    const { updating, taxonomyOptions } = this.props;
    return (
      <div className="record-create">
        <Nav tabs>
          <NavItem>
            <NavLink className={`${activeTab === 'organization' ? 'active' : ''}`} onClick={() => this.toggle('organization')}>
              <Translate contentKey="record.tabs.organization" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={`${activeTab === 'locations' ? 'active' : ''}`} onClick={() => this.toggle('locations')}>
              <Translate contentKey="record.tabs.locations" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={`${activeTab === 'services' ? 'active' : ''}`} onClick={() => this.toggle('services')}>
              <Translate contentKey="record.tabs.services" />
            </NavLink>
          </NavItem>
        </Nav>

        <AvForm model={{}} onSubmit={this.saveRecord}>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="organization">
              <AvGroup className="flex">
                <div className="required" />
                <AvField
                  id="organization-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                  placeholder={translate('record.name')}
                />
              </AvGroup>
              <AvGroup>
                <AvInput
                  id="organization-description"
                  type="textarea"
                  name="description"
                  placeholder={translate('record.description')}
                />
              </AvGroup>
              <AvGroup>
                <AvField
                  id="organization-url"
                  type="text"
                  name="url"
                  placeholder={translate('record.url')}
                />
              </AvGroup>
              <AvGroup>
                <AvField
                  id="organization-email"
                  type="text"
                  name="email"
                  validate={{
                    maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
                  }}
                  placeholder={translate('record.email')}
                />
              </AvGroup>
              <div className="buttons navigation-buttons">
                <Button onClick={() => this.toggle('locations')} className="pull-right">
                  <Translate contentKey="record.navigation.addLocations" /> >
                </Button>
              </div>
            </TabPane>
            <TabPane tabId="locations">
              {Array.apply(null, { length: locationCount }).map((e, i) => (
                <Row className="item location">
                  <Col md={1}>{i}.</Col>
                  <Col md={11}>
                    <AvGroup className="flex">
                      <div className="required" />
                      <AvInput
                        type="textarea"
                        name={'locations[' + i + '].address1'}
                        onChange={this.onLocationChange(i, 'address1')}
                        placeholder={translate('record.location.address1')}
                        validate={{
                          required: { value: true, errorMessage: translate('entity.validation.required') }
                        }}
                      />
                    </AvGroup>
                    <AvGroup>
                      <AvInput
                        type="textarea"
                        name={'locations[' + i + '].address2'}
                        onChange={this.onLocationChange(i, 'address2')}
                        placeholder={translate('record.location.address2')}
                      />
                    </AvGroup>
                    <Row>
                      <Col md={7} className="flex">
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
                      <Col md={2} className="flex">
                        <div className="required" />
                        <AvField
                          type="select"
                          name={'locations[' + i + '].ca'}
                          onChange={this.onLocationChange(i, 'ca')}
                          placeholder={translate('record.location.ca')}
                          value={locationModel['ca']}
                          validate={{
                            required: { value: true, errorMessage: translate('entity.validation.required') }
                          }}
                        >
                          {US_STATES.map(state => (
                            <option value={state} key={state}>
                              {state}
                            </option>
                          ))}
                        </AvField>
                      </Col>
                      <Col md={3} className="flex">
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
                  </Col>
                </Row>
              ))}
              <div className="buttons list-buttons">
                {this.state.locationCount === 1 ? null :
                  <Button onClick={this.removeLocation}>
                    <Translate contentKey="record.remove"/>
                  </Button>
                }
                <Button onClick={this.addAnotherLocation}>
                  + <Translate contentKey="record.addAnother" />
                </Button>
              </div>
              <div className="buttons navigation-buttons">
                <Button onClick={() => this.toggle('organization')}>
                  { '<' } <Translate contentKey="record.navigation.goBack" />
                </Button>
                <Button onClick={() => this.toggle('services')} className="pull-right">
                  <Translate contentKey="record.navigation.addServices" /> >
                </Button>
              </div>
            </TabPane>
            <TabPane tabId="services">
              {Array.apply(null, { length: serviceCount }).map((e, i) => (
                <Row className="item service">
                  <Col md={1}>{i}.</Col>
                  <Col md={11}>
                    <AvGroup className="flex">
                      <div className="required" />
                      <AvInput
                        type="text"
                        name={'services[' + i + '].name'}
                        placeholder={translate('record.service.name')}
                        validate={{
                          required: { value: true, errorMessage: translate('entity.validation.required') }
                        }}
                      />
                    </AvGroup>
                    <AvGroup className="flex">
                      <div className="required" />
                      <AvSelect
                        name={'services[' + i + '].type'}
                        validate={{
                          required: { value: true, errorMessage: translate('entity.validation.required') }
                        }}
                        options={taxonomyOptions}
                        // @ts-ignore
                        isMulti
                        placeholder={translate('record.service.type')}
                      />
                    </AvGroup>
                    <AvGroup className="flex">
                      <div className="required" />
                      <AvInput
                        type="textarea"
                        name={'services[' + i + '].description'}
                        placeholder={translate('record.service.description')}
                        validate={{
                          required: { value: true, errorMessage: translate('entity.validation.required') }
                        }}
                      />
                    </AvGroup>
                    <AvGroup>
                      <AvInput
                        type="textarea"
                        name={'services[' + i + '].applicationProcess'}
                        placeholder={translate('record.service.applicationProcess')}
                      />
                    </AvGroup>
                    <AvGroup>
                      <AvInput
                        type="textarea"
                        name={'services[' + i + '].eligibilityCriteria'}
                        placeholder={translate('record.service.eligibilityCriteria')}
                      />
                    </AvGroup>
                    <AvGroup>
                      <AvSelect
                        name={'services[' + i + '].locationIndexes'}
                        options={this.getLocations()}
                        // @ts-ignore
                        isMulti
                        placeholder={translate('record.service.locations')}
                      />
                    </AvGroup>
                  </Col>
                </Row>
              ))}
              <div className="buttons list-buttons">
                {this.state.serviceCount === 1 ? null :
                  <Button onClick={this.removeService}>
                    <Translate contentKey="record.remove"/>
                  </Button>
                }
                <Button onClick={this.addAnotherService}>
                  + <Translate contentKey="record.addAnother" />
                </Button>
              </div>
              <div className="buttons navigation-buttons">
                <Button onClick={() => this.toggle('locations')}>
                  { '<' } <Translate contentKey="record.navigation.goBack" />
                </Button>
                <Button id="submit" type="submit" disabled={updating} className="pull-right">
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="record.navigation.submit" />
                </Button>
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
  taxonomyOptions: storeState.taxonomy.providerTaxonomies.map(
    taxonomy => ({ value: taxonomy.id, label: taxonomy.name }))
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