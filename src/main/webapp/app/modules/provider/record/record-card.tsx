import './record-shared.scss';
import './record-card.scss';

import React from 'react';
import { TextFormat, Translate } from 'react-jhipster';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid, faCircle } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { measureWidths, getColumnCount, containerStyle } from 'app/shared/util/measure-widths';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { getUser } from 'app/modules/administration/user-management/user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import OwnerInfo from 'app/shared/layout/owner-info';
import ButtonPill from 'app/modules/provider/shared/button-pill';

const REMAINDER_WIDTH = 25;
const ONE_HOUR = 1000 * 60 * 60;
const LESS_THAN_24_HOURS = '#6AB9A4';
const LESS_THAN_48_HOURS = '#FAB28C';
const MORE_THAN_48_HOURS = '#808080';

const GOOGLE_MAP_DIRECTIONS_WITH_DESTINATION_URL = 'https://www.google.com/maps/dir//';

const MOBILE_WIDTH_BREAKPOINT = 768;
const EXTRA_LARGE_WIDTH_BREAKPOINT = 1200;
const DIRECTIONS_BUTTON_MOBILE_WIDTH_BREAKPOINT = 400;

export interface IRecordCardProps extends StateProps, DispatchProps {
  record: any;
  link: string;
  fullWidth?: boolean;
  closeCard?: Function;
  coordinates?: string;
}

export interface IRecordCardState {
  serviceWidths: any[];
  locationWidths: any[];
}

const ServiceColumn = service =>
  service && service.service ? (
    <div className="pill">
      <span>{service.service.name}</span>
    </div>
  ) : null;

const LocationColumn = location =>
  location && location.physicalAddress ? (
    <div className="location">
      <span>
        <FontAwesomeIcon icon={faCircle} className="blue" /> {location.physicalAddress.city}, {location.physicalAddress.stateProvince}
      </span>
    </div>
  ) : null;

const RemainderCount = count => <span className="remainder blue">+ {count}</span>;

const measureId = orgId => 'measure-' + orgId;

class RecordCard extends React.Component<IRecordCardProps, IRecordCardState> {
  state: IRecordCardState = {
    serviceWidths: [],
    locationWidths: []
  };

  componentDidMount() {
    const record = this.props.record;
    measureWidths(
      [...record.services.map(item => ServiceColumn(item)), ...record.locations.map(item => LocationColumn(item))],
      measureId(record.organization.id)
    ).then((serviceAndLocationWidths: any[]) => {
      this.setState({
        serviceWidths: serviceAndLocationWidths.slice(0, record.services.length),
        locationWidths: serviceAndLocationWidths.slice(record.services.length)
      });
    });
  }

  getBookmarkColor = () => {
    const { record } = this.props;
    const latestDailyUpdate = record.dailyUpdates.find(du => du.expiry === null);

    if (latestDailyUpdate === undefined) {
      return 'rgba(0, 0, 0, 0)';
    } else {
      const timeDelta = Date.now() - new Date(latestDailyUpdate.createdAt).getTime();
      const hours = Math.ceil(timeDelta / ONE_HOUR);
      if (hours < 24) {
        return LESS_THAN_24_HOURS;
      } else if (hours < 48) {
        return LESS_THAN_48_HOURS;
      } else {
        return MORE_THAN_48_HOURS;
      }
    }
  };

  cardTitle = () => {
    const { record, user, fullWidth } = this.props;
    return (
      <CardTitle>
        <div className="bookmark">
          <FontAwesomeIcon
            icon={record.organization.accountId === user.systemAccountId ? faBookmarkSolid : faBookmark}
            size={'lg'}
            color={this.getBookmarkColor()}
          />
        </div>
        <div className={`last-update${fullWidth ? '-full-width' : ''}`}>
          <div>
            <Translate contentKey="recordCard.lastUpdate" />
            {record.lastUpdated ? (
              <TextFormat value={record.lastUpdated} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
            ) : (
              <Translate contentKey="recordCard.unknown" />
            )}
          </div>
          <div className={`updated-by ${fullWidth ? 'ml-3' : ''}`}>
            <Translate contentKey="recordCard.by" />
            <OwnerInfo record={record} direction="top" />
          </div>
        </div>
        {this.props.coordinates && (
          <div>
            <ButtonPill className="button-pill-primary d-flex align-items-center px-0 py-1">
              <a
                href={`${GOOGLE_MAP_DIRECTIONS_WITH_DESTINATION_URL}${this.props.coordinates}`}
                target="_blank"
                rel="noopener noreferrer"
                className="alert-link w-100 h-100 d-flex align-items-center px-2"
                style={{ color: 'white' }}
              >
                <FontAwesomeIcon icon="directions" size="lg" />
                <MediaQuery minDeviceWidth={EXTRA_LARGE_WIDTH_BREAKPOINT}>
                  &nbsp;
                  <Translate contentKey="providerSite.directions">Directions</Translate>
                </MediaQuery>
                <MediaQuery minDeviceWidth={DIRECTIONS_BUTTON_MOBILE_WIDTH_BREAKPOINT} maxDeviceWidth={MOBILE_WIDTH_BREAKPOINT}>
                  &nbsp;
                  <Translate contentKey="providerSite.directions">Directions</Translate>
                </MediaQuery>
              </a>
            </ButtonPill>
          </div>
        )}
        {this.props.closeCard && (
          <div className="mx-2" onClick={() => this.props.closeCard()}>
            <FontAwesomeIcon icon="times" />
          </div>
        )}
      </CardTitle>
    );
  };

