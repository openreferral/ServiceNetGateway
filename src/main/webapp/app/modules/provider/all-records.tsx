import React from 'react';
import {
  getAllProviderRecords,
  getProviderRecordsForMap,
  selectRecord,
  getAllProviderRecordsPublic,
  getRecordsAvailableToClaim,
  resetRecordsToClaim
} from './provider-record.reducer';
import { claimEntities } from 'app/entities/organization/organization.reducer';
import { connect } from 'react-redux';
import { Col, Row, Progress, Modal, Button, Spinner } from 'reactstrap';
import _ from 'lodash';
import RecordCard from 'app/modules/provider/record/record-card';
import { IPaginationBaseState, Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SortSection from 'app/modules/provider/sort-section';
import { getSearchPreferences, PROVIDER_SORT_ARRAY, setProviderSort } from 'app/shared/util/search-utils';
import ReactGA from 'react-ga';
import ButtonPill from './shared/button-pill';
import FilterCard from './filter-card';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import {
  DESKTOP_WIDTH_BREAKPOINT,
  GOOGLE_API_KEY,
  LARGE_WIDTH_BREAKPOINT,
  MEDIUM_WIDTH_BREAKPOINT,
  MOBILE_WIDTH_BREAKPOINT
} from 'app/config/constants';
// tslint:disable-next-line:no-submodule-imports
import { uncheckFiltersChanged } from './provider-filter.reducer';
import PersistentMap from 'app/modules/provider/map';
import './all-records.scss';
import SearchBar from 'app/modules/provider/shared/search-bar';
import InfiniteScroll from 'react-infinite-scroller';
import { isIOS } from 'react-device-detect';
import ReferralModal, { BENEFICIARY_CHECK_IN_TAB, REFERRAL_TAB } from 'app/modules/provider/referral/referral-modal';

const mapUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + GOOGLE_API_KEY;
const GRID_VIEW = 'GRID';
const LIST_VIEW = 'LIST';
const INACTIVE_COLOR = '#9aaabb';
const MY_LOCATION_BUTTON_POSITION_RIGHT_MOBILE = '60px';
const MY_LOCATION_BUTTON_POSITION_BOTTOM_MOBILE = '24px';
const MY_LOCATION_BUTTON_POSITION_RIGHT = '65px';
const MY_LOCATION_BUTTON_POSITION_BOTTOM = '32px';
export const MAX_PINS_ON_MAP = 50;
const RECORD_HEIGHT = 274;
const TOP_HEIGHT_MOBILE = 115 + 274 + 21 + 141; // height of: hero-image + user-cards-container + slick-dots + control-line-container
const TOP_HEIGHT_DESKTOP = 138 + 274 + 21 + 107; // height of: hero-image + user-cards-container + slick-dots + control-line-container (with title)
const CTRL_LINE_HEIGHT = 121; // Height of control-line-container with top padding

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
  claimModalActivePage: number;
  sortingOpened: boolean;
  filterOpened: boolean;
  claimRecordsOpened: boolean;
  doneClaiming: boolean;
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
  appContainerHeight: number;
  iOSMapHeight: any;
  referralModalTab: string;
}

export class AllRecords extends React.Component<IAllRecordsProps, IAllRecordsState> {
  controlLineContainerRef: any;
  pageEndRef: any;
  mapContainerRef: any;
  gridViewRef: any;

  constructor(props) {
    super(props);
    const { providerSearchPreferences } = this.props.account ? getSearchPreferences(this.props.account.login) : null;
    this.state = {
      appContainerHeight: 0,
      itemsPerPage: 6,
      activePage: 0,
      claimModalActivePage: 0,
      sortingOpened: false,
      filterOpened: false,
      claimRecordsOpened: false,
      doneClaiming: false,
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
      iOSMapHeight: '100%',
      referralModalTab: null,
      ...providerSearchPreferences
    };
    this.controlLineContainerRef = React.createRef();
    this.pageEndRef = React.createRef();
    this.mapContainerRef = React.createRef();
    this.gridViewRef = React.createRef();
  }

