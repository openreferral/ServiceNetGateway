import 'react-datepicker/dist/react-datepicker.css';

import _ from 'lodash';
import React, { ComponentClass, FunctionComponent } from 'react';
import { Button, Col, Container, Row, Collapse, Card, CardBody, TabPane, TabContent, Nav, NavItem, NavLink, Label } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import Select from 'react-select';
import axios from 'axios';
import { IRootState } from 'app/shared/reducers';
import {
  getPostalCodeList,
  getRegionList,
  getCityList,
  getPartnerList,
  updateActivityFilter,
  getTaxonomyMap
} from './filter-activity.reducer';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { ORGANIZATION, SERVICES, LOCATIONS, getSearchFieldOptions, getDefaultSearchFieldOptions } from 'app/modules/home/filter.constants';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { GOOGLE_API_KEY } from 'app/config/constants';
import { SERVICENET_API_URL } from 'app/shared/util/service-url.constants';
import { dateWithoutTz, dateWithTz } from 'app/shared/util/date-utils';

export interface IFilterActivityState {
  filtersChanged: boolean;
  fromDateValid: boolean;
  toDateValid: boolean;
  activeTab: string;
  lat: number;
  lng: number;
}

export interface IFilterActivityProps extends StateProps, DispatchProps {
  filterCollapseExpanded: boolean;
  getActivityEntities(any): any;
  resetActivityFilter();
}

const INITIAL_STATE = {
  filtersChanged: false,
  fromDateValid: true,
  toDateValid: true,
  activeTab: 'optionsTab',
  lat: null,
  lng: null
};
const DATE_RANGE = 'DATE_RANGE';
const PLACEHOLDER_TEXT_COLOR = '#555';

const withLatLong = (
  wrappedComponent: string | ComponentClass<any> | FunctionComponent<any>
): string | React.ComponentClass<any> | React.FunctionComponent<any> => wrappedComponent;

const Map = withScriptjs(
  withGoogleMap(
    withLatLong(props => (
      <GoogleMap
        defaultZoom={8}
        defaultOptions={{ mapTypeControl: false, streetViewControl: false }}
        onClick={props.onClick}
        center={{ lat: props.latitude || 37.8543356, lng: props.longitude || -122.272921 }}
      >
        {props.latitude && props.longitude ? <Marker position={{ lat: props.latitude, lng: props.longitude }} /> : null}
      </GoogleMap>
    ))
  )
);
const mapUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + GOOGLE_API_KEY;

export class FilterActivity extends React.Component<IFilterActivityProps, IFilterActivityState> {
  state: IFilterActivityState = INITIAL_STATE;

  componentDidMount() {
    const { isLoggingOut, previousUserName, userName, postalCodeList, regionList, cityList, partnerList, taxonomyOptions } = this.props;
    if (!isLoggingOut) {
      const hasUserChanged = previousUserName !== userName;
      if (_.isEmpty(postalCodeList)) {
        this.props.getPostalCodeList();
      }
      if (_.isEmpty(regionList)) {
        this.props.getRegionList();
      }
      if (_.isEmpty(cityList)) {
        this.props.getCityList();
      }
      if (hasUserChanged || _.isEmpty(partnerList)) {
        this.props.getPartnerList(userName);
      }
      if (hasUserChanged || _.isEmpty(taxonomyOptions)) {
        this.props.getTaxonomyMap(userName);
      }
    }
  }

  selectStyle = () => ({
    placeholder: style => ({ ...style, color: PLACEHOLDER_TEXT_COLOR })
  });

  getDateFilterList = () => [
    { value: 'LAST_7_DAYS', label: translate('serviceNetApp.activity.home.filter.date.last7Days') },
    { value: 'LAST_30_DAYS', label: translate('serviceNetApp.activity.home.filter.date.last30Days') },
    { value: DATE_RANGE, label: translate('serviceNetApp.activity.home.filter.date.dateRange') }
  ];

  getDateFilterValue = value => {
    const labels = {
      LAST_7_DAYS: translate('serviceNetApp.activity.home.filter.date.last7Days'),
      LAST_30_DAYS: translate('serviceNetApp.activity.home.filter.date.last30Days'),
      DATE_RANGE: translate('serviceNetApp.activity.home.filter.date.dateRange')
    };

    if (!value) {
      return null;
    }

    return { value, label: labels[value] };
  };

