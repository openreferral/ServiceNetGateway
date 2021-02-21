import React from 'react';
import { Label } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sendAction } from 'app/shared/util/analytics';
import { GA_ACTIONS } from 'app/config/constants';

const PLACEHOLDER_TEXT_COLOR = '#555';

export interface IFilterBarProps extends StateProps, DispatchProps {
  getFirstPage: Function;
  siloName?: string;
  isMapView: boolean;
  isModal?: boolean;
  toggleFilter?: any;
}

export interface IFilterBarState {
  city: string;
  region: string;
  zip: string;
  serviceTypes: any[];
  filtersChanged?: boolean;
}

export class FilterBar extends React.Component<IFilterBarProps, IFilterBarState> {
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

  componentDidUpdate(prevProps: Readonly<IFilterBarProps>, prevState: Readonly<IFilterBarState>, snapshot?: any) {
    if (prevProps.filter !== this.props.filter) {
      this.setState({ ...this.props.filter });
    }
  }

  handleServiceTypeChanged = values => {
    sendAction(!this.props.siloName ? GA_ACTIONS.SERVICE_TYPE : GA_ACTIONS.PUBLIC_SERVICE_TYPE);
    this.setState({ serviceTypes: values });
  };

  applyFilter = () => {
    const filter = { ...this.state };
    const { isMapView, toggleFilter } = this.props;
    if (isMapView) {
      this.props.checkFiltersChanged();
    }
    this.props.getFirstPage();
    this.props.updateFilter({ ...filter });
    if (toggleFilter) {
      toggleFilter();
    }
    if (filter.city) {
      if (filter.serviceTypes.length > 0) {
        sendAction(
          !this.props.siloName ? GA_ACTIONS.FILTER_VARIATION_SERVICE_TYPE_CITY : GA_ACTIONS.PUBLIC_FILTER_VARIATION_SERVICE_TYPE_CITY
        );
      } else {
        sendAction(!this.props.siloName ? GA_ACTIONS.LOCATION_CITY : GA_ACTIONS.PUBLIC_LOCATION_CITY);
      }
    }
    if (filter.region) {
      if (filter.serviceTypes.length > 0) {
        sendAction(
          !this.props.siloName ? GA_ACTIONS.FILTER_VARIATION_SERVICE_TYPE_COUNTY : GA_ACTIONS.PUBLIC_FILTER_VARIATION_SERVICE_TYPE_COUNTY
        );
      } else {
        sendAction(!this.props.siloName ? GA_ACTIONS.LOCATION_COUNTY : GA_ACTIONS.PUBLIC_LOCATION_COUNTY);
      }
    }
    if (filter.zip) {
      if (filter.serviceTypes.length > 0) {
        sendAction(
          !this.props.siloName
            ? GA_ACTIONS.FILTER_VARIATION_SERVICE_TYPE_ZIP_CODE
            : GA_ACTIONS.PUBLIC_FILTER_VARIATION_SERVICE_TYPE_ZIP_CODE
        );
      } else {
        sendAction(!this.props.siloName ? GA_ACTIONS.LOCATION_ZIP_CODE : GA_ACTIONS.PUBLIC_LOCATION_ZIP_CODE);
      }
    }
  };

  resetFilter = () => {
    const { isMapView, toggleFilter } = this.props;
    if (isMapView) {
      this.props.checkFiltersChanged();
    }
    this.props.getFirstPage();
    this.props.reset();
    if (toggleFilter) {
      toggleFilter();
    }
    sendAction(!this.props.siloName ? GA_ACTIONS.CLEAR_FILTERS : GA_ACTIONS.PUBLIC_CLEAR_FILTERS);
  };

  handleZipChanged = v => {
    this.setState({ zip: v ? v.value : null });
  };

  handleRegionChanged = v => {
    this.setState({ region: v ? v.value : null });
  };

  handleCityChanged = v => {
    this.setState({ city: v ? v.value : null });
  };

  selectStyle = () => ({
    placeholder: style => ({ ...style, color: PLACEHOLDER_TEXT_COLOR })
  });

  filterHeader = () => (
    <div className="filter-header">
      <b>
        <Translate contentKey="providerSite.filterRecords" />
      </b>
      <div className="mx-2" onClick={() => this.props.toggleFilter()}>
        <FontAwesomeIcon icon="times" />
      </div>
    </div>
  );

  filterSections = () => {
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
      <>
        <div className="flex-1 mr-2 filter-section">
          <b>
            <Translate contentKey="providerSite.serviceType" />
          </b>
          <Label className="sr-only" for="serviceType">
            <Translate contentKey="providerSite.serviceType" />
          </Label>
          <Select
            inputId="serviceType"
            components={{ MultiValueContainer }}
            isMulti
            options={
              taxonomyOptions &&
              _.uniqBy(_.get(taxonomyOptions, 'ServiceProvider', []).concat(_.get(taxonomyOptions, 'silo', [])), option => option['value'])
            }
            value={serviceTypes}
            onChange={this.handleServiceTypeChanged}
            styles={{
              ...this.selectStyle(),
              control: base => ({
                ...base
              }),
              multiValue: base => ({
                ...base
              })
            }}
          />
        </div>
        <div className="flex-1 mr-2 filter-section">
          <div>
            <b>
              <Translate contentKey="providerSite.location" />
            </b>
          </div>
          <div className="d-flex flex-row flex-fill location-filters">
            <Label className="sr-only" for="filter-city">
              <Translate contentKey="providerSite.city" />
            </Label>
            <Select
              onChange={this.handleCityChanged}
              options={cityList}
              placeholder={translate('providerSite.city')}
              value={_.find(cityList, c => c.value === city) || null}
              inputId="filter-city"
              className="flex-fill mr-1"
              styles={this.selectStyle()}
              isClearable
            />
            <Label className="sr-only" for="filter-county">
              <Translate contentKey="providerSite.county" />
            </Label>
            <Select
              inputId="filter-county"
              onChange={this.handleRegionChanged}
              options={regionList}
              placeholder={translate('providerSite.county')}
              value={_.find(regionList, r => r.value === region) || null}
              className="flex-fill mr-1"
              styles={this.selectStyle()}
              isClearable
            />
            <Label className="sr-only" for="filter-zipCode">
              <Translate contentKey="providerSite.zipCode" />
            </Label>
            <Select
              inputId="filter-zipCode"
              onChange={this.handleZipChanged}
              options={postalCodeList}
              placeholder={translate('providerSite.zipCode')}
              value={_.find(postalCodeList, c => c.value === zip) || null}
              className="flex-fill"
              styles={this.selectStyle()}
              isClearable
            />
          </div>
        </div>
      </>
    );
  };

  filterButtons = () => (
    <div className="mt-1 d-inline-flex align-items-center justify-content-center flex-wrap filter-section buttons">
      {this.props.children}
      <ButtonPill onClick={this.resetFilter} translate="providerSite.clear" className="mx-1 d-inline" />
      <ButtonPill className="button-pill-orange d-inline" onClick={this.applyFilter} translate="providerSite.apply" />
    </div>
  );

  render() {
    if (this.props.isModal) {
      return (
        <div>
          <this.filterHeader />
          <div className="filter-body">
            <this.filterSections />
          </div>
          <div className="filter-footer">
            <this.filterButtons />
          </div>
        </div>
      );
    } else {
      return (
        <>
          <this.filterSections />
          <this.filterButtons />
        </>
      );
    }
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
)(FilterBar);