  componentDidMount() {
    const { account, isAuthenticated } = this.props;
    if (!this.state.claimRecordsOpened && isAuthenticated && account && !account.hasClaimedRecords) {
      setTimeout(() => this.toggleClaimRecordsOpened(), 5000);
    }
    this.getRecords(true);
    window.addEventListener('resize', _.debounce(this.getAppContainerHeight, 50), true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.providerFilter !== prevProps.providerFilter || prevProps.search !== this.props.search) {
      this.setState(
        {
          activePage: 0
        },
        () => {
          if (this.props.isMapView) {
            this.getRecordsForMap();
          } else {
            this.getRecords(true);
          }
        }
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.getAppContainerHeight);
  }

  isMobile = () => useMediaQuery({ maxWidth: MOBILE_WIDTH_BREAKPOINT });

  getPaginationSize = height => {
    const { siloName } = this.props;

    const availableHeight =
      height - (this.isMobile ? (siloName ? CTRL_LINE_HEIGHT : TOP_HEIGHT_MOBILE) : siloName ? CTRL_LINE_HEIGHT : TOP_HEIGHT_DESKTOP);
    const size = Math.ceil(availableHeight / RECORD_HEIGHT) * 3;

    return size >= 6 ? size : 6;
  };

  setGridViewRef = gridViewRef => {
    this.gridViewRef.current = gridViewRef;
    this.getAppContainerHeight();
  };

  getAppContainerHeight = () => {
    const { appContainerHeight } = this.state;
    const element = document.getElementById('app-container');
    const newHeight = element ? element.clientHeight : 0;
    if (this.gridViewRef.current && appContainerHeight && newHeight > appContainerHeight) {
      const size = this.getPaginationSize(newHeight);
      this.setState({ appContainerHeight: newHeight, itemsPerPage: size, activePage: 0 }, () => this.getRecords(true));
    }
  };

  getRecords(isInitLoading = false) {
    const { itemsPerPage, activePage, sort, order } = this.state;
    const { siloName } = this.props;

    let newSize = itemsPerPage;
    if (isInitLoading && this.gridViewRef.current) {
      const element = document.getElementById('app-container');
      const currentHeight = element ? element.clientHeight : 0;
      const size = this.getPaginationSize(currentHeight);
      this.setState({ appContainerHeight: currentHeight, itemsPerPage: size, activePage: 0 });
      newSize = size;
    }

    if (siloName) {
      this.props.getAllProviderRecordsPublic(
        siloName,
        activePage,
        newSize,
        `${sort},${order}`,
        this.props.providerFilter,
        this.props.search,
        isInitLoading
      );
    } else {
      this.props.getAllProviderRecords(
        activePage,
        newSize,
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
    const { loading } = this.props;
    if (!hasReachedMaxItems && !loading) {
      this.setState({ activePage: this.state.activePage + 1 }, () => this.getAllRecords());
    }
  };

  handleLoadMoreClaimModal = hasReachedMaxItems => {
    if (!hasReachedMaxItems) {
      this.setState({ claimModalActivePage: this.state.claimModalActivePage + 1 }, () =>
        this.props.getRecordsAvailableToClaim(this.state.claimModalActivePage, 9, false)
      );
    }
  };

  toggleSorting = () => {
    this.setState({ sortingOpened: !this.state.sortingOpened });
  };

  toggleViewType = () => {
    const recordViewType = this.state.recordViewType;
    if (this.props.isMapView) {
      this.toggleMapView();
    } else {
      if (recordViewType === GRID_VIEW) {
        this.setState({ recordViewType: LIST_VIEW });
      } else {
        this.toggleMapView();
      }
    }
  };

  toggleFilter = () => {
    this.setState({ filterOpened: !this.state.filterOpened, isRecordHighlighted: false });
  };

  toggleClaimRecordsOpened = () => {
    this.setState({ claimRecordsOpened: !this.state.claimRecordsOpened, claimModalActivePage: 0, doneClaiming: false }, () => {
      if (this.state.claimRecordsOpened) {
        this.props.getRecordsAvailableToClaim(0, 9, true);
      }
    });
  };

  claimRecords = () => {
    this.setState({ doneClaiming: true, claimModalActivePage: 0 }, () => this.props.claimEntities(this.props.recordsToClaim));
  };

  closeClaiminging = () => {
    this.setState({ claimRecordsOpened: false }, () => this.props.resetRecordsToClaim());
  };

  claimMore = () => {
    this.setState({ doneClaiming: false }, () => {
      this.props.resetRecordsToClaim();
      this.props.getRecordsAvailableToClaim(0, 9, true);
    });
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
      boundaries: null,
      recordViewType: GRID_VIEW
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

  mapRecordsForClaimModal = ({ records }) => {
    const { urlBase } = this.props;
    return _.map(records, record => (
      <div key={record.organization.id} className="col-12 col-lg-4 col-md-6">
        <div className="mb-4">
          <RecordCard
            fullWidth={false}
            record={record}
            link={`${urlBase ? `${urlBase}/` : ''}single-record-view/${record.organization.id}`}
            referring={false}
            claiming
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
      <>
        <div className="d-flex justify-content-between map-overlay-top">
          <div className="px-5" />
          {this.props.loading && (
            <div className="spinner-border mt-1" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <ButtonPill onClick={this.onSearchClick} className={`search-area-button ${this.canRedoSearch() ? '' : 'disabled'}`}>
            <FontAwesomeIcon icon="search" size="sm" className="mr-1" />
            <Translate contentKey="providerSite.searchThisArea" />
          </ButtonPill>
        </div>
        <div className="d-flex flex-column align-items-center map-overlay-search">
          {this.props.allRecordsForMap.length === MAX_PINS_ON_MAP && (
            <span className="small">
              <Translate contentKey="providerSite.recordLimit" interpolate={{ count: MAX_PINS_ON_MAP }} />
            </span>
          )}
        </div>
      </>
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

  setMapContainerRef = mapContainerRef => {
    this.mapContainerRef.current = mapContainerRef;
    if (this.mapContainerRef.current) {
      const mapTop = mapContainerRef.getBoundingClientRect().top;
      const mapHeight = (document.documentElement ? document.documentElement.clientHeight : window.innerHeight) - mapTop;
      this.setState({
        iOSMapHeight: mapHeight
      });
    }
  };

  mapView = () => {
    const { allRecordsForMap, selectedRecord, urlBase, siloName, isMapView } = this.props;
    const { filterOpened, isRecordHighlighted, selectedLat, selectedLng, showMyLocation, centeredAt } = this.state;
    const isMobile = this.isMobile();
    const mapHeight = isIOS ? this.state.iOSMapHeight : '100%';
    const mapProps = {
      googleMapURL: mapUrl,
      records: allRecordsForMap,
      lat: selectedLat,
      lng: selectedLng,
      loadingElement: <div style={{ height: mapHeight }} />,
      mapElement: <div style={{ height: mapHeight }} />,
      onMarkerClick: this.selectRecord,
      showMyLocation,
      centeredAt,
      onBoundariesChanged: this.onMapBoundariesChanged
    };
    return (
      <>
        {isMobile ? (
          <Col md={12} className="px-0 mx-0 flex-grow-1 mobile-map-container" style={{ maxHeight: mapHeight }}>
            <div ref={this.setMapContainerRef} style={{ height: mapHeight }}>
              <div style={{ height: mapHeight }}>
                {this.mapOverlay()}
                <PersistentMap {...mapProps} containerElement={<div style={{ height: mapHeight }} />} />
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
            </div>
          </Col>
        ) : null}
        {!isMobile ? (
          <Row className="mb-5 mx-3 flex-column-stretch">
            <div className="d-flex flex-grow-1 mw-100">
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
        ) : null}
      </>
    );
  };

  title = isReferralEnabled => (
    <div className="all-records-title">
      {!isReferralEnabled && (
        <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
          <ButtonPill onClick={this.toggleClaimRecordsOpened} translate="providerSite.claim" />
        </MediaQuery>
      )}
      <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
        <ButtonPill onClick={this.toggleClaimRecordsOpened} translate="providerSite.claim" />
      </MediaQuery>
      {isReferralEnabled ? (
        <div className="button-container position-relative mt-1 mb-1">
          <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
            <ButtonPill onClick={this.toggleClaimRecordsOpened} className="mr-2" translate="providerSite.claim" />
          </MediaQuery>
          <ButtonPill onClick={this.openCheckInModal} className="mr-2">
            {translate('providerSite.beneficiaryCheckIn')}
          </ButtonPill>
          <ButtonPill onClick={this.openReferralModal}>
            {translate('providerSite.referElsewhere')}
            <div className={`referrals-counter ${this.props.referralCount > 99 ? 'referral-counter-big' : ''}`}>
              {this.props.referralCount}
            </div>
          </ButtonPill>
          <ReferralModal openTab={this.state.referralModalTab} handleClose={this.closeModal} />
        </div>
      ) : (
        <Translate contentKey={'providerSite.allRecords'} />
      )}
    </div>
  );

  gridView = () => {
    const { allRecords, allRecordsTotal, loading } = this.props;
    const { filterOpened, activePage } = this.state;
    const hasReachedMaxItems = allRecords.length === parseInt(allRecordsTotal, 10);
    return (
      <div ref={this.setGridViewRef}>
        <InfiniteScroll
          pageStart={activePage}
          loadMore={() => this.handleLoadMore(hasReachedMaxItems)}
          hasMore={!hasReachedMaxItems}
          loader={loading ? <Spinner key={0} color="primary" /> : null}
          threshold={0}
          initialLoad={false}
          useWindow={false}
          getScrollParent={() => document.getElementById('app-container')}
        >
          <Row noGutters>
            <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>{this.mapRecords({ records: allRecords })}</MediaQuery>
            <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
              {filterOpened ? this.mapWithFilter(allRecords) : this.mapRecords({ records: allRecords, isInAllRecordSection: true })}
            </MediaQuery>
          </Row>
        </InfiniteScroll>
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
    <div className="flex-grow-1 d-inline-flex">
      <ButtonPill onClick={this.toggleFilter} translate="providerSite.filter" className="mr-2" />
      <div className="sort-container mr-2">
        <SortSection
          dropdownOpen={this.state.sortingOpened}
          toggleSort={() => this.toggleSorting()}
          values={PROVIDER_SORT_ARRAY}
          sort={this.state.sort}
          order={this.state.order}
          sortFunc={this.sort}
        />
      </div>
    </div>
  );

  viewTypeButton = () => (
    <div>
      <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
        <ButtonPill onClick={this.toggleMapView} className="mr-1 view-type-button">
          <span>
            <FontAwesomeIcon color={!this.props.isMapView ? 'black' : INACTIVE_COLOR} icon="bars" />
            {' | '}
            <FontAwesomeIcon color={this.props.isMapView ? 'black' : INACTIVE_COLOR} icon="map" />
          </span>
        </ButtonPill>
      </MediaQuery>
      <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
        <ButtonPill onClick={this.toggleViewType} className="mr-1 view-type-button">
          <span>
            <FontAwesomeIcon
              color={!this.props.isMapView && this.state.recordViewType === GRID_VIEW ? 'black' : INACTIVE_COLOR}
              icon="th"
            />
            {' | '}
            <FontAwesomeIcon
              color={!this.props.isMapView && this.state.recordViewType === LIST_VIEW ? 'black' : INACTIVE_COLOR}
              icon="bars"
            />
            {' | '}
            <FontAwesomeIcon color={this.props.isMapView ? 'black' : INACTIVE_COLOR} icon="map" />
          </span>
        </ButtonPill>
      </MediaQuery>
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
  };

  openCheckInModal = () => {
    this.setState({
      referralModalTab: BENEFICIARY_CHECK_IN_TAB
    });
  };

  openReferralModal = () => {
    this.setState({
      referralModalTab: REFERRAL_TAB
    });
  };

  closeModal = () => {
    this.setState({
      referralModalTab: null
    });
  };

  render() {
    const {
      siloName,
      isMapView,
      isReferralEnabled,
      availableRecordsToClaim,
      loading,
      recordsAvailableToClaimTotal,
      recordsToClaim
    } = this.props;
    const { filterOpened, isSearchBarFocused, claimRecordsOpened, claimModalActivePage, doneClaiming } = this.state;
    const hasReachedMaxItemsClaimModal =
      availableRecordsToClaim && availableRecordsToClaim.length === parseInt(recordsAvailableToClaimTotal, 10);
    return (
      <main className="all-records flex-column-stretch">
        <div>
          <Modal
            isOpen={claimRecordsOpened}
            centered
            toggle={this.toggleClaimRecordsOpened}
            className={doneClaiming ? '' : 'claim-record-modal'}
          >
            {doneClaiming ? (
              <div className="d-flex flex-column justify-content-between align-items-center">
                <span className="pt-4 claim-modal-title">
                  <Translate contentKey="providerSite.succesfullClaim" interpolate={{ count: recordsToClaim.length || 0 }} />
                </span>
                <br />
                <span className="claim-modal-subtitle">
                  <Translate contentKey="providerSite.claimMore" />
                </span>
                <div className="d-flex w-100 justify-content-center py-4">
                  <ButtonPill onClick={() => this.claimMore()}>
                    <Translate contentKey="recordCard.yes" />
                  </ButtonPill>
                  &nbsp;
                  <ButtonPill onClick={() => this.closeClaiminging()}>
                    <Translate contentKey="recordCard.no" />
                  </ButtonPill>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-between align-items-center claim-record-modal-container p-1">
                <div className="d-flex flex-column justify-content-between align-items-center w-100 pt-4">
                  <span className="claim-modal-title">
                    <Translate contentKey="providerSite.claimTitle" />
                  </span>
                  <br />
                  <span className="claim-modal-subtitle">
                    <Translate contentKey="providerSite.claimSubtitle" />
                  </span>
                </div>
                <div id="claim-record-modal-content" className="pt-3 claim-record-modal-body">
                  {claimRecordsOpened && (
                    <InfiniteScroll
                      pageStart={claimModalActivePage}
                      loadMore={() => this.handleLoadMoreClaimModal(hasReachedMaxItemsClaimModal)}
                      hasMore={!hasReachedMaxItemsClaimModal}
                      loader={loading ? <Spinner key={0} color="primary" /> : null}
                      threshold={0}
                      initialLoad={false}
                      useWindow={false}
                      getScrollParent={() => document.getElementById('claim-record-modal-content')}
                    >
                      <Row noGutters>{this.mapRecordsForClaimModal({ records: availableRecordsToClaim })}</Row>
                    </InfiniteScroll>
                  )}
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <ButtonPill className="button-pill-green my-2" style={{ width: '120px' }} onClick={this.claimRecords}>
                    <Translate contentKey="recordCard.done" />
                  </ButtonPill>
                </div>
              </div>
            )}
          </Modal>
        </div>
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
        <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>{siloName || isMapView ? null : this.title(isReferralEnabled)}</MediaQuery>
        <div>
          <div className={`control-line-container${siloName || isMapView ? '-solid' : ''}`} ref={this.controlLineContainerRef}>
            <MediaQuery minDeviceWidth={DESKTOP_WIDTH_BREAKPOINT}>
              <Row className="search">
                <Col className="height-fluid">
                  <SearchBar onSwitchFocus={this.onSearchBarSwitchFocus} />
                </Col>
              </Row>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
              {siloName || isMapView ? null : this.title(isReferralEnabled)}
              <div className={isSearchBarFocused ? 'on-top' : ''}>
                <Row className="search">
                  <Col className="height-fluid">
                    <SearchBar onSwitchFocus={this.onSearchBarSwitchFocus} />
                  </Col>
                </Row>
              </div>
              {isSearchBarFocused ? <div className="darken-overlay" /> : null}
            </MediaQuery>
            <div className="d-flex flex-grow-1 justify-between mt-1">
              {this.sortContainer()}
              {this.viewTypeButton()}
            </div>
          </div>
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
  referralCount: state.providerRecord.referredRecords ? state.providerRecord.referredRecords.size : 0,
  isReferralEnabled: state.authentication.account.siloIsReferralEnabled,
  availableRecordsToClaim: state.providerRecord.recordsAvailableToClaim,
  recordsAvailableToClaimTotal: state.providerRecord.recordsAvailableToClaimTotal,
  recordsToClaim: state.providerRecord.recordsToClaim,
  isAuthenticated: state.authentication.isAuthenticated
});

const mapDispatchToProps = {
  getAllProviderRecords,
  getProviderRecordsForMap,
  selectRecord,
  getAllProviderRecordsPublic,
  uncheckFiltersChanged,
  getRecordsAvailableToClaim,
  claimEntities,
  resetRecordsToClaim
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRecords);