  getRadiusValue = value => {
    const labels = {
      1: '1 mile',
      2: '2 miles',
      3: '3 miles',
      4: '4 miles',
      5: '5 miles',
      10: '10 miles',
      20: '20 miles'
    };

    if (!value) {
      return null;
    }

    return { value, label: labels[value] };
  };

  applyFilter = () => {
    if (this.validateFilters()) {
      this.props.getActivityEntities(null);
      this.setState({ filtersChanged: false });

      this.saveCurrentFilter({ ...this.props.activityFilter, hiddenFilter: false });
    }
  };

  validateFilters = () => {
    if (this.props.dateFilter === DATE_RANGE) {
      const { fromDate, toDate } = this.props.activityFilter;
      let fromDateValid = true;
      let toDateValid = true;

      if (!fromDate && !toDate) {
        fromDateValid = false;
        toDateValid = false;
        toast.error(translate('serviceNetApp.activity.home.filter.error.specifyDates'));
      } else if (!fromDate) {
        fromDateValid = false;
        toast.error(translate('serviceNetApp.activity.home.filter.error.specifyFromDate'));
      } else if (!toDate) {
        toDateValid = false;
        toast.error(translate('serviceNetApp.activity.home.filter.error.specifyToDate'));
      } else if (new Date(toDate) < new Date(fromDate)) {
        fromDateValid = false;
        toDateValid = false;
        toast.error(translate('serviceNetApp.activity.home.filter.error.untilDateEarlierThanFromDate'));
      } else if (
        new Date().getFullYear() - new Date(fromDate).getFullYear() > 20 ||
        new Date(fromDate).getFullYear() - new Date().getFullYear() > 20
      ) {
        fromDateValid = false;
        toast.error(translate('serviceNetApp.activity.home.filter.error.invalidDates'));
      } else if (
        new Date().getFullYear() - new Date(toDate).getFullYear() > 20 ||
        new Date(toDate).getFullYear() - new Date().getFullYear() > 20
      ) {
        toDateValid = false;
        toast.error(translate('serviceNetApp.activity.home.filter.error.invalidDates'));
      }
      this.setState({
        fromDateValid,
        toDateValid
      });
      return fromDateValid && toDateValid;
    }
    return true;
  };

  resetFilter = () => {
    const searchFieldOptions = getDefaultSearchFieldOptions();
    const filter = {
      ...this.props.activityFilter,
      citiesFilterList: [],
      regionFilterList: [],
      postalCodesFilterList: [],
      partnerFilterList: [],
      taxonomiesFilterList: [],
      searchFields: searchFieldOptions.map(o => o.value),
      searchOn: ORGANIZATION,
      dateFilter: null,
      fromDate: null,
      toDate: null,
      showPartner: false,
      showOnlyHighlyMatched: false,
      applyLocationSearch: false,
      latitude: null,
      longitude: null
    };

    this.props.updateActivityFilter(filter);

    this.props.resetActivityFilter();

    this.saveCurrentFilter(filter);
    this.setState(INITIAL_STATE);
  };

  saveCurrentFilter = filter => {
    const url = SERVICENET_API_URL + '/activity-filter/current-user-filter';

    axios.post(url, filter);
  };

  handleCityChange = selectedCity => {
    this.setState({ filtersChanged: true });

    const citiesFilterList = selectedCity.map(city => city.value);

    this.props.updateActivityFilter({ ...this.props.activityFilter, citiesFilterList });
  };

  handleRadiusChange = radius => {
    this.setState({ filtersChanged: true });

    this.props.updateActivityFilter({ ...this.props.activityFilter, radius: radius.value });
  };

  handleCountyChange = selectedCounty => {
    this.setState({ filtersChanged: true });

    const regionFilterList = selectedCounty.map(county => county.value);

    this.props.updateActivityFilter({ ...this.props.activityFilter, regionFilterList });
  };

  handleZipChange = selectedZip => {
    this.setState({ filtersChanged: true });

    const postalCodesFilterList = selectedZip.map(zip => zip.value);

    this.props.updateActivityFilter({ ...this.props.activityFilter, postalCodesFilterList });
  };

  handleTaxonomyChange = selectedTaxonomy => {
    this.setState({ filtersChanged: true });

    const taxonomiesFilterList = selectedTaxonomy.map(taxonomy => taxonomy.value);

    this.props.updateActivityFilter({ ...this.props.activityFilter, taxonomiesFilterList });
  };

