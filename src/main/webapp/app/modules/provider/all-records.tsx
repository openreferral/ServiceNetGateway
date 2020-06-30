import React, { ComponentClass, StatelessComponent } from 'react';
import { getAllProviderRecords } from './provider-record.reducer';
import { connect } from 'react-redux';
import { Col, Row, Progress, Modal } from 'reactstrap';
import _ from 'lodash';
import RecordCard from 'app/modules/provider/record/record-card';
import { IPaginationBaseState, Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SortSection from 'app/modules/provider/sort-section';
import { getSearchPreferences, PROVIDER_SORT_ARRAY, setProviderSort } from 'app/shared/util/search-utils';
import ReactGA from 'react-ga';
import ButtonPill from './shared/button-pill';
import FilterCard from './filter-card';
import MediaQuery from 'react-responsive';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { GOOGLE_API_KEY } from 'app/config/constants';

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    google: any;
  }
}

window.google = window.google || {};

export interface IAllRecordsProps extends StateProps, DispatchProps {}

export interface IAllRecordsState extends IPaginationBaseState {
  itemsPerPage: number;
  activePage: number;
  sortingOpened: boolean;
  filterOpened: boolean;
  isMapView: boolean;
  isRecordHighlighted: boolean;
  selectedRecord: string;
  selectedLat: number;
  selectedLng: number;
}

const withLatLong = (
  wrappedComponent: string | ComponentClass<any> | StatelessComponent<any>
): string | React.ComponentClass<any> | React.StatelessComponent<any> => wrappedComponent;

const extractMarkerLocations = props => {
  const markerLocations = [];
  if (props.records) {
    props.records.map(record => {
      const orgId = record.organization.id;
      if (record.locations) {
        record.locations.map(l => {
          if (l.location.geocodingResults) {
            l.location.geocodingResults.map(geoResult =>
              markerLocations.push({ orgId, lat: geoResult.latitude, lng: geoResult.longitude })
            );
          }
        });
      }
    });
  }
  return markerLocations;
};

