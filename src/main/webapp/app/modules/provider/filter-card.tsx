import React from 'react';
import { Col, Row, Label } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonPill from './shared/button-pill';
import Select from 'react-select';
import { connect } from 'react-redux';
import {
  getPostalCodeListForServiceProviders as getPostalCodeList,
  getRegionListForServiceProviders as getRegionList,
  getCityListForServiceProviders as getCityList,
  getPartnerList,
  getTaxonomyMap
} from 'app/modules/home/filter-activity.reducer';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import { updateFilter, reset, checkFiltersChanged } from './provider-filter.reducer';

const PLACEHOLDER_TEXT_COLOR = '#555';

export interface IFilterCardProps extends StateProps, DispatchProps {
  dropdownOpen: boolean;
  toggleFilter: Function;
  getFirstPage: Function;
  siloName?: string;
  isMapView: boolean;
}

export interface IFilterCardState {
  city: string;
  region: string;
  zip: string;
  serviceTypes: any[];
  filtersChanged?: boolean;
}

export class FilterCard extends React.Component<IFilterCardProps, IFilterCardState> {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      region: '',
      zip: '',
      serviceTypes: [] as any[]
    };
  }

  componentDidMount() {
    const {
      isLoggingOut,
      filter,
      previousSiloName,
      siloName,
      previousUserName,
      userName,
      postalCodeList,
      regionList,
      cityList,
      taxonomyOptions,
      siloId
    } = this.props;
    if (!isLoggingOut) {
      const hasUserOrSiloChanged = previousSiloName !== (siloName || '') || previousUserName !== userName;
      if (hasUserOrSiloChanged || _.isEmpty(postalCodeList)) {
        this.props.getPostalCodeList(userName, siloName);
      }
      if (hasUserOrSiloChanged || _.isEmpty(regionList)) {
        this.props.getRegionList(userName, siloName);
      }
      if (hasUserOrSiloChanged || _.isEmpty(cityList)) {
        this.props.getCityList(userName, siloName);
      }
      if (hasUserOrSiloChanged || _.isEmpty(taxonomyOptions)) {
        this.props.getTaxonomyMap(userName, siloName, true);
      }
      this.setState({ ...filter });
    }
  }

  handleServiceTypeChanged = values => {
    this.setState({ serviceTypes: values });
  };

  applyFilter = () => {
    const filter = { ...this.state };
    const { isMapView } = this.props;
    if (isMapView) {
      this.props.checkFiltersChanged();
    }
    this.props.getFirstPage();
    this.props.updateFilter({ ...filter });
    this.props.toggleFilter();
  };

  resetFilter = () => {
    const { isMapView } = this.props;
    if (isMapView) {
      this.props.checkFiltersChanged();
    }
    this.props.getFirstPage();
    this.props.reset();
    this.props.toggleFilter();
  };

  handleZipChanged = v => {
    this.setState({ zip: v.value });
  };

  handleRegionChanged = v => {
    this.setState({ region: v.value });
  };

  handleCityChanged = v => {
    this.setState({ city: v.value });
  };

  selectStyle = () => ({
    placeholder: style => ({ ...style, color: PLACEHOLDER_TEXT_COLOR })
  });

  render() {
    const { taxonomyOptions, cityList, regionList, postalCodeList } = this.props;
    const { city, region, zip, serviceTypes } = this.state;

    const MultiValueContainer = props => (
      <div className="pill my-1">
        <div className="d-inline multi-select-pill">
          <span>{props.children}</span>
        </div>
      </div>
    );

    return (
      <div>
        <div className="filter-header">
          <b>
            <Translate contentKey="providerSite.filterRecords" />
          </b>
          <div className="mx-2" onClick={() => this.props.toggleFilter()}>
            <FontAwesomeIcon icon="times" />
          </div>
        </div>
        <div className="filter-body">
          <div>
            <div>
              <div className="my-2">
                <b>
                  <Translate contentKey="providerSite.serviceType" />
                </b>
              </div>
              <Label className="sr-only" for="serviceType">
                <Translate contentKey="providerSite.serviceType" />
              </Label>
              <Select
                inputId="serviceType"
                components={{ MultiValueContainer }}
                isMulti
                options={taxonomyOptions && _.uniqBy(
                  _.get(taxonomyOptions, 'ServiceProvider', []).concat(
                    _.get(taxonomyOptions, 'silo', [])),
                  option => option['value'])}
                value={serviceTypes}
                onChange={this.handleServiceTypeChanged}
                styles={{
                  ...this.selectStyle(),
                  control: base => ({
                    ...base,
                    minHeight: '6em'
                  }),
                  multiValue: base => ({
                    ...base
                  })
                }}
              />
            </div>
            <div className="my-2">
              <div className="my-2">
                <b>
                  <Translate contentKey="providerSite.location" />
                </b>
              </div>
              <Row>
                <Col>
                  <Label className="sr-only" for="filter-city">
                    <Translate contentKey="providerSite.city" />
                  </Label>
                  <Select
                    onChange={this.handleCityChanged}
                    options={cityList}
                    placeholder={translate('providerSite.city')}
                    value={_.find(cityList, c => c.value === city)}
                    inputId="filter-city"
                    styles={this.selectStyle()}
                  />
                </Col>
                <Col>
                  <Label className="sr-only" for="filter-county">
                    <Translate contentKey="providerSite.county" />
                  </Label>
                  <Select
                    inputId="filter-county"
                    onChange={this.handleRegionChanged}
                    options={regionList}
                    placeholder={translate('providerSite.county')}
                    value={_.find(regionList, r => r.value === region)}
                    styles={this.selectStyle()}
                  />
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs="6">
                <Label className="sr-only" for="filter-zipCode">
                  <Translate contentKey="providerSite.zipCode" />
                </Label>
                <Select
                  inputId="filter-zipCode"
                  onChange={this.handleZipChanged}
                  options={postalCodeList}
                  placeholder={translate('providerSite.zipCode')}
                  value={_.find(postalCodeList, c => c.value === zip)}
                  styles={this.selectStyle()}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="filter-footer">
          <ButtonPill onClick={this.resetFilter} translate="providerSite.clear" className="mr-1" />
          <ButtonPill className="button-pill-orange" onClick={this.applyFilter} translate="providerSite.apply" />
        </div>
      </div>
    );
  }
}

function getTaxonomyOptions(taxonomyMap) {
  const taxonomyOptions = {};
  _.forOwn(taxonomyMap, (value, key) => {
    taxonomyOptions[key] = value.filter(taxonomy => taxonomy != null).map(taxonomy => ({ label: taxonomy, value: taxonomy }));
  });
  return taxonomyOptions;
}

const mapStateToProps = (storeState: IRootState) => ({
  isLoggingOut: storeState.authentication.loggingOut,
  userName: storeState.authentication.account.login,
  siloId: storeState.authentication.account.siloId,
  previousUserName: storeState.filterActivity.userName,
  previousSiloName: storeState.filterActivity.siloName,
  postalCodeList: storeState.filterActivity.providersPostalCodeList.map(code => ({ label: code, value: code })),
  cityList: storeState.filterActivity.providersCityList.map(city => ({ label: city, value: city })),
  regionList: storeState.filterActivity.providersRegionList.map(region => ({ label: region, value: region })),
  taxonomyOptions: getTaxonomyOptions(storeState.filterActivity.taxonomyMap),
  filter: storeState.providerFilter.filter
});

const mapDispatchToProps = {
  getPostalCodeList,
  getRegionList,
  getCityList,
  getPartnerList,
  getTaxonomyMap,
  updateFilter,
  reset,
  checkFiltersChanged
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterCard);