  handleSearchFieldsChange = selectedSearchFields => {
    this.setState({ filtersChanged: true });

    const searchFields = selectedSearchFields.map(f => f.value);

    this.props.updateActivityFilter({ ...this.props.activityFilter, searchFields });
  };

  handlePartnerChange = selectedPartner => {
    this.setState({ filtersChanged: true });

    const partnerFilterList = selectedPartner.map(partner => partner.value);

    this.props.updateActivityFilter({ ...this.props.activityFilter, partnerFilterList });
  };

  handleSearchOnChange = changeEvent => {
    const searchOn = changeEvent.target.value;
    const selectedSearchFields = getDefaultSearchFieldOptions();

    this.setState({ filtersChanged: true });

    const searchFields = selectedSearchFields.map(f => f.value);
    this.props.updateActivityFilter({ ...this.props.activityFilter, searchOn, searchFields });
  };

  handleDateFilterChange = dateFilter => {
    this.setState({ filtersChanged: true });

    this.props.updateActivityFilter({ ...this.props.activityFilter, dateFilter: dateFilter.value });
  };

  handleFromDateChange = fromDate => {
    this.props.updateActivityFilter({ ...this.props.activityFilter, fromDate: dateWithoutTz(fromDate).toISOString() });
    this.setState({ filtersChanged: true });
  };

  handleToDateChange = toDate => {
    this.props.updateActivityFilter({ ...this.props.activityFilter, toDate: dateWithoutTz(toDate).toISOString() });
    this.setState({ filtersChanged: true });
  };

  handleOnlyShowMatchingChange = changeEvent => {
    const onlyShowMatching = changeEvent.target.checked;

    this.setState({ filtersChanged: true });

    this.props.updateActivityFilter({ ...this.props.activityFilter, showPartner: !onlyShowMatching });
  };

  handleOnlyHighlyMatchedChange = changeEvent => {
    const showOnlyHighlyMatched = changeEvent.target.checked || false;

    this.setState({ filtersChanged: true });

    this.props.updateActivityFilter({ ...this.props.activityFilter, showOnlyHighlyMatched });
  };

  handleLocationChange = ({ lat, lng }) => {
    this.setState({ filtersChanged: true });

    this.props.updateActivityFilter({ ...this.props.activityFilter, latitude: lat, longitude: lng });
  };

  applyLocationSearch = changeEvent => {
    const applyLocationSearch = changeEvent.target.checked;

    this.setState({ filtersChanged: true });

    this.props.updateActivityFilter({ ...this.props.activityFilter, applyLocationSearch });
  };

  getPartnerListValues = () => {
    const partnerList = [];

    _.forEach(this.props.selectedPartner, partnerId => {
      const selectedPartner = _.find(this.props.partnerList, partner => partner.value === partnerId);
      partnerList.push(selectedPartner);
    });

    return partnerList;
  };

  mergeTaxonomyOptions = (lists, selectedPartners) => {
    if (selectedPartners.length === 0) {
      return lists[this.props.currentProvider];
    }
    let merged = [];
    for (const key in selectedPartners) {
      if (selectedPartners.hasOwnProperty(key)) {
        const partner = selectedPartners[key];
        if (partner) {
          if (partner.label === 'Anonymous') {
            return lists['all'];
          }
          if (lists[partner.label]) {
            merged = merged.concat(lists[partner.label]);
          }
        }
      }
    }
    return merged;
  };

  getDateOrNull = date => (date ? dateWithTz(date) : null);

  optionsTab = () => this.changeTab('optionsTab');

  mapTab = () => this.changeTab('mapTab');