const Map = withScriptjs(
  withGoogleMap(
    withLatLong(props => {
      const markerLocations = extractMarkerLocations(props);
      const bounds = new window.google.maps.LatLngBounds();
      markerLocations.map(coords => {
        const latLng = new window.google.maps.LatLng(coords.lat, coords.lng);
        bounds.extend(latLng);
      });

      return (
        <GoogleMap
          ref={map => map && !props.lat && !props.lng && map.fitBounds(bounds)}
          defaultZoom={8}
          center={{ lat: props.lat || 38.5816, lng: props.lng || -121.4944 }}
          defaultOptions={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: false }}
        >
          {markerLocations.map((marker, idx) => (
            <Marker
              key={`${marker.lat}-${marker.lng}-${idx}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => props.onMarkerClick(marker)}
            />
          ))}
        </GoogleMap>
      );
    })
  )
);
const mapUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + GOOGLE_API_KEY;

export class AllRecords extends React.Component<IAllRecordsProps, IAllRecordsState> {
  constructor(props) {
    super(props);
    const { providerSearchPreferences } = getSearchPreferences(this.props.account.login);
    this.state = {
      itemsPerPage: 6,
      activePage: 0,
      sortingOpened: false,
      filterOpened: false,
      isMapView: false,
      isRecordHighlighted: false,
      selectedRecord: null,
      selectedLat: null,
      selectedLng: null,
      ...providerSearchPreferences
    };
  }

  componentDidMount() {
    this.getRecords(true);
  }

  componentDidUpdate(prevProps) {
    if (this.props.providerFilter !== prevProps.providerFilter || prevProps.search !== this.props.search) {
      this.getRecords(true);
    }
  }

  getRecords(isInitLoading = false) {
    const { itemsPerPage, activePage, sort, order } = this.state;
    this.props.getAllProviderRecords(
      activePage,
      itemsPerPage,
      `${sort},${order}`,
      this.props.providerFilter,
      this.props.search,
      isInitLoading
    );
  }

  getAllRecords = () => {
    this.getRecords(false);
  };

  handleLoadMore = hasReachedMaxItems => {
    if (!hasReachedMaxItems) {
      this.setState({ activePage: this.state.activePage + 1 }, () => this.getAllRecords());
    }
  };

  toggleSorting = () => {
    this.setState({ sortingOpened: !this.state.sortingOpened });
  };

  toggleFilter = () => {
    this.setState({ filterOpened: !this.state.filterOpened, isRecordHighlighted: false });
  };

  getRecordsForMap = () => {
    const { sort, order } = this.state;
    this.props.getAllProviderRecords(0, this.props.allRecordsTotal, `${sort},${order}`, this.props.providerFilter, this.props.search, true);
  };

  selectRecord = record => {
    const { orgId, lat, lng } = record;
    this.setState({
      isRecordHighlighted: true,
      filterOpened: false,
      selectedRecord: orgId,
      selectedLat: lat,
      selectedLng: lng
    });
  };

  toggleMapView = () => {
    if (!this.state.isMapView) {
      this.getRecordsForMap();
    }
    this.setState({
      isMapView: !this.state.isMapView,
      filterOpened: false,
      isRecordHighlighted: false,
      selectedRecord: null,
      selectedLat: null,
      selectedLng: null
    });
  };

  getFirstPage = () => {
    this.setState({ activePage: 0 });
  };

  sort = (sort, order) => {
    setProviderSort(this.props.account.login, sort, order);

    ReactGA.event({ category: 'UserActions', action: 'Sorting Records' });

    this.setState({ sort, order, activePage: 0 }, () => {
      this.props.getAllProviderRecords(0, this.state.itemsPerPage, `${sort},${order}`, this.props.providerFilter, this.props.search, true);
    });
  };

  mapRecords = (records, colSize = 4) =>
    _.map(records, record => (
      <Col key={record.organization.id} md={colSize}>
        <div className="mb-4">
          <RecordCard record={record} link={`single-record-view/${record.organization.id}`} />
        </div>
      </Col>
    ));

  mapWithFilter = allRecords => {
    const { filterOpened } = this.state;
    const elementsBesideFilter = _.slice(allRecords, 0, 4);
    const elementsAfterFilter = _.slice(allRecords, 4);
    return (
      <div className="m-0 p-0 w-100">
        <Row noGutters>
          <Col md={12}>
            <Row noGutters>
              <Col md={8}>
                <Row noGutters>{this.mapRecords(elementsBesideFilter, 6)}</Row>
              </Col>
              <Col md={4}>
                <div className="filter-card mx-3 mb-4">
                  <FilterCard dropdownOpen={filterOpened} toggleFilter={this.toggleFilter} getFirstPage={this.getFirstPage} />
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row noGutters>{this.mapRecords(elementsAfterFilter, 4)}</Row>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { allRecords, allRecordsTotal } = this.props;
    const { sortingOpened, filterOpened, isMapView, isRecordHighlighted, selectedRecord, selectedLat, selectedLng } = this.state;
    const selected = allRecords && selectedRecord ? allRecords.find(record => record.organization.id === this.state.selectedRecord) : null;
    const hasReachedMaxItems = allRecords.length === parseInt(allRecordsTotal, 10);
    return (
      <div>
        <MediaQuery maxDeviceWidth={768}>
          <Modal isOpen={filterOpened} centered toggle={this.toggleFilter} contentClassName="filter-modal">
            <div className="filter-card mx-3 mb-4">
              <FilterCard dropdownOpen={filterOpened} toggleFilter={this.toggleFilter} getFirstPage={this.getFirstPage} />
            </div>
          </Modal>
        </MediaQuery>
        <div className="control-line-container">
          <div className="d-flex justify-content-between">
            <b className="align-self-center">
              <Translate contentKey="providerSite.allRecords" />
            </b>
            <div className="d-flex">
              <div className="align-self-center ml-4">{allRecords && allRecords.length}</div>
              <div className="mx-2 align-self-center">
                <Progress value={((allRecords && allRecords.length) / allRecordsTotal) * 100} />
              </div>
              <div className="align-self-center">{allRecordsTotal}</div>
            </div>
          </div>
          <div className="sort-container">
            {isMapView ? (
              <div className="button-pill" onClick={this.toggleMapView}>
                <span>
                  <FontAwesomeIcon icon="th" />
                  &nbsp;
                  {translate('providerSite.gridView')}
                </span>
              </div>
            ) : (
              <div className="button-pill" onClick={this.toggleMapView}>
                <span>
                  <FontAwesomeIcon icon="map" />
                  &nbsp;
                  {translate('providerSite.mapView')}
                </span>
              </div>
            )}
            <SortSection
              dropdownOpen={sortingOpened}
              toggleSort={() => this.toggleSorting()}
              values={PROVIDER_SORT_ARRAY}
              sort={this.state.sort}
              order={this.state.order}
              sortFunc={this.sort}
            />
            <ButtonPill onClick={this.toggleFilter} translate="providerSite.filter" />
          </div>
        </div>
        {isMapView ? (
          <Row className="mb-4 mx-3">
            <Col md={isRecordHighlighted || filterOpened ? 8 : 12} className="pb-2 px-0">
              <Map
                googleMapURL={mapUrl}
                records={allRecords}
                lat={selectedLat}
                lng={selectedLng}
                loadingElement={<div style={{ height: '100%' }} />}
                containerElement={<div style={{ height: '400px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                onMarkerClick={this.selectRecord}
              />
            </Col>
            {isRecordHighlighted && selected && !filterOpened ? (
              <Col md={4}>
                <RecordCard record={selected} link={`single-record-view/${selected.organization.id}`} />
              </Col>
            ) : null}
            <MediaQuery minDeviceWidth={769}>
              {filterOpened &&
                !isRecordHighlighted && (
                  <Col md={4}>
                    <div className="filter-card mx-3 mb-4">
                      <FilterCard dropdownOpen={filterOpened} toggleFilter={this.toggleFilter} getFirstPage={this.getFirstPage} />
                    </div>
                  </Col>
                )}
            </MediaQuery>
          </Row>
        ) : (
          <div>
            <Row noGutters>
              <MediaQuery maxDeviceWidth={768}>{this.mapRecords(allRecords)}</MediaQuery>
              <MediaQuery minDeviceWidth={769}>{filterOpened ? this.mapWithFilter(allRecords) : this.mapRecords(allRecords)}</MediaQuery>
            </Row>
            <div className="button-pill mb-4 text-center">
              <div
                className={`d-inline button-pill ${hasReachedMaxItems ? 'disabled' : ''}`}
                onClick={() => this.handleLoadMore(hasReachedMaxItems)}
              >
                <Translate contentKey="providerSite.loadMore" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allRecords: state.providerRecord.allRecords,
  allRecordsTotal: state.providerRecord.allRecordsTotal,
  account: state.authentication.account,
  providerFilter: state.providerFilter.filter,
  search: state.search.text
});

const mapDispatchToProps = {
  getAllProviderRecords
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRecords);
