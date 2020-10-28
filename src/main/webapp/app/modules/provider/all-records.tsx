import React from 'react';
import {
  getAllProviderRecords,
  getProviderRecordsForMap,
  selectRecord,
  getAllProviderRecordsPublic
} from './provider-record.reducer';
import { connect } from 'react-redux';
import { Col, Row, Progress, Modal, Button } from 'reactstrap';
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
import { GOOGLE_API_KEY } from 'app/config/constants';
// tslint:disable-next-line:no-submodule-imports
import { uncheckFiltersChanged } from './provider-filter.reducer';
import PersistentMap from 'app/modules/provider/map';
import './all-records.scss';
import SearchBar from 'app/modules/provider/menus/search-bar';

const MEDIUM_WIDTH_BREAKPOINT = 991;
const LARGE_WIDTH_BREAKPOINT = 992;
const MOBILE_WIDTH_BREAKPOINT = 768;
const DESKTOP_WIDTH_BREAKPOINT = 769;
const mapUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + GOOGLE_API_KEY;
const GRID_VIEW = 'GRID';
const LIST_VIEW = 'LIST';
const INACTIVE_COLOR = '#9aaabb';
const MY_LOCATION_BUTTON_POSITION_RIGHT_MOBILE = '60px';
const MY_LOCATION_BUTTON_POSITION_BOTTOM_MOBILE = '24px';
const MY_LOCATION_BUTTON_POSITION_RIGHT = '65px';
const MY_LOCATION_BUTTON_POSITION_BOTTOM = '32px';
export const MAX_PINS_ON_MAP = 50;

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    google: any;
  }
}

window.google = window.google || {};

export interface IAllRecordsProps extends StateProps, DispatchProps {
  siloName?: string;
  urlBase: string;
  toggleMapView: any;
  isMapView: boolean;
  referring: boolean;
}

export interface IAllRecordsState extends IPaginationBaseState {
  itemsPerPage: number;
  activePage: number;
  sortingOpened: boolean;
  filterOpened: boolean;
  isSticky: boolean;
  recordViewType: 'GRID' | 'LIST';
  isRecordHighlighted: boolean;
  selectedLat: number;
  selectedLng: number;
  showMyLocation: boolean;
  boundaryTimeout: number;
  boundaries: any;
  requestedBoundaries: any;
  searchArea: boolean;
  centeredAt: any;
  isSearchBarFocused: boolean;
}

export class AllRecords extends React.Component<IAllRecordsProps, IAllRecordsState> {
  controlLineContainerRef: any;
  pageEndRef: any;

  constructor(props) {
    super(props);
    const { providerSearchPreferences } = this.props.account ? getSearchPreferences(this.props.account.login) : null;
    this.state = {
      itemsPerPage: 6,
      activePage: 0,
      sortingOpened: false,
      filterOpened: false,
      isMapView: false,
      isSticky: false,
      isRecordHighlighted: false,
      selectedLat: null,
      selectedLng: null,
      showMyLocation: false,
      recordViewType: GRID_VIEW,
      boundaryTimeout: 0,
      boundaries: null,
      searchArea: false,
      centeredAt: null,
      isSearchBarFocused: false,
      ...providerSearchPreferences
    };
    this.controlLineContainerRef = React.createRef();
    this.pageEndRef = React.createRef();
  }