  changeTab = tab => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
  };

  selectLocation = ({ latLng }) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState({ lat, lng });
    this.handleLocationChange({ lat, lng });
  };

  getMyCurrentLocation = () => {
    const myPosition = navigator.geolocation.getCurrentPosition(this.setCurrentLocation);
  };

  setCurrentLocation = position => {
    this.setState({ lat: position.coords.latitude, lng: position.coords.longitude });
    this.handleLocationChange({ lat: position.coords.latitude, lng: position.coords.longitude });
  };

  render() {
    const { filterCollapseExpanded, postalCodeList, cityList, regionList, partnerList, taxonomyOptions } = this.props;
    const { activeTab } = this.state;
    const searchFieldList = getSearchFieldOptions(this.props.searchOn);
    const radiusOptions = [1, 2, 3, 4, 5, 10, 20].map(number => ({ label: `${number} mile${number > 1 ? 's' : ''}`, value: number }));
    return (
      <div key="filter-activity">
        <Collapse isOpen={filterCollapseExpanded} style={{ marginBottom: '1rem' }}>
          <Card>
            <CardBody>
              <Container>
                <Nav tabs>
                  <NavItem>
                    <NavLink className={`filters-tab ${activeTab === 'optionsTab' ? 'active' : ''}`} onClick={this.optionsTab}>
                      <Translate contentKey="serviceNetApp.activity.home.filter.filterOptions" />
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`filters-tab ${activeTab === 'mapTab' ? 'active' : ''} ${
                        this.props.applyLocationSearch && !this.props.latitude && !this.props.longitude ? 'missing-loc' : ''
                      }`}
                      onClick={this.mapTab}
                    >
                      <Translate contentKey="serviceNetApp.activity.home.filter.locationChooser" />
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="optionsTab">
                    <Row className="mt-2">
                      <Col md="12">
                        <div className="form-check form-check-inline">
                          <Translate contentKey="serviceNetApp.activity.home.filter.searchFor" />:
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            id="orgRadio"
                            name="search-on"
                            value={ORGANIZATION}
                            className="form-check-input"
                            onChange={this.handleSearchOnChange}
                            checked={this.props.searchOn === ORGANIZATION}
                          />
                          <label className="form-check-label" htmlFor="orgRadio">
                            <Translate contentKey="serviceNetApp.activity.home.filter.organization" />
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            id="svcRadio"
                            name="search-on"
                            value={SERVICES}
                            className="form-check-input"
                            onChange={this.handleSearchOnChange}
                            checked={this.props.searchOn === SERVICES}
                          />
                          <label className="form-check-label" htmlFor="svcRadio">
                            <Translate contentKey="serviceNetApp.activity.home.filter.services" />
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            id="locRadio"
                            name="search-on"
                            value={LOCATIONS}
                            className="form-check-input"
                            onChange={this.handleSearchOnChange}
                            checked={this.props.searchOn === LOCATIONS}
                          />
                          <label className="form-check-label" htmlFor="locRadio">
                            <Translate contentKey="serviceNetApp.activity.home.filter.locations" />
                          </label>
                        </div>
                        <div className="form-check form-check-inline float-right">
                          <input
                            type="checkbox"
                            id="applyLocationSearch"
                            className="form-check-input"
                            onChange={this.applyLocationSearch}
                            checked={this.props.applyLocationSearch}
                          />
                          <label className="form-check-label" htmlFor="applyLocationSearch">
                            <Translate contentKey="serviceNetApp.activity.home.filter.applyLocationSearch" />
                          </label>
                        </div>
                        <div>
                          <Translate contentKey="serviceNetApp.activity.home.filter.searchFields" />
                          <Label className="sr-only" for="searchFields">
                            {translate('serviceNetApp.activity.home.filter.searchFields')}
                          </Label>
                          <Select
                            styles={this.selectStyle()}
                            value={this.props.selectedSearchFields}
                            onChange={this.handleSearchFieldsChange}
                            options={searchFieldList}
                            isMulti
                            inputId="searchFields"
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <Translate contentKey="serviceNetApp.activity.home.filter.city" />
                        <label className="sr-only" htmlFor="cityInput">
                          <Translate contentKey="serviceNetApp.activity.home.filter.city" />
                        </label>
                        <Select
                          styles={this.selectStyle()}
                          name="cityInput"
                          id="cityInput"
                          value={this.props.selectedCity}
                          onChange={this.handleCityChange}
                          options={cityList}
                          isMulti
                          inputId="cityInput"
                        />
                      </Col>
                      <Col md="3">
                        <Translate contentKey="serviceNetApp.activity.home.filter.county" />
                        <Label className="sr-only" for="county">
                          {translate('serviceNetApp.activity.home.filter.county')}
                        </Label>
                        <Select
                          styles={this.selectStyle()}
                          value={this.props.selectedCounty}
                          onChange={this.handleCountyChange}
                          options={regionList}
                          isMulti
                          inputId="county"
                        />
                      </Col>
                      <Col md="3">
                        <Translate contentKey="serviceNetApp.activity.home.filter.zip" />
                        <Label className="sr-only" for="zip">
                          {translate('serviceNetApp.activity.home.filter.zip')}
                        </Label>
                        <Select
                          styles={this.selectStyle()}
                          value={this.props.selectedZip}
                          onChange={this.handleZipChange}
                          options={postalCodeList}
                          isMulti
                          inputId="zip"
                        />
                        <div className="form-check form-check-inline">
                          <input
                            type="checkbox"
                            id="onlyHighlyMatchedCheckbox"
                            className="form-check-input"
                            onChange={this.handleOnlyHighlyMatchedChange}
                            checked={this.props.showOnlyHighlyMatched}
                          />
                          <label className="form-check-label" htmlFor="onlyHighlyMatchedCheckbox">
                            <Translate contentKey="serviceNetApp.activity.home.filter.onlyShowHighlyMatched" />
                          </label>
                        </div>
                      </Col>
                      <Col md="3">
                        <Translate contentKey="serviceNetApp.activity.home.filter.partner" />
                        <Label className="sr-only" for="partner">
                          {translate('serviceNetApp.activity.home.filter.partner')}
                        </Label>
                        <Select
                          styles={this.selectStyle()}
                          value={this.getPartnerListValues()}
                          onChange={this.handlePartnerChange}
                          options={partnerList}
                          isMulti
                          inputId="partner"
                        />
                        <div className="form-check form-check-inline">
                          <input
                            type="checkbox"
                            id="onlyShowMatchingCheckbox"
                            className="form-check-input"
                            onChange={this.handleOnlyShowMatchingChange}
                            checked={this.props.onlyShowMatching}
                          />
                          <label key="onlyShowMatchingCheckboxLabel" className="form-check-label" htmlFor="onlyShowMatchingCheckbox">
                            <Translate contentKey="serviceNetApp.activity.home.filter.onlyShowMatching" />
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="3">
                        <Translate contentKey="serviceNetApp.activity.home.filter.taxonomy" />
                        <Label className="sr-only" for="taxonomy">
                          {translate('serviceNetApp.activity.home.filter.taxonomy')}
                        </Label>
                        {this.props.onlyShowMatching ? (
                          <Select
                            styles={this.selectStyle()}
                            key="taxonomy-select-only-show-matching"
                            value={this.props.selectedTaxonomy}
                            onChange={this.handleTaxonomyChange}
                            options={this.mergeTaxonomyOptions(taxonomyOptions, this.getPartnerListValues())}
                            isMulti
                            inputId="taxonomy"
                          />
                        ) : (
                          <Select
                            styles={this.selectStyle()}
                            key="taxonomy-select"
                            value={this.props.selectedTaxonomy}
                            onChange={this.handleTaxonomyChange}
                            options={taxonomyOptions['all']}
                            isMulti
                            inputId="taxonomy"
                          />
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md="3">
                        <Translate contentKey="serviceNetApp.activity.home.filter.dateFilter" />
                        <Label className="sr-only" for="date">
                          {translate('serviceNetApp.activity.home.filter.dateFilter')}
                        </Label>
                        <Select
                          styles={this.selectStyle()}
                          value={this.getDateFilterValue(this.props.dateFilter)}
                          onChange={this.handleDateFilterChange}
                          options={this.getDateFilterList()}
                          inputId="date"
                        />
                      </Col>
                      {this.props.dateFilter !== DATE_RANGE
                        ? null
                        : [
                            <Col key="fromDate" md="3">
                              <Translate contentKey="serviceNetApp.activity.home.filter.from" />
                              <DatePicker
                                selected={this.getDateOrNull(this.props.activityFilter.fromDate)}
                                onChange={this.handleFromDateChange}
                                className={this.state.fromDateValid ? 'form-control' : 'form-control invalid'}
                                name="fromDate"
                                id="fromDate"
                              />
                            </Col>,
                            <Col key="toDate" md="3">
                              <div>
                                <Translate contentKey="serviceNetApp.activity.home.filter.to" />
                              </div>
                              <DatePicker
                                selected={this.getDateOrNull(this.props.activityFilter.toDate)}
                                onChange={this.handleToDateChange}
                                className={this.state.toDateValid ? 'form-control' : 'form-control invalid'}
                                name="toDate"
                                id="toDate"
                              />
                            </Col>
                          ]}
                    </Row>
                    <Row>
                      <Col md={{ size: 2, offset: 10 }}>
                        <div className="pt-3">
                          <Button color="primary" onClick={this.applyFilter} disabled={!this.state.filtersChanged} block>
                            <Translate contentKey="serviceNetApp.activity.home.filter.applyFilter" />
                          </Button>
                        </div>
                      </Col>
                      <Col md={{ size: 2, offset: 10 }}>
                        <div className="pt-3">
                          <Button key="resetButton" color="primary" onClick={this.resetFilter} block>
                            <Translate contentKey="serviceNetApp.activity.home.filter.resetFilter" />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="mapTab">
                    <Row className="my-2">
                      <Col>
                        <Button key="location-button" className="btn btn-primary" onClick={this.getMyCurrentLocation}>
                          <Translate contentKey="serviceNetApp.activity.home.filter.setMyCurrentLocation" />
                        </Button>
                      </Col>
                      <Col md="4" className="d-flex align-items-center">
                        <Translate contentKey="serviceNetApp.activity.home.filter.radius" />
                        <Label className="sr-only" for="radius">
                          {translate('serviceNetApp.activity.home.filter.radius')}
                        </Label>
                        <Select
                          styles={this.selectStyle()}
                          value={this.getRadiusValue(this.props.radius)}
                          onChange={this.handleRadiusChange}
                          options={radiusOptions}
                          className="flex-fill ml-2"
                          inputId="radius"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Map
                          googleMapURL={mapUrl}
                          latitude={this.props.latitude}
                          longitude={this.props.longitude}
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `400px` }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                          onClick={this.selectLocation}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </Container>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    );
  }
}