  serviceSection = () => {
    const { record } = this.props;
    return (
      <section className="services pt-0">
        {record.services.length > 0 ? (
          <AutoSizer disableHeight>
            {({ width }) => {
              const itemCount = getColumnCount(this.state.serviceWidths, width, REMAINDER_WIDTH);
              const overflow = itemCount < record.services.length;
              const totalItemCount = itemCount + (overflow ? 1 : 0);
              return (
                <List
                  height={50}
                  itemCount={totalItemCount}
                  itemSize={width / totalItemCount}
                  layout="horizontal"
                  width={width}
                  style={{ flex: 1 }}
                  className="pl-0"
                >
                  {({ index }) =>
                    index === itemCount ? RemainderCount(record.services.length - itemCount) : ServiceColumn(record.services[index])
                  }
                </List>
              );
            }}
          </AutoSizer>
        ) : null}
      </section>
    );
  };

  getHeader = () => {
    const { record, link, fullWidth } = this.props;
    return fullWidth ? (
      <div className="mb-2">
        <span style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '2em' }}>
          <Link className="organization-name-full-width" to={link}>
            {record.organization.name}
          </Link>
          <div style={{ flex: 1 }} className="ml-5">
            {fullWidth && <this.serviceSection />}
          </div>
        </span>
      </div>
    ) : (
      <div className="organization-name">
        <Link to={link}>{record.organization.name}</Link>
      </div>
    );
  };

  render() {
    const { record, fullWidth } = this.props;
    const latestDailyUpdate = record.dailyUpdates.find(du => du.expiry === null);
    return (
      <Card className={`record-shared record-card${fullWidth ? '-full-width' : ''} mx-3 mb-4`}>
        <this.cardTitle />
        <CardBody>
          <div id={measureId(record.organization.id)} style={containerStyle} />
          <this.getHeader />
          {latestDailyUpdate ? (
            <div className={`latest-daily-update${fullWidth ? '-full-width' : ''} mb-1`}>
              <span>
                Update (<TextFormat value={latestDailyUpdate.createdAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                ):
              </span>
              {!fullWidth ? <br /> : ' '}
              <span>{latestDailyUpdate.update}</span>
            </div>
          ) : (
            <div style={{ height: '30px' }} />
          )}
          {!fullWidth && <this.serviceSection />}
          <section className="locations">
            {record.locations.length > 0 ? (
              <AutoSizer disableHeight>
                {({ width }) => {
                  const itemCount = getColumnCount(this.state.locationWidths, width, REMAINDER_WIDTH);
                  const overflow = itemCount < record.locations.length;
                  const totalItemCount = itemCount + (overflow ? 1 : 0);
                  return (
                    <List
                      height={50}
                      itemCount={totalItemCount}
                      itemSize={width / totalItemCount}
                      layout="horizontal"
                      width={width}
                      style={{ flex: 1 }}
                    >
                      {({ index }) =>
                        index === itemCount ? RemainderCount(record.locations.length - itemCount) : LocationColumn(record.locations[index])
                      }
                    </List>
                  );
                }}
              </AutoSizer>
            ) : null}
          </section>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = (rootState: IRootState) => ({
  user: rootState.userManagement.user,
  loadingUser: rootState.userManagement.loading,
  account: rootState.authentication.account
});

const mapDispatchToProps = { getUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordCard);