  componentDidMount() {
    this.getRecords(true);
    window.addEventListener('scroll', _.debounce(this.handleScroll, 50), true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.providerFilter !== prevProps.providerFilter || prevProps.search !== this.props.search) {
      if (this.props.isMapView) {
        this.getRecordsForMap();
      } else {
        this.getRecords(true);
      }
    }

    if (!prevProps.isMapView && this.props.isMapView) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => this.handleScroll);
  }

  handleScroll = () => {
    if (this.controlLineContainerRef.current) {
      const rect = this.controlLineContainerRef.current.getBoundingClientRect();
      this.setState({
        isSticky: rect.top <= (this.state.isSticky ? rect.height : 0)
      });
    }
  };

  getRecords(isInitLoading = false) {
    const { itemsPerPage, activePage, sort, order } = this.state;
    const { siloName } = this.props;

    if (siloName) {
      this.props.getAllProviderRecordsPublic(
        siloName,
        activePage,
        itemsPerPage,
        `${sort},${order}`,
        this.props.providerFilter,
        this.props.search,
        isInitLoading
      );
    } else {
      this.props.getAllProviderRecords(
        activePage,
        itemsPerPage,
        `${sort},${order}`,
        this.props.providerFilter,
        this.props.search,
        isInitLoading
      );
    }
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

  toggleViewType = () => {
    this.setState({ recordViewType: this.state.recordViewType === GRID_VIEW ? LIST_VIEW : GRID_VIEW });
  };

  toggleFilter = () => {
    this.setState({ filterOpened: !this.state.filterOpened, isRecordHighlighted: false });
  };

  getRecordsForMap = () => {
    const { siloName, providerFilter, search } = this.props;
    this.setState({
      requestedBoundaries: this.state.boundaries,
      searchArea: false
    });
    this.props.getProviderRecordsForMap(siloName, providerFilter, search, this.state.boundaries, MAX_PINS_ON_MAP);
  };

  selectRecord = record => {
    const { siloName } = this.props;
    const { orgId, lat, lng } = record;
    this.props.selectRecord(orgId, siloName);
    this.setState({
      isRecordHighlighted: true,
      filterOpened: false,
      selectedLat: lat,
      selectedLng: lng,
      showMyLocation: false
    });
  };

  closeRecordCard = () => {
    this.setState({ isRecordHighlighted: false });
  };

  scrollToBottom = () => {
    if (this.pageEndRef.current) {
      this.pageEndRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'start'
      });
    }
  };

  toggleMapView = () => {
    const { filtersChanged } = this.props;
    if (this.props.isMapView && filtersChanged) {
      this.getRecords(true);
      this.props.uncheckFiltersChanged();
    }
    this.props.toggleMapView();
    this.setState({
      filterOpened: false,
      isRecordHighlighted: false,
      selectedLat: null,
      selectedLng: null,
      showMyLocation: false,
      boundaries: null
    });
  };

  getFirstPage = () => {
    this.setState({ activePage: 0 });
  };

  sort = (sort, order) => {
    if (this.props.account) {
      setProviderSort(this.props.account.login, sort, order);
    }

    ReactGA.event({ category: 'UserActions', action: 'Sorting Records' });

    this.setState({ sort, order, activePage: 0 }, () => {
      this.getRecords(true);
    });
  };

  centerMapOnMyLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        selectedLat: position.coords.latitude,
        selectedLng: position.coords.longitude,
        showMyLocation: true,
        searchArea: true,
        centeredAt: new Date()
      });
    });
  };

  mapRecords = ({ records, isBesideFilter = false, isInAllRecordSection = false }) => {
    const { recordViewType } = this.state;
    const { urlBase } = this.props;
    return _.map(records, record => (
      <div
        key={record.organization.id}
        className={`${
          recordViewType === LIST_VIEW && isInAllRecordSection ? 'col-12' : isBesideFilter ? 'col-lg-6 col-md-12' : 'col-lg-4 col-md-6'
        }`}
      >
        <div className="mb-4">
          <RecordCard
            fullWidth={recordViewType === LIST_VIEW && isInAllRecordSection}
            record={record}
            link={`${urlBase ? `${urlBase}/` : ''}single-record-view/${record.organization.id}`}
            referring={this.props.referring}
          />
        </div>
      </div>
    ));
  };

  onMapBoundariesChanged = boundaries => {
    const initialBoundaries = _.isEmpty(this.state.boundaries);
    const boundariesChanged = !_.isEqual(boundaries, this.state.requestedBoundaries);
    this.setState(
      {
        boundaries
      },
      () => {
        if ((this.state.searchArea && boundariesChanged) || initialBoundaries) {
          this.getRecordsForMap();
        }
      }
    );
  };

  canRedoSearch = () => !this.props.loading && !_.isEqual(this.state.requestedBoundaries, this.state.boundaries);

  onSearchClick = () => {
    if (this.canRedoSearch()) {
      this.getRecordsForMap();
    }
  };

  mapWithFilter = allRecords => {
    const { filterOpened } = this.state;
    const { siloName, isMapView } = this.props;
    const fourCardsBesideFilter = _.slice(allRecords, 0, 4);
    const upperTwoCardsBesideFilter = _.slice(allRecords, 0, 2);
    const lowerTwoCardsBesideFilter = _.slice(allRecords, 2, 4);
    const elementsAfterFilter = _.slice(allRecords, 4);
    return (
      <div className="m-0 p-0 w-100">
        <Row noGutters>
          <Col md={12}>
            <Row noGutters>
              <div className="col-lg-8 col-md-6">
                <MediaQuery minDeviceWidth={LARGE_WIDTH_BREAKPOINT}>
                  <Row noGutters>
                    {this.mapRecords({ isInAllRecordSection: false, records: fourCardsBesideFilter, isBesideFilter: true })}
                  </Row>
                </MediaQuery>
                <MediaQuery maxDeviceWidth={MEDIUM_WIDTH_BREAKPOINT}>
                  <Row noGutters>
                    {this.mapRecords({ isInAllRecordSection: false, records: upperTwoCardsBesideFilter, isBesideFilter: true })}
                  </Row>
                </MediaQuery>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="filter-card mx-3 mb-4">
                  <FilterCard
                    siloName={siloName}
                    dropdownOpen={filterOpened}
                    toggleFilter={this.toggleFilter}
                    getFirstPage={this.getFirstPage}
                    isMapView={isMapView}
                  />
                </div>
              </div>
            </Row>
          </Col>
          <MediaQuery maxDeviceWidth={MEDIUM_WIDTH_BREAKPOINT}>
            <Col md={12}>
              <Row noGutters>{this.mapRecords({ isInAllRecordSection: true, records: lowerTwoCardsBesideFilter })}</Row>
            </Col>
          </MediaQuery>
          <Col md={12}>
            <Row noGutters>{this.mapRecords({ isInAllRecordSection: true, records: elementsAfterFilter })}</Row>
          </Col>
        </Row>
      </div>
    );
  };

  mapOverlay = () =>
    this.state.boundaries && (
      <div className="d-flex flex-column align-items-center">
        <div className={`map-overlay-top ${this.state.isSticky ? 'sticky' : ''}`}>
          {this.props.isMapView && this.state.isSticky && this.sortContainer()}
          <div className="d-flex flex-column align-items-center">
            <ButtonPill onClick={this.onSearchClick} className={`search-area-button ${this.canRedoSearch() ? '' : 'disabled'}`}>
              <FontAwesomeIcon icon="search" size="lg" />
              <Translate contentKey="providerSite.searchThisArea" />
            </ButtonPill>
            {this.props.allRecordsForMap.length === MAX_PINS_ON_MAP && (
              <span className="small">
                <Translate contentKey="providerSite.recordLimit" interpolate={{ count: MAX_PINS_ON_MAP }} />
              </span>
            )}
            {this.props.loading && (
              <div className="spinner-border mt-1" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  mapOverlayBottom = (isMobile = false) =>
    this.state.boundaries && (
      <div
        className="position-absolute"
        style={{
          right: isMobile ? MY_LOCATION_BUTTON_POSITION_RIGHT_MOBILE : MY_LOCATION_BUTTON_POSITION_RIGHT,
          bottom: isMobile ? MY_LOCATION_BUTTON_POSITION_BOTTOM_MOBILE : MY_LOCATION_BUTTON_POSITION_BOTTOM
        }}
      >
        <Button aria-label={translate('providerSite.centerMapOnMyLocation')} color="light" onClick={this.centerMapOnMyLocation}>
          <FontAwesomeIcon icon="map-marker" size="lg" />
        </Button>
      </div>
    );

  mapView = () => {
    const { allRecordsForMap, selectedRecord, urlBase, siloName, isMapView } = this.props;
    const { filterOpened, isRecordHighlighted, selectedLat, selectedLng, showMyLocation, centeredAt } = this.state;
    const mapProps = {
      googleMapURL: mapUrl,
      records: allRecordsForMap,
      lat: selectedLat,
      lng: selectedLng,
      loadingElement: <div style={{ height: '100%' }} />,
      mapElement: <div style={{ height: '100%' }} />,
      onMarkerClick: this.selectRecord,
      showMyLocation,
      centeredAt,
      onBoundariesChanged: this.onMapBoundariesChanged
    };
    return (
      <>
        <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
          <Col md={12} className="px-0 mx-0 absolute-card-container">
            <div style={{ height: `calc(100vh - 80px)` }}>
              {this.mapOverlay()}
              <PersistentMap {...mapProps} containerElement={<div style={{ height: `calc(100vh - 80px)` }} />} />
              {this.mapOverlayBottom(true)}
              {isRecordHighlighted && selectedRecord && !filterOpened ? (
                <Col md={4} className={`col-md-4 pr-0 selected-record absolute-card`}>
                  <div className="px-2">
                    <RecordCard
                      record={selectedRecord}
                      link={`${urlBase ? `${urlBase}/` : ''}single-record-view/${selectedRecord.organization.id}`}
                      closeCard={this.closeRecordCard}
                      coordinates={selectedLat && selectedLng ? `${selectedLat},${selectedLng}` : null}
                      referring={this.props.referring}
                    />
                  </div>
                </Col>
              ) : null}
            </div>
          </Col>
        </MediaQuery>
        <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
          <Row className="mb-5 mx-3 flex-column-stretch">
            <div className="d-flex flex-grow-1">
              <Col
                md={isRecordHighlighted || filterOpened ? 8 : 12}
                className="pb-2 pl-0 pr-1 map-view position-relative flex-column-stretch"
              >
                {this.mapOverlay()}
                <PersistentMap {...mapProps} containerElement={<div className="flex-column-stretch" style={{ minHeight: 400 }} />} />
                {this.mapOverlayBottom()}
              </Col>
              {isRecordHighlighted && selectedRecord && !filterOpened ? (
                <Col md={4} className={`col-md-4 pr-0 selected-record`}>
                  <RecordCard
                    record={selectedRecord}
                    link={`${urlBase ? `${urlBase}/` : ''}single-record-view/${selectedRecord.organization.id}`}
                    coordinates={selectedLat && selectedLng ? `${selectedLat},${selectedLng}` : null}
                    referring={this.props.referring}
                  />
                </Col>
              ) : null}
              {filterOpened &&
                !isRecordHighlighted && (
                  <Col md={4}>
                    <div className="filter-card mb-4">
                      <FilterCard
                        siloName={siloName}
                        dropdownOpen={filterOpened}
                        toggleFilter={this.toggleFilter}
                        getFirstPage={this.getFirstPage}
                        isMapView={isMapView}
                      />
                    </div>
                  </Col>
                )}
            </div>
          </Row>
        </MediaQuery>
      </>
    );
  };

  gridView = () => {
    const { allRecords, allRecordsTotal } = this.props;
    const { filterOpened } = this.state;
    const hasReachedMaxItems = allRecords.length === parseInt(allRecordsTotal, 10);
    return (
      <div>
        <Row noGutters>
          <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>{this.mapRecords({ records: allRecords })}</MediaQuery>
          <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
            {filterOpened ? this.mapWithFilter(allRecords) : this.mapRecords({ records: allRecords, isInAllRecordSection: true })}
          </MediaQuery>
        </Row>

        <div className="mb-4 text-center d-flex justify-content-center">
          <ButtonPill
            onClick={() => this.handleLoadMore(hasReachedMaxItems)}
            className={`d-inline ${hasReachedMaxItems ? 'disabled' : ''}`}
          >
            <Translate contentKey="providerSite.loadMore" />
          </ButtonPill>
        </div>
      </div>
    );
  };

  progress = () => {
    const { allRecords, allRecordsTotal, isMapView } = this.props;
    if (isMapView) {
      return null;
    }
    return (
      <div className="d-flex">
        <div className="align-self-center ml-4">{allRecords && allRecords.length}</div>
        <div className="mx-2 align-self-center">
          <Progress value={((allRecords && allRecords.length) / allRecordsTotal) * 100} />
        </div>
        <div className="align-self-center">{allRecordsTotal}</div>
      </div>
    );
  };

  sortContainer = () => (
    <div>
      <div className={`sort-container`}>
        <ButtonPill onClick={this.toggleMapView} className="mr-1">
          <span>
            <FontAwesomeIcon icon={this.props.isMapView ? 'th' : 'map'} />
            &nbsp;
            <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
              {translate(this.props.isMapView ? 'providerSite.gridView' : 'providerSite.mapView')}
            </MediaQuery>
          </span>
        </ButtonPill>
        <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
          <ButtonPill onClick={this.toggleViewType} className="mr-1">
            <span>
              <FontAwesomeIcon color={this.state.recordViewType === GRID_VIEW ? 'black' : INACTIVE_COLOR} icon="th" />
              {' | '}
              <FontAwesomeIcon color={this.state.recordViewType === LIST_VIEW ? 'black' : INACTIVE_COLOR} icon="bars" />
            </span>
          </ButtonPill>
        </MediaQuery>
        <SortSection
          dropdownOpen={this.state.sortingOpened}
          toggleSort={() => this.toggleSorting()}
          values={PROVIDER_SORT_ARRAY}
          sort={this.state.sort}
          order={this.state.order}
          sortFunc={this.sort}
        />
        <ButtonPill onClick={this.toggleFilter} translate="providerSite.filter" />
      </div>
    </div>
  );

  onSearchBarSwitchFocus = (isSearchBarFocused: boolean) => {
    if (isSearchBarFocused && !this.props.siloName && this.controlLineContainerRef.current) {
      this.controlLineContainerRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'start'
      });
    }
    this.setState({
      isSearchBarFocused
    });
  }

  render() {
    const { siloName, isMapView, isReferralEnabled } = this.props;
    const { filterOpened, isSticky, isSearchBarFocused } = this.state;
    return (
      <main className="all-records flex-column-stretch">
        <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
          <Modal isOpen={filterOpened} centered toggle={this.toggleFilter} contentClassName="filter-modal">
            <div className="filter-card mx-3 mb-4">
              <FilterCard
                siloName={siloName}
                dropdownOpen={filterOpened}
                toggleFilter={this.toggleFilter}
                getFirstPage={this.getFirstPage}
                isMapView={isMapView}
              />
            </div>
          </Modal>
        </MediaQuery>
        <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
          {siloName ? null :
            <div className="all-records-title">
              <Translate contentKey={isReferralEnabled ? 'providerSite.referElsewhere' : 'providerSite.allRecords'} />
            </div>
          }
        </MediaQuery>
        <div className={`control-line-container${siloName || isMapView ? '-solid' : ''}`} ref={this.controlLineContainerRef}>
          <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
            <Row className="search">
              <Col className="height-fluid">
                <SearchBar onSwitchFocus={this.onSearchBarSwitchFocus} />
              </Col>
            </Row>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
            {siloName ? null :
              <div className="all-records-title">
                <Translate contentKey={isReferralEnabled ? 'providerSite.referElsewhere' : 'providerSite.allRecords'} />
              </div>
            }
            <div className={isSearchBarFocused ? 'on-top' : ''}>
              <Row className="search">
                <Col className="height-fluid">
                  <SearchBar onSwitchFocus={this.onSearchBarSwitchFocus} />
                </Col>
              </Row>
            </div>
            {isSearchBarFocused ? <div className="darken-overlay" /> : null}
          </MediaQuery>
          {(!isMapView || !isSticky) && this.sortContainer()}
        </div>
        {isMapView ? <this.mapView /> : <this.gridView />}
        <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
          <div ref={this.pageEndRef} />
        </MediaQuery>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  allRecords: state.providerRecord.allRecords,
  allRecordsTotal: state.providerRecord.allRecordsTotal,
  account: state.authentication.account,
  providerFilter: state.providerFilter.filter,
  search: state.search.text,
  allRecordsForMap: state.providerRecord.allRecordsForMap,
  selectedRecord: state.providerRecord.selectedRecord,
  filtersChanged: state.providerFilter.filtersChanged,
  loading: state.providerRecord.loading,
  isReferralEnabled: state.authentication.account.siloIsReferralEnabled
});

const mapDispatchToProps = {
  getAllProviderRecords,
  getProviderRecordsForMap,
  selectRecord,
  getAllProviderRecordsPublic,
  uncheckFiltersChanged
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRecords);