function getTaxonomyOptions(taxonomyMap) {
  const taxonomyOptions = {};
  _.forOwn(taxonomyMap, (value, key) => {
    taxonomyOptions[key] = value.filter(taxonomy => taxonomy != null).map(taxonomy => ({ label: taxonomy, value: taxonomy }));
  });
  taxonomyOptions['all'] = [].concat.apply([], Object.values(taxonomyOptions));
  return taxonomyOptions;
}

const mapStateToProps = (storeState: IRootState) => ({
  postalCodeList: storeState.filterActivity.postalCodeList.map(code => ({ label: code, value: code })),
  isLoggingOut: storeState.authentication.loggingOut,
  userName: storeState.authentication.account.login,
  previousUserName: storeState.filterActivity.userName,
  regionList: storeState.filterActivity.regionList.map(region => ({ label: region, value: region })),
  cityList: storeState.filterActivity.cityList.map(city => ({ label: city, value: city })),
  taxonomyOptions: getTaxonomyOptions(storeState.filterActivity.taxonomyMap),
  partnerList: storeState.filterActivity.partnerList.map(partner => ({ label: partner.name, value: partner.id })),
  currentProvider: storeState.filterActivity.currentProvider,
  activityFilter: storeState.filterActivity.activityFilter,
  selectedCity: storeState.filterActivity.activityFilter.citiesFilterList.map(city => ({ label: city, value: city })),
  selectedCounty: storeState.filterActivity.activityFilter.regionFilterList.map(county => ({ label: county, value: county })),
  selectedZip: storeState.filterActivity.activityFilter.postalCodesFilterList.map(code => ({ label: code, value: code })),
  selectedPartner: storeState.filterActivity.activityFilter.partnerFilterList,
  selectedTaxonomy: storeState.filterActivity.activityFilter.taxonomiesFilterList.map(taxonomy => ({ label: taxonomy, value: taxonomy })),
  selectedSearchFields: storeState.filterActivity.activityFilter.searchFields.map(field => ({ label: field, value: field })),
  searchOn: storeState.filterActivity.activityFilter.searchOn,
  dateFilter: storeState.filterActivity.activityFilter.dateFilter,
  fromDate: storeState.filterActivity.activityFilter.fromDate,
  toDate: storeState.filterActivity.activityFilter.toDate,
  onlyShowMatching: !storeState.filterActivity.activityFilter.showPartner,
  showOnlyHighlyMatched: storeState.filterActivity.activityFilter.showOnlyHighlyMatched,
  applyLocationSearch: storeState.filterActivity.activityFilter.applyLocationSearch,
  latitude: storeState.filterActivity.activityFilter.latitude,
  longitude: storeState.filterActivity.activityFilter.longitude,
  radius: storeState.filterActivity.activityFilter.radius
});

const mapDispatchToProps = { getPostalCodeList, getRegionList, getCityList, getPartnerList, getTaxonomyMap, updateActivityFilter };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterActivity);
